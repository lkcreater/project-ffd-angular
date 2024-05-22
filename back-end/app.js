const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');
const swaggerDocument = YAML.load('./swagger.yaml');
// const swaggerDocument = require('swagger.json');
const dotenv = require("dotenv");
let pathConfigEnv = './configuration/configuration.ini';
if(process.env.NODE_ENV == 'local') {
    pathConfigEnv = './configuration/configuration.local.ini';
}
dotenv.config({ path: pathConfigEnv });
const env = require('./configuration');
const { v4: uuid } = require('uuid');
const cors = require('cors');

var isProduction = process.env.NODE_ENV === 'production';

// Create global app object
const app = express();

//--cors origin
app.use(cors())

app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = 0;
    next();
});
app.use(bodyParser.json({
    limit: env.PAYLOAD_SIZE
}));
app.use(bodyParser.urlencoded({
    limit: env.PAYLOAD_SIZE,
    parameterLimit: 100000,
    extended: true
}));
  
app.use(cookieParser())

app.get('/', function (req, res) {
    res.send({ status: 'ok' });
});

app.get('/App-HealthCheck', function (req, res) { 
    res.send({ status: 'ok' }); 
});

const typeORMService = require("./commons/typeorm.js");
try {
    typeORMService.initialize().then(() => {
        console.log('Connection has been established successfully.');
    });
} catch (error) {
    console.error('Unable to connect to the database:', error);
}

// Generate SessionId
app.use(function (req, res, next) {
    // TODO get sessionId from request
    const SESSION_ID = uuid();
    req.sessionId = SESSION_ID;
    next();
});

// Routes
app.use(require('./routes'));
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    // var err = new Error('404 Not Found');
    // err.status = 404;
    // next(err);
});

/// error handlers
const RESPONSE = require('./middleware/response');

// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res, next) {
    if (!isProduction) {
        console.log(err.stack);
    }
    res.status(err.statusCode || 500);
    RESPONSE.exception(res, req.sessionId, err)
});

module.exports = app;
