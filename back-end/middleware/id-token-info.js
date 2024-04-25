const jwt_decode = require('jwt-decode');

function getIdTokenInfo(req, res, next) {
    let id_token = req.cookies.id_token;
    if (id_token) {
        id_token_info = jwt_decode(id_token);
        req.idTokenInfo = id_token_info;
    }
    next();
}

module.exports = getIdTokenInfo;