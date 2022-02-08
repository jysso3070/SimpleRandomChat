var socket = io();
var chatWindow = document.getElementById('chatWindow'); 
var sendButton = document.getElementById('chatMessageSendBtn'); 
var chatInput = document.getElementById('chatInput');


socket.on('connect', function(){
    var name = prompt("Your Name.", '');
    socket.emit('NewConnect', name);
});

socket.on('updateMessage', function(data){
    if(data.name === 'SERVER'){
        var info = document.getElementById('info');
        info.innerHTML = data.message;

        setTimeout(() =>{
            info.innerText = '';
        }, 3000);
    }
    else{
        var chatMessageEl = drawChatMessage(data);
        chatWindow.appendChild(chatMessageEl);
        chatWindow.scrollTop = chatWindow.scrollHeight;
    }
});

sendButton.addEventListener('click', function(){
    var message = chatInput.value;

    if(!message) return false;

    socket.emit('sendMessage', {
        message
    });

    chatInput.value = '';
})

function drawChatMessage(data){
    var wrap = document.createElement('p'); 
    var message = document.createElement('span'); 
    var name = document.createElement('span'); 
    var col = document.createElement('span');

    name.innerText = data.name;
    col.innerText = ': ';
    message.innerText = data.message; 

    name.classList.add('output__user__name');
    col.classList.add('output__col');
    message.classList.add('output__user__message'); 

    wrap.classList.add('output__user'); 
    wrap.dataset.id = socket.id; 
    wrap.appendChild(name);
    wrap.appendChild(col);
    wrap.appendChild(message); 

    return wrap; 
}

