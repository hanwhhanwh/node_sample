/**
 * 수퍼빈(superbin)의 라이브러리
 * make	hbesthee@naver.com
 * date	2023-11-23
 */


/** 수퍼빈 장치 1개에 대한 상태정보를 가져와(fetch)서 화면에 출력할 HTML 형식으로 만들어 반환합니다. 
 * @param {string} device_id 수퍼빈 장치에 대한 고유 ID 문자열
*/
async function fetch_device_status(device_id)
{
	let url = `https://deviceapi.superbin.co.kr/device/${device_id}/status`
	let res = await fetch(url)

	device_status = await res.json()
	if (!device_status)
	{
		console.log(`cannot fetch device status : ${device_id}`)
		return ''
	}
	let device_name = device_status.device_name.toString().replace('동', '동<br />');
	let storage_type, storage_count, storage_status = '';
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
	let device_status_html = `<tr><td align=center>${device_name}</td><td>${storage_status}</td><td align=center>${total_status_string}</td><td>${last_update_date}</td></tr>\n`

	return device_status_html
}

/** 지정된 수퍼빈 현황 가져오기
 * @param {string} device_list_str 현황을 가져올 장치 목록
 */
async function get_superbin_status(device_list_str) {
	let device_status_table = document.querySelector('#device_status')
	if (!device_status_table)
	{
		console.log("device_status_header not found!")
		return
	}
	let device_list = device_list_str.split(',').sort(() => Math.random() - 0.5) // 배열 뒤섞기
	console.log(device_list)
	let device_status_html = '';
	for (device_id of device_list)
	{
		try
		{
			console.log(`device_id = ${device_id}`)
			device_status_html = await fetch_device_status(device_id);
			// console.log(`device_status_html = ${device_status_html}`)
			if (device_status_html != '')
			{
				let frag = document.createDocumentFragment(), tr_tag = document.createElement('tr')
				tr_tag.innerHTML = device_status_html
				device_status_table.appendChild(tr_tag)
			}
		}
		catch(exception)
		{
			console.log(`fetch_device_status exception: ${exception}`)
			continue;
		}
	};
}