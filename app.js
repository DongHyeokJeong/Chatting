var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var path = require('path');

let login_users = {};
let last_messages;

app.get('/', function(req, res){
    res.sendfile('index.html');
});

io.on('connection', function (socket) {

    socket.on('entrance', function (data) {  // 들어올 때 알림
        login_users[socket.id] = data.nickName;
        io.emit('entranceAlarm', {nickName:login_users[socket.id]});
        io.emit('onlineUser', login_users);
    });

    socket.on('disconnect', function() {  // 나갈 때 알림
        io.emit('exitAlarm', {nickName:login_users[socket.id]});
        delete login_users[socket.id];
        io.emit('onlineUser', login_users);
    });

    socket.on('chat message', function(msg){
        if(msg.msg) {
            if(last_messages == msg.msg) {
                io.emit('chat message', {msg:msg, alert:'Same text already posted in '});
            }
            else {
                last_messages = msg.msg
                io.emit('chat message', msg);
            }
        }
    });
});

http.listen(3000, function(){
    console.log('listening on *:3000');
});