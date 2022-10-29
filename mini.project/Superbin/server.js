/**
 * 수퍼빈(superbin)의 관심 기기 목록을 출력하는 서버 개발
 * make	hbesthee@naver.com
 * date	2022-10-29
 */

import express from 'express';

let app = express()
let port = app.listen(process.env.PORT || 5000);

app.get('/', function(req, res) {
	res.send("<h1>First server Start</h1>")
})

// express start
app.listen(port, function() {
	console.log('start! express server');
})