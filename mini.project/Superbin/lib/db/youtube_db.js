const mariadb = require('mariadb');
const youtube_db_info = require('./youtube_db_info.js')

// Connection Pool 생성
const pool = mariadb.createPool({
	host: youtube_db_info.DB_HOST
	, port: youtube_db_info.DB_PORT
	, user: youtube_db_info.DB_USER
	, password: youtube_db_info.DB_PASSWORD
	, database: youtube_db_info.DB_NAME
	, connectionLimit: youtube_db_info.CONNECTION_LIMIT
});


/**
 * video_id에 해당하는 다운로드 이력 정보를 확인하여 반환합니다.
 * @param {string} video_id Youtube CLIP의 video_id 문자열
 * @returns 데이터베이스에서 video_id 정보가 있으면 해당 정보를 JSON 형태로 반환함. 없으면 resultData = null
 */
async function getYoutubeClipInfo(video_id){
	let conn, rows;
	try{
		conn = await pool.getConnection();
		strQuery = `
SELECT
	clip_no, member_no, clip_id, channel_id, author
	, title, length, publish_date, thumbnail_url, description
	, reg_date
FROM CLIP AS C
WHERE 1 = 1
	AND C.clip_id = ?
;`
		values = [video_id]
		rows = await conn.query(strQuery, values);
		if (rows[0])
			return { resultCode: 200, resultMsg: `success`, resultData: rows[0] };
		else
			return { resultCode: 404, resultMsg: `not found` }; // 다운로드 이력 없음
	}
	catch(err){
		return { resultCode: 500, resultMsg: `query exection error: ${err}` };
	}
	finally {
		if (conn)
			conn.end();
	}
}


/**
 * video_id에 해당하는 Youtube CLIP 정보를 저장하고 그 처리 결과를 반환합니다.
 * @param {json} youtube_info Youtube CLIP의 정보가 담겨 있는 객체
 * @returns 정보의 저장 성공 여부
 */
async function insertYoutubeClipInfo(youtube_info){
	let conn, rows;
	try{
		conn = await pool.getConnection();
		strInsertQuery = `
INSERT INTO CLIP
(
	member_no, clip_id, channel_id, author, title
	, length, publish_date, thumbnail_url, description
)
VALUES
(
	?, ?, ?, ?, ?
	, ?, ?, ?, ?
)
;`
		values = [1, youtube_info.clip_id, youtube_info.channel_id, youtube_info.author, youtube_info.title
			, youtube_info.length, youtube_info.publish_date, youtube_info.thumbnail_url, youtube_info.description]
		rows = await conn.query(strInsertQuery, values);
		return { resultCode: 200, resultMsg: `success`, resultData: rows[0] };
	}
	catch(err){
		return { resultCode: 500, resultMsg: `query exection error: ${err}` };
	}
	finally {
		if (conn)
			conn.end();
	}
}


module.exports = {
	version: 2
	, getYoutubeClipInfo: getYoutubeClipInfo
	, insertYoutubeClipInfo: insertYoutubeClipInfo
}
