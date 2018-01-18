let app = require('express')();
let http = require('http').Server(app);
let io = require('socket.io')(http);
var _ = require('underscore');
 
let users = [];  // 所有用户

let allUser = [];

// 群聊用户名单
let roomInfo = {};

io.on('connection', (socket) => {
	// console.log('user connected');

	let roomId = '';
	let user= {};
	let userVid = '';
	let userStatus = 1;   // 1：在这个群（默认），0：不在这个群

	// 有房间被打开
	socket.on('room-join', function(roomJson) {
		roomId = roomJson.toVid;
		user = roomJson.user;
		userVid = user.userVid;
		userStatus = 1;
		// 判断该房间是否存在
		if(!roomInfo[roomId]){
			roomInfo[roomId] = [];
		}
		// 将用户id加入房间名单中
		if(roomInfo[roomId].indexOf(userVid) === -1){
			roomInfo[roomId].push(userVid);
		}

		// 加入房间
		socket.join(roomId);

		// 通知房间内人员
		io.to(roomId).emit('sys', userVid + '加入了房间', roomInfo[roomId]);
		console.log(userVid + '加入了' + roomId);
		console.log('当前room：' + roomId);
	})

	// 发送消息
	socket.on('message', function(msg) {
		// console.log(roomInfo[roomId].indexOf(user))
		// 验证如果用户不在房间内则不给发送
		if(roomId != ''){
			if(roomInfo[roomId].indexOf(userVid) === -1){
				return false;
			}
			if(userStatus == 1){
				let time = getTime();
				io.to(roomId).emit('msg', user, msg, time, roomId);
				console.log(userVid + ' say:' + msg + ',in room:' + roomId);
			}else{
				console.log(userVid + ' left');
			}
		}			
	})

	// 离开房间
	socket.on('leave-room', function(leaveJson) {
		userStatus = 0;
		if(roomId != ''){
			let index = roomInfo[roomId].indexOf(userVid);
			if(index !== -1){
				roomInfo[roomId].splice(index, 1);
			}

			socket.leave(roomId);

			io.to(roomId).emit('sys', user.userName + '退出了房间', roomInfo[roomId]);
			console.log(userVid + '退出了' + roomId);
		}
		io.to(roomId).emit('leave', userVid + '离开了群' + leaveJson.oldVid + ',加入了群' + leaveJson.newVid);
	})



	// 从名单中移除
	socket.on('disconnect', function() {
		if(roomId != ''){
			let index = roomInfo[roomId].indexOf(userVid);
			if(index !== -1){
				roomInfo[roomId].splice(index, 1);
			}

			socket.leave(roomId);

			io.to(roomId).emit('sys', user.userName + '退出了房间', roomInfo[roomId]);
			console.log(userVid + '退出了' + roomId);
		}
	})

	// 通知用户已经上线
	socket.on('addUser', function(userVid) {
		console.log(userVid + ' 上线了');
	})
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