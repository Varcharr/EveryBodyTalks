$(function(){
  var socket        = io.connect(),
      $messageForm  = $("#messageForm"),
      $message      = $("#message"),
      $chat         = $("#chatWindow"),
      $usernameForm = $("#usernameForm"),
      $users        = $("#users"),
      $username     = $("#username"),
      $error        = $("#error"),
      $feedback     = $("#feedback");


  $usernameForm.submit(function(e){
    e.preventDefault();
    socket.emit("new user",$username.val(),function(data){
        if(data){
            $("#namesWrapper").hide();
            $("#mainWrapper").show();
          }
        else {
            $error.html("Username is taken");
            console.log("ERROR");
          }
    });
    $username.val("");
  });

  socket.on("userNames",function(data){
    var html="";
    for (var i = 0; i < data.length; i++) {
      html+=data[i]+"<br>";
    }
    $users.html(html);
  })

  $messageForm.submit(function(e){
    e.preventDefault();
    socket.emit("send message",$message.val());
    $message.val("");
  });

  socket.on("new message",function(data){
    $feedback.html("");
    $chat.append("<span id='user'>"+data.user+"</span>: "+data.msg+"<br><hr>");
    $chat.animate({
       scrollTop: $chat.get(0).scrollHeight
   },0);
  });

  $message.keypress(function(){
    socket.emit("typing");
  });

  socket.on("typing",function(data){
    $feedback.html("<p><em>"+data.user+" is typing...</em></p>");
  });
});
