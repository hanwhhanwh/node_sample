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
// @run-at       document-end
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

	// Your code here...
	let div = window.document.querySelector("#center");
	try
	{
		let video_id = window.document.location.toString().split('/watch?v=')[1];
		video_id = video_id.split('&')[0]

		let o = document.createElement("button");
		o.id = "youtube_dl";
		o.className = "style-scope ytd-masthead";
		o.setAttribute("type", "button");
		o.setAttribute("title", "Download video");
		o.setAttribute("style", "backgroundColor:#ff003e;");
		o.innerHTML = "DL"
		o.addEventListener("click", function (o) {
			let v_id = window.document.location.toString().split('/watch?v=')[1];
			v_id = v_id.split('&')[0]

			if (v_id)
			{
				console.log(`Download youtube video : ${v_id}`);
				let strURL = `http://localhost:35000/youtube_dl?video_id=${v_id}`;
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
							console.log(`${v_id}: added download queue.`)
							alert(`${v_id}: added download queue.`)
						}
					})
					.catch(err => {
						console.log(`${v_id} download error`)
						console.log(err)
					})
			}
		}, !0);
		// o.setAttribute("style", "min-height:25px; position:relative; top:1px; cursor: pointer; font: 13px Arial; background: #ff003e; color: #fff; text-transform: uppercase; display: block; padding: 10px 16px; margin: 20px 5px 10px 5px; border: 1px solid #ff0068; border-radius: 2px; font-weight:bold");
		o.setAttribute("onmouseover", "this.style.backgroundColor='#c10841'");
		o.setAttribute("onmouseout", "this.style.backgroundColor='#ff003e'");
		div.insertBefore(o, div.firstChild);

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
	catch (o) {
		console.log("Error youtube download: ", o);
	}
	console.log(div);

	window.addEventListener('hashchange', function() {

		alert(`Hash Changed : ${window.location.href}`);
	
	});
})();