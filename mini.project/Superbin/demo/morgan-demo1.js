const express = require('express');
const path = require('path');
const morgan = require('morgan');

const app = express();
app.set('port', process.env.PORT || 3000);

// // morgan 미들웨어 연결
if (process.env.NODE_ENV === 'production') { 
	app.use(morgan('combined')); // 배포환경이면
} else {
	app.use(morgan('dev')); // 개발환경이면
}

app.get('/', (req, res) => { 
	res.send('Hello, index');
});

app.listen(app.get('port'), () => {
	console.log(app.get('port'), '번 포트에서 대기 중');
});