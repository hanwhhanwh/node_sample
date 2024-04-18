/**
 * @summary Jetson SPI loopback demo
 * @author hbesthee@naver.com
 * date : 2024-04-09
 */
const spi = require('spi-device');

// The JETSON SPI is on bus 0 and it's device 0
const spidev = spi.open(0, 0, err => {
  // An SPI message is an array of one or more read+write transfers
  const to_send = [1, 7, 0, 2, 1, 69, 5, 6];
  const message = [{
    sendBuffer: Buffer.from(to_send), // Sent to 8 bytes
    receiveBuffer: Buffer.alloc(to_send.length), // Raw data read-buffer
    byteLength: to_send.length,
    speedHz: 500000 // Hz
  }];

  if (err) throw err;

  spidev.transfer(message, (err, message) => {
    if (err) throw err;

    console.log(message[0].receiveBuffer);
  });
//   msg = spidev.transferSync(message);
//   console.log('received data:');
//   for (let index = 0 ; index < msg.byteLength ; index ++) {
// 	console.log(message.receiveBuffer[index]);
//   }

});