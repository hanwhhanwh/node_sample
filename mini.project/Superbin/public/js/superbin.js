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

/** 지정된 수퍼빈 현황 가져오기 */
async function get_superbin_status(device_list_str) {
	let device_list = device_list_str.split(',');
	let device_status_list = {};
	let device_list_html = '<tr><th>위치</th><th>수량</th><th>상태</th><th>마지막 갱신일</th></tr>';
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
	return device_list_html
}