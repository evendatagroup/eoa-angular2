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
		roomId: '',
		color: getColor()
	}

	// 群聊
	socket.on('room', function(roomMsgJson) {
		console.log(roomMsgJson.createUserVid + ' login, in room ' + roomMsgJson.toVid);
		client.name = roomMsgJson.createUserVid;
		client.roomId = roomMsgJson.roomId;
		let obj = {
			createTimestamp: getTime(),
			createUserVid: roomMsgJson.createUserVid,
			roomId: roomMsgJson.toVid,
			content: roomMsgJson.content,
			avatar: roomMsgJson.avatar,
			type: 'message'
		}

		socket.join(obj.roomId);

		io.sockets.in(obj.roomId).emit('room-message', obj);
	})

	socket.on('leave', function() {
		console.log(client.name + 'leave');
		socket.leave(client.roomId);
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