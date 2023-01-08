/**
 * @summary Download button for Youtube Downloader
 * @author hbesthee@naver.com
 * @date 2022-12-27
*/

// ==UserScript==
// @name         Download button for Youtube Downloader
// @namespace    https://www.youtube.com/
// @version      0.1
// @description  Download button for Youtube Downloader
// @author       hbesthee@naver.com
// @match        https://www.youtube.com/watch?*
// @icon         https://www.youtube.com/favicons?domain=tampermonkey.net
// @run-at       document-idle
// @grant        GM_listValues
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @grant        GM_xmlhttpRequest
// @grant        GM_info
// @grant        GM_openInTab
// @grant        GM_setClipboard
// @grant        GM_registerMenuCommand
// @grant        GM_unregisterMenuCommand
// @grant        GM_notification
// @grant        GM_download
// @grant        GM.info
// @grant        GM.listValues
// @grant        GM.setValue
// @grant        GM.getValue
// @grant        GM.deleteValue
// @grant        GM.openInTab
// @grant        GM.setClipboard
// @grant        GM.xmlHttpRequest
// ==/UserScript==

(function() {
	'use strict';


	/**
	 * 입력한 유튜브 영상 클립의 고유 ID에 해당하는 영상을 다운로드 받습니다.
	 * @param {string} video_id 유튜브 영상 클립의 고유 ID 문자열
	 * @param {string} force_download 'y' = 다운로드 이력과 무관하게 다운로드, 'n' 다운로드 이력이 있으면 다운로드하지 않고 무시함
	 */
	let download_youtube_clip = function(video_id, force_download)
	{
		let strDownloadURL = `http://localhost/youtube_dl?video_id=${video_id}&force_download=${force_download}`;
		let options = { method: 'GET' }

		fetch(strDownloadURL, options)
			.then(res => res.json())
			.then(res => {
				if (res.resultCode == 200)
				{
					console.log(`YOUTUBE_DL download complete: ${video_id}`)
				}
				else
				{
					console.log(`youtube_dl API Error: ${res}`)
				}
			})
			.catch(err => {
				console.log(`download_youtube_clip: ${video_id} download error`)
				console.log(err)
			})
	}


	// 유튜브 다운로드 버튼에 대한 핸들러
	let dl_button_handler = function(o)
	{
		let v_id = window.document.location.toString().split('/watch?v=')[1];
		v_id = v_id.split('&')[0]

		if (v_id)
		{
			console.log(`Download youtube video : ${v_id}`);
			let strURL = `http://localhost:35000/youtube_dl?video_id=${v_id}`;
			let options =
				{
					method: 'GET',
					headers: { 'Content-Type': 'application/json; charset=utf-8' }
				}

			fetch(strURL, options)
				.then(res => res.json())
				.then(res => {
					let force_download = 'n'
					if (res.resultCode == 200)
					{
						let ret = confirm(`${v_id}: already downloaded '${1}'\nDo you want to re-download?`)
						if (ret)
						{
							// Re-download same youtube clip
							force_download = 'y'
						}
						else
						{
							return // end
						}
					}
					if ( (res.resultCode == 404) || (force_download == 'y') ) // not exist download-log => new clip
					{
						download_youtube_clip(v_id, force_download)
					}
					else if ((res.resultCode != 200) && (res.resultCode != 404))
					{ // error occured
						console.log(`YOUTUBE_DL: Error occurred!!!`)
						console.log(res)
					}
				})
				.catch(err => {
					console.log(`YOUTUBE_DL: ${v_id} download error`)
					console.log(err)
				})
		}
		else
		{
			console.log(`Error(dl_button_handler): video_id not found`)
		}
	}

	// 유튜브 다운로드 버튼 생성하여 삽입 처리
	let insert_dl_button = function()
	{
		let video_id = window.document.location.toString().split('/watch?v=')[1];
		video_id = video_id.split('&')[0]
		if (!video_id)
		{
			console.log(`Error(YOUTUBE_DL): video_id parameter not found!!!`)
			return null
		}

		let center_div = window.document.querySelector("#center");
		if (!center_div)
		{
			console.log(`Error(YOUTUBE_DL): center div not found!!!`)
			return null
		}

		let o = document.createElement("button");
		o.id = "youtube_dl";
		o.className = "style-scope ytd-masthead";
		o.setAttribute("type", "button");
		o.setAttribute("title", "Download video");
		o.setAttribute("style", "backgroundColor:#ff003e;");
		o.innerHTML = "DL"
		o.addEventListener("click", dl_button_handler)
		o.setAttribute("onmouseover", "this.style.backgroundColor='#c10841'");
		o.setAttribute("onmouseout", "this.style.backgroundColor='#ff003e'");
		center_div.insertBefore(o, center_div.firstChild);

		return o
	}

	let center_div = window.document.querySelector("#center");
	console.log(center_div);
	try
	{
		if (center_div)
			{ insert_dl_button() }
		else
			{ setTimeout(insert_dl_button, 2000) }

		let video_id = window.document.location.toString().split('/watch?v=')[1];
		video_id = video_id.split('&')[0]

		// 다운로드 받았던 것인지 확인합니다.
		let strURL = `http://localhost:35000/youtube_dl?video_id=${video_id}`;
		let options = {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json; charset=utf-8'
				, 'dataType': 'json'
				// , 'credentials': 'same-origin'
			}
		}

		fetch(strURL, options)
			.then(res => res.json())
			.then(res => {
				if (res.resultCode == 200) {
					console.log(`previous downloaded: ${video_id} => ${res.resultData}`)
					alert(`${video_id}: already downloaded.`)
				}
			})
			.catch(err => {
				console.log(`${video_id}`)
				console.log(err)
			})
	}
	catch (e)
	{
		console.log(`Error youtube download: ${e}`);
	}

	window.addEventListener('hashchange', function()
	{
		alert(`Hash Changed : ${window.location.href}`);
	});

})();