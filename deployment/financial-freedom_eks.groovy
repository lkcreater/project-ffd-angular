#!groovy​
@Library('utils')
import org.tisco.utilities.security.*

static String replaceSlash(text) {
	if (text) {
	 	return text.replaceAll('/','\\/').trim();
	} else {
		return text;
	}
} 
   
// echo ${env.JOB_NAME}
def mode = env.environment_mode
env.env_mode = env.environment_mode

println "environment_mode => " + env.environment_mode

env.app_code = "1359" 
env.app_version = "v1"
env.app_profile = "app"
env.project_name = "finfreedombackweb"
env.project_dir = "./"
env.logger_config = "APP"
env.logger_level = "DEBUG"

def git_repo_url = scm.getUserRemoteConfigs()[0].getUrl()
def git_branch = scm.getBranches()[0].getName().replace("*/", "")

// ECS Required
env.app_name = env.project_name + env.app_version + env.app_profile
env.build_number = "build-" + env.BUILD_NUMBER
env.deploy_bucket = "tisco.alpha.ecs.deployment"
env.job_trigger = env.JOB_NAME + "-gitops"

env.environment_path = 'back-end/configuration/configuration.ini'

node_label='ecs-node20'
node(node_label) {
	try {
		stage('Prepare - Git clone from Branch') {
			if (env.tag_version != "" && env.tag_version != null) {
				env.docker_tag = env.tag_version

				checkout([
					$class: 'GitSCM', 
					branches: [[name: 'refs/tags/' + env.tag_version]], 
					userRemoteConfigs: [[url: git_repo_url]]
				])
			} 
			else if (env.commit_hash != "" && env.commit_hash != null) {
				env.docker_tag = env.commit_hash

				checkout([
					$class: 'GitSCM', 
					branches: [[name: env.commit_hash]],
					userRemoteConfigs: [[url: git_repo_url]]
				])
			} 
			else {
                env.docker_tag = git_branch
                git branch: git_branch, url: git_repo_url
			}

			env.docker_tag = env.docker_tag.replace("/", "_").trim()
            env.deploy_package = env.app_name + '-' + env.docker_tag + '-' + env.build_number + '.zip'
			println "docker_tag => " + env.docker_tag
			println "deploy_package => " + env.deploy_package
		}
		
		stage('Prepare Configuration') {
			env.OKTA_REDIRECT_URI = replaceSlash(env.OKTA_REDIRECT_URI)
			env.OKTA_SERVICE_ENDPOINT = replaceSlash(env.OKTA_SERVICE_ENDPOINT)
			env.IDENTITY_SERVICE_ENDPOINT = replaceSlash(env.IDENTITY_SERVICE_ENDPOINT)
			env.DEP_URL_JOURNAL = replaceSlash(env.DEP_URL_JOURNAL)
			env.AG_URL = replaceSlash(env.AG_URL)
			env.COLLAB_URL = replaceSlash(env.COLLAB_URL)
			env.OUTPUT_URL = replaceSlash(env.OUTPUT_URL)
			env.DATABASE_URL = replaceSlash("postgres://" + env.DATABASE_USERNAME + ":" + env.DATABASE_PASSWORD + "@" + env.DATABASE_HOST + ":" + env.DATABASE_PORT + "/" + env.DATABASE_NAME)

			dir('.') {
				sh '''
					echo "Start Prepare Configuration"
					cd $project_dir
					rm -rf $environment_path
					mv back-end/configuration/configuration.prod.ini $environment_path
					rm -rf $deploy_package_old
					echo "Prepare Configuration Success"
				'''
			}
			def masker = new PasswordMasking()
			masker.replace(env.environment_path)
	    }

		if (env.environment_mode == "alpha") { 
			stage('Build Frontend'){
				dir('.') {
					sh '''
						echo "Start Build Frontend"
						cd $project_dir/front-end
						bash -c -i "npm install --force"
						bash -c -i "npm run build"
						echo "Build Frontend Success"
					'''
				}
			}
		}

		
		stage('Upload Deploy Packages') {
			dir('.'){
				sh '''
					rm -rf tmp; mkdir tmp; mkdir tmp/config; mkdir tmp/app; mkdir tmp/newman;
					rsync -a --progress $project_dir/* tmp/app/ --exclude tmp --exclude newman --exclude .git --exclude front-end 1>/dev/null
					rsync -a --progress $project_dir/newman/ tmp/newman/ 1>/dev/null
					rsync -a --progress $environment_path tmp/config/env.ini 1>/dev/null
					mv tmp/newman/environment_eks.json tmp/newman/environment.json
					cd tmp; zip -r $deploy_package app newman config 1>/dev/null
					aws s3api put-object --bucket $deploy_bucket --key $app_name/$deploy_package --body $deploy_package 1>/dev/null
					rm -rf $deploy_package
				'''
			}
		}
    
	} catch (e) {
		echo "Something went wrong terminate revision"
        throw e
	} finally {
		cleanWs()
	}
}

stage ('Build Downstream Job') {
	build job: env.job_trigger, parameters: [
		[$class: 'StringParameterValue', name: 'app_name', value: env.app_name],
		[$class: 'StringParameterValue', name: 'deploy_package', value: env.deploy_package],
		[$class: 'StringParameterValue', name: 'docker_tag', value: env.docker_tag],
		[$class: 'StringParameterValue', name: 'build_number', value: env.build_number]
	], wait:true
}
