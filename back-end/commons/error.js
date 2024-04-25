class Exception extends Error {
    constructor(args) {
        super(args);
        this.name = 'Exception';
        this.code = '30000';
        this.statusCode = 200;
    }
}

class WarningException extends Exception {
    constructor(args) {
        super(args);
        this.name = 'WarningException';
        this.code = '40000';
        this.statusCode = 200;
    }
}

class UnauthorizedException extends Exception {
    constructor(args) {
        super(args);
        this.name = 'UnauthorizedException';
        this.code = '10000';
        this.statusCode = 200;
    }
}

class NotFoundException extends Exception {
    constructor(args) {
        super(args);
        this.name = 'NotFoundException';
        this.code = '31000';
        this.statusCode = 200;
    }
}

class ExternalServiceException extends Exception {
    constructor(args) {
        super(args);
        this.name = 'ExternalServiceException';
        this.code = '50000';
        this.statusCode = 200;
    }
}

class UniqueException extends WarningException {
    constructor(args) {
        super(args);
        this.name = 'UniqueException';
        this.code = '41000';
        this.statusCode = 200;
    }
}

module.exports = {
    UnauthorizedException, ExternalServiceException, NotFoundException, Exception, UniqueException, WarningException
}