var express   = require("express"),
    app       = express(),
    server    = require("http").createServer(app),
    io        = require("socket.io").listen(server),
    userNames = [];

server.listen(process.env.PORT || 3000,function(){
  console.log("========================");
  console.log("SERVER IS UP!!!");
  console.log("========================");
});
app.use(express.static('public'));


app.get("/",function(req,res){
  res.sendFile(__dirname+"/index.html");
});

io.sockets.on("connection",function(socket){
  socket.on("new user",function(data,callback){
    if(userNames.indexOf(data)!=-1){
      callback(false);
    }
    else {
      callback(true);
      socket.username=data;
      userNames.push(socket.username);
      updateUserNames();
      console.log("User connected!");
    }
    });
  //Update user names
  function updateUserNames(){
    io.sockets.emit("userNames",userNames);
  }
  //Typing
  socket.on("typing",function(data){
    socket.broadcast.emit("typing",{user:socket.username});
  });
  //Message sending
  socket.on("send message",function(data){
    io.sockets.emit("new message",{msg:data,user:socket.username});
  });
  //Disconnect
  socket.on("disconnect",function(data){
    if(!socket.username)return;
    userNames.splice(userNames.indexOf(socket.username),1);
    updateUserNames();
    console.log("User disconnected!");
  });

});
