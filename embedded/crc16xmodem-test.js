/**
 * @summary Implemetation CRC-16/XMODEM function
 * @author hbesthee@naver.com
 * date : 2024-04-19
 * 
 * npm i crc
 */
const crc16xmodem_0 = require('crc/calculators/crc16xmodem');

const crc16xmodem = (current, from, len, previous) => {
	from = typeof from !== 'undefined' ? from : 0;
	len = typeof len !== 'undefined' ? len : current.length - from;
	let crc = typeof previous !== 'undefined' ? ~~previous : 0x0;
	for (let index = 0; index < len; index++) {
		let code = (crc >>> 8) & 0xff;
		code ^= current[from + index] & 0xff;
		code ^= code >>> 4;
		crc = (crc << 8) & 0xffff;
		crc ^= code;
		code = (code << 5) & 0xffff;
		crc ^= code;
		code = (code << 7) & 0xffff;
		crc ^= code;
	}
	return crc;
};


const buf1 = Buffer.from([0xAA, 0xAA, 0x00, 0x00, 0x00]);
const crc1 = crc16xmodem_0(buf1)
console.log('crc1 = ' + crc1.toString(16));

const buf2 = Buffer.from([0x02, 0xAA, 0xAA, 0x00, 0x00, 0x00, 0x00, 0x00, 0x03]);
const crc2 = crc16xmodem(buf2, 1, 5)
console.log('crc2 = ' + crc2.toString(16));

// asserts(crc1, crc2);
