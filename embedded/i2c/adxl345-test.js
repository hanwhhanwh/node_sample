// import ADXL345 from './ADXL345.js';
const ADXL345 = require('./ADXL345.js');
const adxl345 = new ADXL345(); // defaults to i2cBusNo 1, i2cAddress 0x53

// Read ADXL345 three-axis acceleration, repeat
//
const getAcceleration = () => {
  adxl345.getAcceleration(true) // true for g-force units, else false for m/s²
    .then((acceleration) => {
      console.log(`acceleration = ${JSON.stringify(acceleration, null, 2)}`);
      setTimeout(getAcceleration, 1000);
    })
    .catch((err) => {
      console.log(`ADXL345 read error: ${err}`);
      setTimeout(getAcceleration, 2000);
    });
};

// Initialize the ADXL345 accelerometer
//
adxl345.init()
  .then(() => {
    console.log('ADXL345 initialization succeeded');
    getAcceleration();
  })
  .catch((err) => console.error(`ADXL345 initialization failed: ${err} `));