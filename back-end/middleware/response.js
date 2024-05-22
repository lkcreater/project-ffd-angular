function success(res, uuid, data, msg, args = []) {
    if (args.length > 0) {
        args.forEach((value, index) => {
            const placeholder = new RegExp('\\{' + index + '\\}', 'g');
            msg = msg.replace(placeholder, value);
        });
    }
    meta = {
        response_ref: uuid,
        response_desc: msg ? msg : 'success',
        response_code: 20000,
        response_datetime: new Date().toLocaleString(),
    }
    return res.json({ meta, data })
}

function successWithCookie(res, uuid, data) {
    const jwt_decode = require('jwt-decode');    
    const access_token = data.access_token;
    const access_token_info = jwt_decode(access_token);
    const id_token = data.id_token;
    const refresh_token = data.refresh_token;
    const maxAge = data.expires_in * 1000;
    const meta = {
        response_ref: uuid,
        response_desc: 'success',
        response_code: 20000,
        response_datetime: new Date().toLocaleString(),
    };

    res.cookie('access_token', access_token, { maxAge, httpOnly: true, secure: true });
    res.cookie('id_token', id_token, { maxAge, httpOnly: true, secure: true });
    res.cookie('refresh_token', refresh_token, { maxAge, httpOnly: true, secure: true });
    res.cookie('session_expire', access_token_info.exp, { maxAge, httpOnly: false, secure: false });

    return res.json({ meta })
}

function exception(res, uuid, err, args = []) {
    if (args.length > 0) {
        args.forEach((value, index) => {
            const placeholder = new RegExp('\\{' + index + '\\}', 'g');
            err = err.replace(placeholder, value);
        });
    }
    meta = {
        response_ref: uuid,
        response_desc: typeof err == 'string' ? err : err?.message,
        response_code: err?.code || 30000,
        response_datetime: new Date().toLocaleString(),
    }
    return res.json({ meta })
}

function exceptionValidate(res, uuid, err) {
    const errorMessages = Object.entries(err).map(([key]) => `${key}`).join(', ');
    const text = errorMessages !== '' ? `[${errorMessages}]` : 'validate input'
    meta = {
        response_ref: uuid,
        response_desc: `${text} required!`,
        response_code: err?.code || 30000,
        response_datetime: new Date().toLocaleString(),
    }
    return res.json({ meta })
}

function file(res, fileName, file) {
    const mime = require('mime-types');
    let contentType = mime.lookup(fileName);
    res.writeHead(200, {
        'Content-Type': contentType,
        'Content-Length': file.length,
        'Content-Disposition': `inline; filename="${fileName}"`
    });
    return res.end(file);
}

module.exports = {
    success, exception, successWithCookie, file, exceptionValidate
}