const { DateTz } = require('../helpers/date-tz.helper');
const ObsClient = require('esdk-obs-nodejs');
const { v4: uuidv4 } = require('uuid');
const fs = require('fs');
const util = require('util');
const env = require('../configuration');
const LOGGER = require('../middleware/logger');
const { AccountsService } = require('./account.service');

const accountsService = AccountsService;
const writeFileAsync = util.promisify(fs.writeFile);

const base64ImgtoFile = function base64ImgtoFile(base64Content, filename) {
  const arr = base64Content.split(',');
  console.log(arr);
  const mime = arr[0].match(/:(.*?);/)[1];
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }

  return new File([u8arr], filename, { type: mime })
  //return new Blob([u8arr], { type: mime });
};

class ObsClientService {
  obs;
  bucketname = env.OBS_BUCKET_NAME;
  objectName = 'OBS';

  constructor() {
    try {
      this.obs = new ObsClient({
        access_key_id: env.OBS_ACCESS_KEY_ID,
        secret_access_key: env.OBS_SECRET_ACCESS_KEY,
        server: env.OBS_ENDPOINT,
        max_retry_count: 5,
      });
    } catch (error) {
      LOGGER.error(error);
      throw Error(error?.message);
    }
  }

  async asyncPutObject(name, tempFile) {
    return new Promise((resolve, reject) => {
      this.obs.putObject({
        Bucket: this.bucketname,
        Key: name,
        SourceFile: tempFile,
      }, (err, result) => {
        if(err){
          return reject(err);
        }else{
          return resolve(result);
        }
      });
    })
  }

  async uploadFileImage(file) {
    const fileKey = this.getRenameFile(file.originalname, 'image');
    const tempFile = `./${fileKey.fileName}`;

    try {
      await writeFileAsync(tempFile, file.buffer);
      if (fs.existsSync(tempFile)) {
        const result = await this.asyncPutObject(fileKey.name, tempFile);

        let isUpload = false;
        let imageObject = null;
        if (result?.CommonMsg?.Status == 200) {
          isUpload = true;
          imageObject = accountsService.setPicture({
            object: this.objectName,
            type: file.mimetype,
            newName: fileKey.fileName,
            originalName: file.originalname,
            size: file.size,
            fileUrl: this.renameKey(fileKey.name, true),
          });
        }

        return {
          isUpload,
          item: imageObject,
        };
      }
    } catch (error) {
      throw Error(error?.message);
    } finally {
      if (fs.existsSync(tempFile)) {
        fs.unlinkSync(tempFile);
      }
    }
  }

  async getObject(name) {
    const key = this.renameKey(name);
    return new Promise((resolve, reject) => {
      this.obs.getObject({
        Bucket: this.bucketname,
        Key: key,
      }, (err, result) => {
        if(err){
          return reject(err);
        }else{
          return resolve(result);
        }
      });
    });
  }

  getRenameFile(originalName, dirName) {
    const fileExtension = originalName.split('.').pop().toLowerCase();
    const pathDate = DateTz.dateNow('YYYYMM');
    const nameFile = uuidv4();
    return {
      key: nameFile,
      fileName: `${nameFile}.${fileExtension}`,
      name: `${pathDate}/${dirName}/${nameFile}.${fileExtension}`,
    };
  }

  renameKey(key, toSlash = true) {
    if(toSlash) {
      return key.replace(/_/ig, '/');
    }else{
      return key.replace(/\//ig, '_');
    }
  }
}

module.exports = { ObsClientService: new ObsClientService() };
