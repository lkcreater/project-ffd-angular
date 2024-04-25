const axios = require('axios').default;

async function get(options) {
    const response = await axios({
        url: options.url,
        headers: options.headers
    });

    return options.fullResponse ? response : response.data;
};

async function post(options) {
    let formOptions = {};

    if(options.form){
        const params = new URLSearchParams();

        for(const key in options.form){
            params.append(key, options.form[key]);
        } 

        formOptions = {
            headers: {
                ...(options.headers || {}),
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            params: params
        }
    }

    const response = await axios({
        method: 'POST',
        url: options.url,
        headers: options.headers,
        data: options.body,
        auth: options.auth,
        ...formOptions        
    });

    return options.fullResponse ? response : response.data;
};

module.exports = {
    get, post
};