/**
 * 로깅 처리 데모2
 * make	hbesthee@naver.com
 * date	2023-03-14
 */

// const winston = require('winston');
// const { Console } = require('winston/lib/winston/transports');
const { createLogger, transports } = require("winston");

const consoleTransport = new transports.Console();

const logger = createLogger({
	level: 'debug',
	transports: [consoleTransport]
	, stderrLevels: ['error', 'debug']
});

logger.info('This is an info log message.');
logger.warn('This is a warning log message.');
logger.error('This is an error log message.');

console.log(logger.silent)