/**
 * 수퍼빈(superbin)의 관심 기기 목록을 출력하는 서버 개발
 * make	hbesthee@naver.com
 * date	2022-10-29
 */
'use strict'

// import express from 'express';
let cors = require('cors')
const express =  require('express')
let request = require('request')
let fs = require('fs')
const { engine } = require('express-handlebars')


let youtube_db = require('./lib/db/youtube_db')


let app = express()
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: false }));
app.engine('handlebars', engine({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');
app.set('views', './views');
// let port = app.listen(process.env.PORT || 35000);
let port = 35000;

function fetch_device_status(device_id)
{
	return new Promise((resolve, reject) =>
	{
		let options = {
			headers: {'Content-Type': 'application/json'
				, 'User-Agent': 'Mozilla/5.0 (Linux; Android 12; M2012K11AG Build/SKQ1.211006.001; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/106.0.5249.126 Mobile Safari/537.36 Superbin-Mobile'
				, 'Origin': 'http://userapp.superbin.co.kr'
				, 'Referer': 'http://userapp.superbin.co.kr/'
				, 'X-Client-Build': '101'
				, 'X-Client-Version': '0.1.1'
				, 'X-Requested-With': 'com.superbin'
				, 'x-token': 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJoYW53aCIsInVzZXJfc25vIjoiMTkwOTE3IiwiZXhwIjoxNjY3NjIzNjI3LCJpYXQiOjE2NTk4NDc2Mjd9.Iuu7LpNMg0S4cStKLiCIRg0O8VOnHGidmh6h7oipcUx340BNpvlbG4c_M3z5pCdyGjXfyQa-JdW0iAOdnLOq3A'
			},
			url: `http://deviceapi.superbin.co.kr/device/${device_id}/status`,
			body: null
		};
	
		request.get(options, function (err, res, result) {
			if (err)
			{
				// callback('error', err);
				reject(err);
			}
			else
			{
				switch (res.statusCode)
				{
					case 200:
						resolve(JSON.parse(result));
					default:
						resolve(JSON.parse(result));
				}
			}
		});	
	});
}

app.route('/')
    .get(function (req, res) {
        res.render('home', {
            device_list_str: "NCAG2106006,NCAE1906014,NCAG2003019,NCAG2106001,SNBC2205006,SNBP2205007,SNBC2107006,SNBP2107008,SNBP2107009,SNBP2107010"
        });
    });


app.get('/old', async function(req, res) {
	let device_list = fs.readFileSync(process.cwd() + '/device_list.txt').toString().split(',');
	let device_status_list = {};
	let device_list_html = '<tr><th>위치</th><th>수량</th><th>상태</th><th>마지막 갱신일</th></tr>\n';
	let device_status = null;
	for (device_id of device_list)
	{
		let storage_type, storage_count, storage_status = '';
		try
		{
			device_status = await fetch_device_status(device_id);
			device_status_list[device_id] = device_status;
			// console.log(device_status)
		}
		catch(exception) { continue; }
		try
		{
			let device_name = device_status.device_name.toString().replace('동', '동<br />');
			let storages = device_status.storage;
			if ( (storages != undefined) && Array.isArray(storages) )
			{
				for (let storage_index = 0 ; storage_index < storages.length ; storage_index++)
				{
					let storage = storages[storage_index];
					storage_type = (storage.type.toLowerCase() == 'can') ? '캔' : '페트';
					storage_count = (storage.count);
					if (storage_index == 0)
						storage_status = `${storage_type} : ${storage_count}`
					else
						storage_status += `<br />${storage_type} : ${storage_count}`
				}
			}
			let total_status = device_status.status.total_status;
			let total_status_string = (total_status == 'AVA') ? '<font color=green><b>사용<br />가능</b></font>' : 
				(total_status == 'FUL') ? '<font color=darkgray>가득참</font>' : '<font color=red>사용<br />불가</font>';
			let last_heartbeat = parseInt(device_status.connection.heartbeat);
			let heartbeat_date = new Date(last_heartbeat);
			if (heartbeat_date.getTimezoneOffset() == 0)
				heartbeat_date.setHours(heartbeat_date.getHours() + 9);
			let last_update_date = heartbeat_date.toLocaleString("ko-KR").replace('오후', '<br />오후').replace('오전', '<br />오전');
			device_list_html += `<tr><td align=center>${device_name}</td><td>${storage_status}</td><td align=center>${total_status_string}</td><td>${last_update_date}</td></tr>\n`
		}
		catch (exception) {}
	};
	res.send(`<html><head><meta charset="utf-8"><link href="/css/s.css" rel="stylesheet"></head><body><h1>수퍼빈 현황</h1>\n<table style="font-size: xxx-large;"border=1>\n${device_list_html}</table></body></htlm>`);
})


// Youtube DB API - GET ; 유튜브 영상 정보를 요청합니다.
app.get('/youtube_dl', async function(req, res) {
	// let parsedUrl = url.parse(req.url);
	// console.log(parsedUrl);
	result = null
	console.log(req.query)
	let video_id = req.query.video_id
	if (video_id == undefined)
	{
		result = `{ "resultCode":400, "resultMsg":"Bad parameter : video_id" }`
		res.json(result)
		return
	}

	if (result == null)
	{
		result = await youtube_db.getYoutubeClipInfo(video_id)
		// console.log(result)
		res.json(result)
	}
})


// Youtube DB API - POST ; 유튜브 다운로드 정보를 입력합니다.
app.post('/youtube_dl', async function(req, res) {
	// let parsedUrl = url.parse(req.url);
	// console.log(parsedUrl);
	result = null

	youtube_info = req.body
	if (!youtube_info.clip_id)
	{
		result = `{ "resultCode":400, "resultMsg":"Bad parameter : youtube infomation (body)" }`
		res.json(result)
		return
	}

	if (result == null)
	{
		result = await youtube_db.insertYoutubeClipInfo(youtube_info)
		// console.log(result)
		res.json(result)
	}
})


// add static folder : ./public 
app.use(express.static('public'))


// express start
app.listen(port, function() {
	console.log('start! express server');
})
