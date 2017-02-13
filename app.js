var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var path = require('path');

var index = require('./route/index.js');

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(express.static(path.join(__dirname, 'public')));

let login_users = {};
let last_messages;

app.use('/', index);

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