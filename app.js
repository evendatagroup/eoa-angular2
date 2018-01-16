let app = require('express')();
let http = require('http').Server(app);
let io = require('socket.io')(http);
var _ = require('underscore');
 
let users = [];  // 所有用户

io.on('connection', (socket) => {
	// console.log('user connected');

	// 构造客户端对象
	let client = {
		socket: socket,
		name: false,
		color: getColor()
	}

	// 群聊
	socket.on('room', function(roomMsgJson) {
		console.log(roomMsgJson.createUserVid + ' login, in room ' + roomMsgJson.toVid);
		let obj = {
			createTimestamp: getTime(),
			createUserVid: roomMsgJson.createUserVid,
			roomId: roomMsgJson.toVid,
			content: roomMsgJson.content,
			avatar: roomMsgJson.avatar
		}

		socket.join(obj.roomId);

		io.sockets.in(obj.roomId).emit('room-message', obj);
	})

	// 对message事件的监听
	socket.on('message', (sendMsgJson) => {
		let obj = {
			time: getTime(),
			color: client.color
		}

		// 判断是不是第一次连接，
		if(!client.name){
			client.name = sendMsgJson.name;
			socket.name = sendMsgJson.name;
			obj['text'] = sendMsgJson.text;
			obj['name'] = sendMsgJson.name;
			obj['type'] = 'welcome';
			console.log(client.name + ' login')
		}else{
			// 如果不是第一次就正常聊天
			obj['text'] = sendMsgJson.text;
			obj['name'] = client.name;
			obj['type'] = 'message';
			console.log(client.name + ' say:' + sendMsgJson.text)
		}

		if(sendMsgJson.to == ''){
			// 广播
			socket.emit('message', obj);  
  			socket.broadcast.emit('message', obj);  
  			console.log('广播')
		}else{
			// 私聊
			let to_userVid = sendMsgJson.to;
	 		let to_socket;
	 		if(to_socket = _.findWhere(io.sockets.sockets, { name: to_userVid })){
	 			to_socket.emit('message', obj);
	 			socket.emit('message', obj);
	 		}
	 		console.log('私聊')
		}

	})
  
 	socket.on('disconnect', function(){
  		console.log(client.name, ' disconnected');
  		let obj = {
  			time: getTime(),
  			color: client.color,
  			name: 'System',
  			text: client.name,
  			type: 'disconnect'
  		}

  		socket.broadcast.emit('message', obj)
 	});
    
 	socket.on('add-message', (sendMsgJson) => {
  		socket.emit('message', {name: sendMsgJson.name, text: sendMsgJson.text, type:'new-message', id: socket.name});  
  		socket.broadcast.emit('message', {name: sendMsgJson.name, text: sendMsgJson.text, type:'new-message', id: socket.id});  
 	});

 	socket.on('setName', (data) => {
 		socket.name = data;
 	})

 	socket.on('to-message', (sendMsgJson) => {
 		let to_userVid = sendMsgJson.to;
 		let to_socket;
 		if(to_socket = _.findWhere(io.sockets.sockets, { name: to_userVid })){
 			to_socket.emit('message', sendMsgJson);
 			socket.emit('message', {name: sendMsgJson.name, text: sendMsgJson.text, type:'new-message', id: socket.name});
 		}
	});
});
 
http.listen(3000, () => {
 console.log('started on port 3000');
});

// 获取当前时间
let getTime = function() {
  let date = new Date();
  return date.getHours()+":"+date.getMinutes()+":"+date.getSeconds();
}

//
let getColor = function() {
  let colors = ['aliceblue','antiquewhite','aqua','aquamarine','pink','red','green',
                'orange','blue','blueviolet','brown','burlywood','cadetblue'];
  return colors[Math.round(Math.random() * 10000 % colors.length)];
}