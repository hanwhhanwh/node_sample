const io = require('socket.io-client');


const socket = io('http://127.0.0.1:5000', {
  // path: '/myownpath'
});

socket.on('connect', () => { // 웹 소켓 연결 이벤트 처리
	console.log('connected....');
	sendRpiReqConnect();
});

socket.on('reconnect', (message) => { // 웹 소켓 재연결 이벤트 처리
	console.log('reconnect: ', sendRpiReqConnect());
	sendRpiReqConnect();
});

socket.on('S2R_RES', (message) => { // 서버로부터의 응답 메시지 처리
	console.log('----------------------------------------');
	console.log('[ S2R_RES ]');
	console.log('----------------------------------------');
	console.log('S2R_RES: message=', message);
});

socket.on('S2R_REQ', (message) => { // 서버로부터의 요청 메시지 처리
	console.log('----------------------------------------');
	console.log('[ S2R_REQ ]');
	console.log('----------------------------------------');
	console.log('S2R_REQ: message=', message);
	if(message.MSG_TYPE==='S2R_REQ_OPEN_LATCH') {
		doOpenLatch(message);
	}
});




/** 서버에서의 단말노드로의 라우팅 처리를 위한 메타데이터 수집을 위해 웹 소켓 연결 후 전송 */
function sendRpiReqConnect() {
	let reqJson = {
		MSG_TYPE: 'R2S_REQ_CONNECT',
		RPI_MAC_ADDR: '00:00:00:00:00:00', // 클라이언트마다 고유의 번호를 지정해야 합니다.
		ITEM: {}
	};
	socket.emit('R2S_REQ', reqJson);
}


function doOpenLatch(message) {
	console.log('doOpenLatch(): message=', message);
	// TODO: 여기에 Latch Open I/F를 구현하세요
}