/**
 * @summary RPi 4B SPI : ADXL345 demo
 * @author hbesthee@naver.com
 * date : 2024-04-18
 */
'use strict';

const spi = require('pi-spi');

const DATA_FORMAT		= 0x31;
const DATA_FORMAT_B		= 0x0b;
const READ_BIT			= 0x80;
const MULTI_BIT			= 0x40;
const BW_RATE			= 0x2c;
const POWER_CTL			= 0x2d;
const DATAX0			= 0x32;

const WRITE_DATA		= Buffer.alloc(7);
const READ_DATA			= Buffer.alloc(7);


let freq_max_spi		= 100000;
let v_freq				= 5;
let spi_device			= "/dev/spidev0.0";
let spi_speed			= 2000000;
let cold_start_samples	= 2;
let cold_start_delay	= 0.1;
let acc_conversion		= 2 * 16.0/8192;

// The ADXL345 is on bus 0 and it's device 0
const adxl345 = spi.initialize(spi_device);
console.log(`SPI: '${spi_device}' initialized.`);
// adxl345.dataMode(spi.mode.CPHA | spi.mode.CPOL); // mode3
adxl345.dataMode(3); // mode3
adxl345.clockSpeed(spi_speed);

/// init ADXL345
const bufInit = Buffer.alloc(2);
bufInit[0] = POWER_CTL | MULTI_BIT; bufInit[1] = 0x00;
adxl345.write(bufInit, (err, data) => { if (err) console.log(err); });
bufInit[0] = BW_RATE | MULTI_BIT; bufInit[1] = 0x0F;
adxl345.write(bufInit, (err, data) => { if (err) console.log(err); });
bufInit[0] = DATA_FORMAT | MULTI_BIT; bufInit[1] = DATA_FORMAT_B;
adxl345.write(bufInit, (err, data) => { if (err) console.log(err); });
bufInit[0] = POWER_CTL | MULTI_BIT; bufInit[1] = 0x08;
adxl345.write(bufInit, (err, data) => { if (err) console.log(err); });

setInterval(() => {
	/// Read data
	WRITE_DATA[0]			= DATAX0;
	WRITE_DATA[0]			|= MULTI_BIT;
	WRITE_DATA[0]			|= READ_BIT;
	adxl345.transfer(WRITE_DATA, WRITE_DATA.length, (err, rcv_data) => {
		if (err) {
			console.log(err);
		}
		let x = rcv_data.readInt16LE(1) * acc_conversion;
		let y = rcv_data.readInt16LE(3) * acc_conversion;
		let z = rcv_data.readInt16LE(5) * acc_conversion;
		
		console.log(`rcv_data : x = ${x}, y = ${y}, z = ${z}`);
	});
}, 1500);
