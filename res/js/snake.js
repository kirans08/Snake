var updateInterval,score;
var canvas,ctx;

var xCords;
var yCords
var directions;
var front,rear;


var foodX,foodY,currentX,currentY;
var dir,prevDir;

var headl,headr,headu,headd,taill,tailr,tailu,taild,food;



$(document).ready(function(){

	canvas=document.getElementById("background");
	ctx=canvas.getContext("2d");
	var bgimg=document.getElementById("bgimage");
	ctx.drawImage(bgimg,0,0);
	initSnake();
	initRes();
	updateSnake();
});

function initSnake()
{
	currentX=1;
	currentY=12;
	updateInterval=250;
	dir='R';
	score=0;
	xCords=new Array();
	yCords=new Array();;
	directions=new Array();
	front=-1;
	rear=-1;
	addCurrent();
	currentX++;
	addCurrent();
	addFood();
	logData()


}

function logData()
{
	console.log("X : "+currentX+";Y : "+currentY+";Direction : "+dir+";Front : "+front+";Rear : "+rear);
}

function initRes()
{
	headl=document.getElementById("headl");
	headr=document.getElementById("headr");
	headu=document.getElementById("headu");
	headd=document.getElementById("headd");	
	taill=document.getElementById("taill");
	tailr=document.getElementById("tailr");
	tailu=document.getElementById("tailu");
	taild=document.getElementById("taild");
	food=document.getElementById("food");
}

function updateSnake()
{
	draw();
	move();

	setTimeout(updateSnake,updateInterval);
}

function drawBackground()
{

	var bgimg=document.getElementById("bgimage");
	ctx.drawImage(bgimg,0,0);
}

function drawHead(xPos,yPos,headDir)
{

	switch(headDir)
	{
		case 'L':ctx.drawImage(headl,xPos,yPos,20,20);
				 break;
		case 'R':ctx.drawImage(headr,xPos,yPos,20,20);
				 break;
		case 'U':ctx.drawImage(headu,xPos,yPos,20,20);
				 break;
		case 'D':ctx.drawImage(headd,xPos,yPos,20,20);
				 break;
	}

}

function drawTail(xPos,yPos,headDir)
{
	switch(headDir)
	{
		case 'L':ctx.drawImage(taill,xPos,yPos,20,20);
				 break;
		case 'R':ctx.drawImage(tailr,xPos,yPos,20,20);
				 break;
		case 'U':ctx.drawImage(tailu,xPos,yPos,20,20);
				 break;
		case 'D':ctx.drawImage(taild,xPos,yPos,20,20);
				 break;
	}

}

function drawSnake()
{
	var i;
	var xPos,yPos,last;

	xPos=xCords[rear]*20;
	yPos=yCords[rear]*20;

	drawTail(xPos,yPos,directions[rear]);

	last=(front-1)%800;
	if(last<0)
		last+=80;
	for(i=rear+1;i!=last;i=(i+1)%800)
	{

	}

	xPos=xCords[last]*20;
	yPos=yCords[last]*20;

	drawHead(xPos,yPos,directions[last]);

}

function drawFood()
{
	var xPos,yPos;
	xPos=foodX*20;
	yPos=foodY*20;
	ctx.drawImage(food,xPos,yPos,20,20);
}

function draw()
{
	drawBackground();
	drawSnake();
	drawFood();
}

function validPoint(xPos,yPos)
{
	var i;
	for(i=rear;i!=front;i=(i+1)%800)
	{
		if((xCords[i]==xPos)&&(yCords[i]==yPos))
			return false;
	}
	return true;
}

function addFood()
{
	var rand;
	rand=Math.random()*39;
	foodX=parseInt(rand+1);
	rand=Math.random()*24;
	foodY=parseInt(rand+1);
}

function isFood()
{
	if((foodX==currentX)&&(foodY==currentY))
		return true;
	return false;
}

function updateScore()
{
	score+=10;
	$("#score").fadeOut();
	$("#score").fadeIn();
	setTimeout(function(){
		$("#score").html("Score : "+score);
	},100);
}

function addCurrent()
{
	if(front==-1&&rear==-1) //Queue Empty
	{
		front=0;
		rear=0;
	}
	xCords[front]=currentX;
	yCords[front]=currentY;
	directions[front]=dir;
	front=(front+1)%800;
}

function removeLast()
{
	rear=(rear+1)%800;
}

function move()
{
	var newPosX,newPosY;
	newPosX=currentX;
	newPosY=currentY;
	switch(dir)
	{
		case 'L':newPosX--;
				if(newPosX<0)
					newPosX==39;
				break;
		case 'R':newPosX=(newPosX+1)%40;
				break;
		case 'U':newPosY--;
				if(newPosY<0)
					newPosY==24;
				break;
		case 'D':newPosY=(newPosY+1)%25;
				break;	
	}

	if(validPoint(newPosX,newPosY))
	{

		currentX=newPosX;
		currentY=newPosY;

		if(isFood())
		{
			addFood();
			updateScore();
		}
		addCurrent();
		removeLast();
	}
	else
	{
		initSnake();
	}

};








/*var dir="r";
var pdir="r";
var targx;
var targy;
var positionsx=new Array();
var positionsy=new Array();
var movno=0;
var rand=Math.random();
rand=parseInt((rand*100)%51)*20;
targx=rand;

rand=Math.random();
rand=parseInt((rand*100)%20)*20;
targy=rand;

var score=0;
var nob=1;
var positionx;
var positiony;
var c=document.getElementById("myCanvas");
var cxt=c.getContext("2d");
var img=document.getElementById("image");


function newtarg()
{

rand=Math.random();
rand=parseInt((rand*100)%51)*20;
targx=rand;

rand=Math.random();
rand=parseInt((rand*100)%20)*20;
targy=rand;
for(var i=-nob;i<0;i++)
{

if(targx==positionsx[i+movno]&&targy==positionsy[i+movno])
{
	rand=Math.random();
rand=parseInt((rand*100)%51)*20;
targx=rand;

rand=Math.random();
rand=parseInt((rand*100)%20)*20;
targy=rand;
i=-nob;

}



};





score+=10;
nob++;
$("#score").fadeOut();
$("#score").fadeIn();
setTimeout(function(){
$("#score").html("Score : "+score);
},100);
}



function move()
{
cxt.fillStyle="#000";
cxt.fillRect(0,0,1024,1000);

positionsx[movno]=positionx;
positionsy[movno]=positiony;
movno++;

cxt.fillStyle="#00F";
cxt.fillRect(targx,targy,20,20);

for(var i=-nob;i<0;i++)
{

if(positionx==positionsx[i+movno]&&positiony==positionsy[i+movno]&&i<-1)
{
	nob=1;
	score=0;
	$("#score").html("Score : 0").slideDown(100);
}

cxt.fillStyle="#FF0000";
cxt.fillRect(positionsx[i+movno],positionsy[i+movno],20,20);
pdir=dir;

};




if(positionx==targx&&positiony==targy)
{
	newtarg();
}

if(dir=='r')
	positionx+=20;
else if(dir=='l')
	positionx-=20;
else if(dir=='d')
	positiony+=20;
else if(dir=='u')
	positiony-=20;

if(positionx>1000)
{
	positionx=0;
}
else if(positiony>380)
{
	positiony=0;
}
else if(positionx<0)
{
	positionx=1000;
}
else if(positiony<0)
{
	positiony=380;
}

setTimeout(move, 100);
}

$(document).ready(function(){
cxt.fillStyle="#000";
cxt.fillRect(0,0,1024,1000);
$("canvas").slideDown(5000);
positionx=0;
positiony=0;




setTimeout(move, 1000);


$(document).keypress(function(event){
	event.preventDefault();
	if(event.which==119)
	{
		if(pdir!='d')
		dir='u';
	}
    else if(event.which==97)
    {
    	if(pdir!='r')
		dir='l';
	}
	else if(event.which==115)
	{
		if(pdir!='u')
		dir='d';
	}
	else if(event.which==100)
	{
		if(pdir!='l')
		dir='r';
	}




});



});*/

