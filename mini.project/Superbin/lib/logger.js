const path = require('path');
const { createLogger, format, transports, handleExceptions } = require("winston");

require("winston-daily-rotate-file");

// 모듈 내부에서 사용하는 환경설정 정보
let _config;



// Logger.debug('Debugging info');
// Logger.verbose('Verbose info');
// Logger.info('Hello world');
// Logger.warn('Warning message');
// Logger.error('Error info');

// setTimeout(()=>{
//     abcd();
// }, 1000);


module.exports = function (config)
{
	_config = config

	const inforDailyRotateFileTransport = new transports.DailyRotateFile(
	{
		level: _config.isProduction ? 'info' : 'debug',
		filename: `${_config.logPath}/server_%DATE%.log`,
		datePattern: "YYYY-MM-DD",
		zippedArchive: false,
		maxSize: "20m",
		maxFiles: "45d"
	});
	
	const errorDailyRotateFileTransport = new transports.DailyRotateFile(
	{
		level: 'error',
		filename: `${_config.logPath}/error_%DATE%.log`,
		datePattern: "YYYY-MM-DD",
		zippedArchive: false,
		maxSize: "20m",
		maxFiles: "45d"
	});
	// console.log('dailyRotateFileTransport=', dailyRotateFileTransport);
	
	const consoleTransport = new transports.Console(
	{
		level: _config.isProduction ? 'info' : 'debug',
		format: _config.isProduction ? format.combine(
				format.colorize(),
				format.printf(
					info => `${info.timestamp} ${info.level}: ${info.message}`
					// info => `${info.timestamp} ${info.level} [${info.label}]: ${info.message}`
				)
			)
			: format.combine(
				format.colorize(),
				format.printf(
					debug => `${debug.timestamp} ${debug.level}: ${debug.message}`
				)
			)
	});
	// console.log('consoleTransport=', consoleTransport);

	const Logger = createLogger(
	{
		level: _config.isProduction ? 'info' : 'debug',
		format: format.combine(
			// format.label({ label: path.basename(caller) }), //로그에 호출된 파일이름 기록
			format.timestamp({
				format: "YYYY-MM-DD HH:mm:ss" // 로그의 Timestamp 포멧을 지정
			}),
			format.json()
		),
		transports: _config.isProduction ? [ inforDailyRotateFileTransport ] : [
			consoleTransport,              // Console에 표시하는 형태
			inforDailyRotateFileTransport  // File에 표시하는 형태
		],
		exitOnError: false // 예외 발생 시 프로세스 종료 여부
	});
	Logger.exceptions.handle([new transports.Console({ colorize: true, json: true }), errorDailyRotateFileTransport]);

	return Logger;
}