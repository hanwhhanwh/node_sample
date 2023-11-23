/**
 * 수퍼빈(superbin)의 기기 상태 정보 관련 모듈
 * make	hbesthee@naver.com
 * date	2022-10-29
 */

let request = require('request');


module.exports.get_device_status = async function(device_id, callback)
{
	if ( (device_id == undefined) || (device_id.trim == '') )
		return

	let options = {
		headers: {'Content-Type': 'application/json'},
		url: `http://deviceapi.superbin.co.kr/device/${device_id}/status`,
		body: null
	};

	await request.post(options, function (err, res, result) {
		if (err)
		{
			callback('error', err);
			return;
		}

		switch (res.statusCode) {
			case 200:
				callback(null, JSON.parse(result));
				break;
			default:
				callback('error', JSON.parse(result));
				break;
		}
	});
}
