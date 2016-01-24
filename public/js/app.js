var Board=function(){
    return{
        width:$(window).width(),
        height:$(window).height()
    };
}();


var Circle=function(circle){    
    this.speed=10;
    if(circle=="yellow"){
        this.circle=this.createCircle("circle yellow");
    }
    else if(circle=="blue"){
        this.createCircle("circle blue");
    }
    this.circle.css({
        //"top":"200px",
        //"left":"200px"
    });             
    //initialize keyboard
    //Todo: Only do this if no gyro
    this.keyboard();
    
    //initialzie gyro
    //TODO: Only do this if no keyboard
    this.gyro();
    
}

Circle.prototype.createCircle=function(className){
    var circle=$("<div />", {class: className,css:{"top":"200px","left":"200px"}});
    $("body").append(circle);
    return circle;
}

Circle.prototype.keyboard=function(){
    console.log("Keyboard inited")
    var circle=this.circle;
    var speed=this.speed;
    $("body").on("keydown",function(e) {          
        switch(e.which) {
            case 37: // left                            
                if(circle.position().left>0){
                    circle.css("left",(circle.position().left-speed)+"px");
                }
            break;
            
            case 38: // up
                if(circle.position().top>0){
                    circle.css("top",(circle.position().top-speed)+"px");
                }
            break;

            case 39: // right
                if(circle.position().left<Board.width-200){ //width of the board - width of circle
                    circle.css("left",(circle.position().left+speed)+"px");
                }
            break;
            
            case 40: // down
                if(circle.position().top<Board.height-200){
                    circle.css("top",(circle.position().top+speed)+"px");
                }
            break;

            default: return; // exit this handler for other keys
        }
        e.preventDefault(); // prevent the default action (scroll / move caret)
    });
};

Circle.prototype.gyro=function(){
    
    var circle=this.circle;
    var speed=this.speed;
    
    window.ondevicemotion = function(event) {

        //phone movements
        var coords={};
        coords.x = event.accelerationIncludingGravity.x * 5;
        coords.y = event.accelerationIncludingGravity.y * 5;
        coords.z= (event.accelerationIncludingGravity.z * 5)+10;
        
        /*Socket stuff... */
        socket.emit('gyro', coords);                
        
        //reporting... not right now
        /*
        report.outputX(ax);
        report.outputY(ay);
        report.outputZ(az);
        */              
        
        //Move Left/Right
        if(circle.position().left<Board.width-200){
            if(circle.position().left>0){
                circle.css("left",circle.position().left+coords.x+"px");            
            }
            else{
                circle.css("left",1 + "px");
            }
        }
        else{
            circle.css("left",Board.width-201 + "px");
        }
        
        //Move Top/Bottom
        if(circle.position().top>0){
            if(circle.position().top<Board.height){
                circle.css("top",circle.position().top+coords.z+"px");
            }
            else{
                circle.css("top",Board.height-1+"px");
            }
        }
        else{
            circle.css("top",1+"px");
        }
        
        /*old way of doing it...
        //Status 0 is start, 1 is left, 2 is right, 3 is stay
        var status=0;
        var statusmsg="";
        if(status == 0){ //initial condition
          status = 3; //stay
          //socket.emit('spaceChange', {'ax': 3});
          statusmsg = 'Waiting for movement';
        }
        if(ax > 14 && status != 2){ //move right on device
          status = 2;
          //socket.emit('spaceChange', {'ax': 2});
          statusmsg = 'Moving  right';
          if(circle.position().left<Board.width-200){
                circle.css("left",(circle.position().left+speed)+"px")                
          }                   
        }
        if(ax < -14 && status !== 1){ //move left on device      status = 1;      socket.emit('spaceChange', {'ax': 1});                   statusmsg = 'Moving ship left';  }  if(ax > -14 && ax < 14 && status != 3){ //device held steady
          status = 1;
          //socket.emit('spaceChange', {'ax': 3});
          statusmsg = 'Moving left ';
          if(circle.position().left>0){
              circle.css("left",(circle.position().left-speed)+"px")
          }                    
        }
        
        if(ay > 14 && status!=4){
            status=4
            if(circle.position().)
            circle.css("top",(circle.position().top+speed)+"px")
        }
        if(ay < -14 && status!=5){
            status=5;
            circle.css("top",(circle.position().top-speed)+"px")
        }        
       
        */ 
    };
}

var Report=function(){
    return {
        outputX:function(x){
            $("#x-input").val(x);        
        },
        outputY:function(y){
            $("#y-input").val(y);
        },
        outputZ:function(z){
            $("#z-input").val(z);
        },
        outputMsg:function(msg){
            $("#status").val(msg);
        }
    }
}

var Countdown=function(container){
    this.init=function(){
        var d=$.Deferred();
        $.when(container.fadeOut()).then(function(){
                var countdown=3
                container.html(countdown).addClass("countdown");
                container.show();
                window.countdownInterval=setInterval(function(){
                    countdown--;
                    $.when(container.fadeOut()).then(function(){
                        if(countdown==0){    
                            container.html("Go!")
                            container.show();
                            setTimeout(function(){
                                    $.when(container.fadeOut()).then(function(){
                                        d.resolve();
                                        container.removeClass("countdown")                                        
                                    })
                            },1000);
                            clearInterval(window.countdownInterval);
                        }    
                        else{
                            container.html(countdown);
                            container.show();
                        }
                    });                                    
                },1000);

        });
        return d;
    }
}

$(function(){
    
    var blueCircle;
    var yellowCircle;
    $(".startYellow").click(function(e){        
        blueCircle={};        
        var countdown=new Countdown($(this));
        $.when(countdown.init()).then(function(){
            yellowCircle=new Circle("yellow");
        });        
    });
    
    $(".startBlue").click(function(e){
        yellowCircle={};
        var blueCircle=new Circle("blue");
    })
    
})

/*
$(function(){
    
    //var board=new Board();    
    //var yellowCircle=new YellowCircle();
    var report=new Report();    
    
    $(".startYellow").click(function(e){
        
    })
    
    
    
    //get from socket, transfer to circle
    var socket = io();
    socket.on('gyro', function(coords){
        //Move Left/Right
        if(yellowCircle.circle.position().left<board.width-200){
            if(yellowCircle.circle.position().left>0){
                yellowCircle.circle.css("left",yellowCircle.circle.position().left+coords.x+"px");            
            }
            else{
                yellowCircle.circle.css("left",1 + "px");
            }
        }
        else{
            yellowCircle.circle.css("left",board.width-201 + "px");
        }
        
        //Move Top/Bottom
        if(yellowCircle.circle.position().top>0){
            if(yellowCircle.circle.position().top<board.height){
                yellowCircle.circle.css("top",yellowCircle.circle.position().top+coords.z+"px");
            }
            else{
                yellowCircle.circle.css("top",board.height-1+"px");
            }
        }
        else{
            yellowCircle.circle.css("top",1+"px");
        }
    });
    
    
});


/*
//Detect if the browser supports DeviceMotionEvent
if (window.DeviceMotionEvent != undefined) {
	//ondevicemotion is fired when iOS device detects motion
	  window.ondevicemotion = function(e) {
		//ax is the movement on the x axis.
		//This motion is used to move the ship in the game
		  ax = event.accelerationIncludingGravity.x * 5;
		  ay = event.accelerationIncludingGravity.y * 5;
		 
		//Status 0 is start, 1 is left, 2 is right, 3 is stay
		if(status == 0){ //initial condition
		  status = 3; //stay
		  socket.emit('spaceChange', {'ax': 3});
		  statusmsg = 'Waiting for movement';
		}
		if(ax > 14 && status != 2){ //move right on device
		  status = 2;
		  socket.emit('spaceChange', {'ax': 2});
		  statusmsg = 'Moving ship right';
		}
		if(ax < -14 && status != 1){ //move left on device      status = 1;      socket.emit('spaceChange', {'ax': 1});                   statusmsg = 'Moving ship left';  }  if(ax > -14 && ax < 14 && status != 3){ //device held steady
		  status = 3;
		  socket.emit('spaceChange', {'ax': 3});
		  statusmsg = 'Ship held steady';
		}
	}
}
*/