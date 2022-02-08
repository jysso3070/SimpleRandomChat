const express = require('express');
const http = require('http')
const app = express();
const server = http.createServer(app)
const fileStream = require('fs')
const io = require('socket.io')(server);
const port = 3000;

const MATCHINGSIZE = 2;

app.use(express.static('src'));

var count = 0;

// CLIENT = {
//     name : "",
//     socket : io.socket,
// }

// ROOM = {
//     userList : [],
// }

UserList = []
MatchingPool = []
RoomList = []


app.get('/', (req, res) => {
    fileStream.readFile('./src/index.html', (err, data) =>{
        if(err) throw err;

        res.writeHead(200, {
            'Content-Type' : 'text/html'
        })
        .write(date)
        .end();
    });
});

io.sockets.on('connection', function(socket){ 
    socket.on('NewConnect', function(name){
        socket.name = name
        count += 1;
        console.log('newUser: ' + name + '| count: ' + count + '| Socket: ' + socket)

        var newClient = new Object;
        newClient.name = name;
        newClient.socket = socket;

        AddUserList(newClient);
        AddUserMatchingPool(newClient);

        var ret = ProcessMatching();
        if(ret == true)
        {
            var message = {
                name : 'SERVER',
                message : 'RandomChat Start!',
            }

            ProcessBroadCastMyRoom(socket, message);
        }
    });

    socket.on('disconnect', function(){
        var message = {
            name : 'SERVER',
            message : socket.name + ' is disconnect.',
        }

        ProcessBroadCastMyRoom(socket, message);
    })

    socket.on('sendMessage', function(data){
        // data.name = socket.name;
        // io.sockets.emit('updateMessage', data);

        var message = data;
        message.name = socket.name;

        ProcessBroadCastMyRoom(socket, message);
    });
});

AddUserList = function(client){
    UserList.push(client);
};

AddUserMatchingPool = function(client){
    MatchingPool.push(client);
};

ProcessMatching = function(){

    var poolCount = MatchingPool.length;
    console.log(poolCount);

    if(poolCount % MATCHINGSIZE === 0)
    {
        userList = []

        for(var i = 0; i < MATCHINGSIZE; ++i)
        {
            var cl = MatchingPool.shift();
            userList.push(cl);
        }

        RoomList.push(userList);

        console.log('Matching Complete, current pool count: ' + MatchingPool.length);

        return true;
    }

    return false;
};

ProcessFindMyRoom = function(socket){

    for(var i = 0; i < RoomList.length; ++i)
    {
        for(var j = 0; j < RoomList[i].length; ++j)
        {
            if(RoomList[i][j].socket === socket)
            {
                return RoomList[i];
            }
        }

        // if(RoomList[i][0].socket === socket || RoomList[i][1].socket === socket)
        // {
        //     return RoomList[i];
        // }
    }

    return null;
}

ProcessBroadCastMyRoom = function(socket, message){
    var ret = ProcessFindMyRoom(socket);
    if(ret != null)
    {
        for(var i = 0; i < ret.length; ++i)
        {
            io.to(ret[i].socket.id).emit('updateMessage', message);
        }
    }
}

server.listen(port, () => {
    console.log(`server is listening at localhost: ${port}`);
});