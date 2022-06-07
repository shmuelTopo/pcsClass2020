'use strict';

(function () {
  const socketIo = io();

  const loginForm = $('#loginForm');
  loginForm.submit(e => {
    e.preventDefault();
    socketIo.emit('login', $('#name').val(), res => {
      if (res) {
        $('#error').text(res);
      } else {
        loginForm.slideUp();
        $('#messagesContainer').slideDown();

        const messagesDiv = $('#messages');

        socketIo.on('message', msg => {
          //console.log(msg);
          //messagesDiv.append(`<div>${msg}</div>`)
          messagesDiv.append(`<div>${msg.user} said: ${msg.msg}</div>`)
        });

        socketIo.on('info', msg => {
          messagesDiv.append(`<div class="error">${msg}</div>`)
        });

        const messageInput = $('#message');

        $('#messageForm').submit(e => {
          e.preventDefault();
          socketIo.emit('message', messageInput.val());
          messageInput.val('');
        });
      }
    });
  });
}());