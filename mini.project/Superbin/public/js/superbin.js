async function fetch_device_status(device_id)
{
	let url = `http://deviceapi.superbin.co.kr/device/${device_id}/status`
	let res = await fetch(url)
	console.log(res)

	device_status = await res.json()
	console.log(device_status)

	return device_status
}

/** 지정된 수퍼빈 현황 가져오기 */
async function get_superbin_status(device_list_str) {
	header_tr = document.querySelector('#device_status_header')
	if (!header_tr)
	{
		console.log("device_status_header not found!")
		return
	}
	let device_list = device_list_str.split(',');
	let device_status_list = {};
	let device_list_html = '';
	let device_status = null;
	for (device_id of device_list)
	{
		let storage_type, storage_count, storage_status = '';
		try
		{
			console.log(`device_id = ${device_id}`)
			device_status = await fetch_device_status(device_id);
			// console.log(`device_status = ${device_status}`)
			device_status_list[device_id] = device_status;
			// console.log(device_status)
		}
		catch(exception)
		{
			console.log(`fetch_device_status exception: ${exception}`)
			continue;
		}
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
	console.log(device_list_html)
	return device_list_html
}