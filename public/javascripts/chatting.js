function wrapWindowByMask(){ //레이어 팝업
    //화면의 높이와 너비를 구한다.
    var maskHeight = $(window).height();
    var maskWidth = $(window).width();

    //마스크의 높이와 너비를 화면 것으로 만들어 전체 화면을 채운다.
    $('#layer').css({'width':maskWidth,'height':maskHeight});

    //애니메이션 효과 - 일단 1초동안 까맣게 됐다가 80% 불투명도로 간다.
    $('#layer').fadeIn(1000);
    $('#layer').fadeTo("slow",0.8);
}

$(document).ready(function(){
    var nickName;
    wrapWindowByMask();
    var socket = io();
    // 닉네임 입력
    $('#btn_nicknameEnter').click(function(e){
        nickName = $('#input_Nickname').val();
        socket.emit('entrance', {nickName:nickName});
        e.preventDefault();
        $('#layer').hide();
    });
    // 채팅 입력
    $('#messagesForm').submit(function(e){
        var msg = $('#m').val();
        socket.emit('chat message', {nickName:nickName, msg:msg});
        $('#m').val('');
        e.preventDefault();
    });
    //닉네임 바꾸기
    $('#btn_NicknameChange').click(function(){
        $('#input_Nickname').val('');
        wrapWindowByMask();
    });

    socket.on('chat message', function(data){
        if(data) {
            if(data.alert) {
                alert(data.alert + data.msg);
            }
            else {
                var tag = '<li><b>' + data.nickName + '</b> : ' + data.msg + '</li>';
                $('#messages').append(tag);
                $("#content").scrollTop($("#content")[0].scrollHeight);
            }
        }
    });
    // 입장 알림
    socket.on('entranceAlarm', function(msg){
        var html = '<li><b>' + msg.nickName + '  in!! </b></li>';
        $('#entrance_Exit')[0].innerHTML = html;
    });
    // 퇴장 알림
    socket.on('exitAlarm', function(msg){
        var html = '<li><b>' + msg.nickName + '  out!! </b></li>';
        $('#entrance_Exit')[0].innerHTML = html;
    });
    // 온라인 유저 표시
    socket.on('onlineUser', function(users){
        if(users) {
            var html = '<li>Now online member : ';
            for(var user in users) {
                html += users[user] + ' ';
            }
            html += '</li>';
            $('#onlineUser')[0].innerHTML = html;
        }
    });
});