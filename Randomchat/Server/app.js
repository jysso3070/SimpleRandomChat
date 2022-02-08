const app = require('express')()
const server = require('http').createServer(app)
const cors = require('cors');
const { SocketAddress } = require('net');
const { emit } = require('process');
const { isBooleanObject } = require('util/types');
const io = require('socket.io')(server,{
    cors : {
        origin :"*",
        credentials :true
    }
});

MatchingPool = []
Roomlist = []



io.on('connection', socket=>{
    console.log('client connected...')
    var client = new Object
    client.socket = socket
    client.nextid = ''

    socket.on('message',({message}) => {
        const name = '상대방'   
        Messageto(client.nextid, name,message)
    })

    socket.on('findMatch', ()=> {
        console.log('I am in findMatch')
        
        AddMatchingPool(client.socket)
        const isConnected = ProcessMatching()
        
    })

    socket.on('updateID', userid =>{
        client.nextid = userid
        console.log('This is ' + client.socket.id + ' and my next is ' + userid)
        Messageto(client.nextid, '관리자', '상대방이 매칭되었습니다')
    })
})

Messageto = function(id, name, message){
    io.to(id).emit('message', ({name, message}))
}


const ProcessMatching = ()=>{
    Userlist = []
    console.log('I am in processmatching')
    if(MatchingPool.length > 0 && (MatchingPool.length % 2 ) == 0) {
        User1 = MatchingPool.shift()
        User2 = MatchingPool.shift()

        Userlist.push(User1)
        Userlist.push(User2)
        Roomlist.push(Userlist)

        ConnectUsers(User1,User2)

        return true
    }
    else{
        return false
    }
}

ConnectUsers = function(User1, User2){
    io.to(User2.id).emit('update_toID', User1.id)
    io.to(User1.id).emit('update_toID', User2.id)
}

const AddMatchingPool = (socket) =>{
    MatchingPool.push(socket)
}


server.listen(4000, function(){
    console.log('listening on port 4000')
})