const winston = require('winston');
const dateTime = require('node-datetime');
const path = require('path');
const fs = require('fs');

class Logger {
    constructor(
        logFileName = null,
        logDirPath = null,
        logToConsole = true,
        logMode = 'w'
    ) {
        // log level
        const level = 'debug';

        // log format
        const myformat = winston.format.printf(
            ({ timestamp, level, message }) => {
                return `${timestamp} - ${level} - ${message}`;
            }
        );

        const transports = [];

        // file handler
        if (logFileName && logDirPath) {
            // append timestamp and extension to logFileName
            if (logFileName != 'test')
                //logFileName += "_" + datetime.datetime.now().strftime("%Y%m%d-%H%M%S")
                logFileName += '_' + dateTime.create().format(Ymd);

            logFileName += '.log';
            logDirPath = path.join(logDirPath, logFileName);

            transports.push(
                new winston.transports.File({
                    stream: fs.createWriteStream(logDirPath, { flags: logMode })
                })
            );
        } else {
            logToConsole = true;
        }

        if (logToConsole) {
            transports.push(new winston.transports.Console());
        }

        this.logger = winston.createLogger({
            level: level,
            format: winston.format.combine(
                winston.format.timestamp(),
                myformat
            ),
            transports: transports
        });
        this.process = '';
    }

    /**
     * Helper method that adds the 'process' property
     * if it has been set.
     * Also adds the the stringified version of the data
     * object to the message on a newline.
     * Then returns the message string
     * @param {string} message String
     * @param {object} data Object to log
     * @returns message The string with process and/or data added.
     */
    formatDataAndProcess(message, data) {
        if (this.process)
            // add process string between log level and message
            message = this.process + ' - ' + message;
        if (data) {
            const formattedData = JSON.stringify(data, null, 4);
            message += '\n' + formattedData + '\n';
        }
        return message;
    }

    info(message, data = null) {
        message = this.formatDataAndProcess(message, data);
        this.logger.info(message);
    }

    debug(message, data = null) {
        message = this.formatDataAndProcess(message, data);
        this.logger.debug(message);
    }

    error(message, data = null) {
        message = this.formatDataAndProcess(message, data);
        this.logger.error(message);
    }

    finished(message) {
        message = "finished - " + message
        this.logger.debug(message);
    }
}

module.exports = Logger;

// const mylogger = new LogInterface('test', __dirname, (logToConsole = true));
const mylogger = new Logger();
mylogger.debug('Hello', { obj: 'world' });