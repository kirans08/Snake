var updateInterval,score;
var canvas,ctx;

var blockSize,canvasWidth,canvasHeight,xMax,yMax,queueSize;

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
	canvasWidth=ctx.canvas.width;
	canvasHeight=ctx.canvas.height;
	var bgimg=document.getElementById("bgimage");
	ctx.drawImage(bgimg,0,0);
	initSnake();
	initRes();
	updateSnake();
});

function initSnake()
{

	/**********INITIAL VALUES***********/
	updateInterval=100;
	blockSize=20;
	currentX=1;
	currentY=12;
	dir='R';
	/**********************************/
	
	prevDir='R';
	score=0;
	xMax=canvasWidth/blockSize;
	yMax=canvasHeight/blockSize;
	queueSize=xMax*yMax;

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
		case 'L':ctx.drawImage(headl,xPos,yPos,blockSize,blockSize);
				 break;
		case 'R':ctx.drawImage(headr,xPos,yPos,blockSize,blockSize);
				 break;
		case 'U':ctx.drawImage(headu,xPos,yPos,blockSize,blockSize);
				 break;
		case 'D':ctx.drawImage(headd,xPos,yPos,blockSize,blockSize);
				 break;
	}

}

function drawBody(xPos,yPos,bodyDir)
{

	switch(bodyDir)
	{
		case 'L':
		case 'R':ctx.drawImage(bodyh,xPos,yPos,blockSize,blockSize);
				 break;
		case 'U':
		case 'D':ctx.drawImage(bodyv,xPos,yPos,blockSize,blockSize);
				 break;
	}

}

function drawTail(xPos,yPos,tailDir)
{
	switch(tailDir)
	{
		case 'L':ctx.drawImage(taill,xPos,yPos,blockSize,blockSize);
				 break;
		case 'R':ctx.drawImage(tailr,xPos,yPos,blockSize,blockSize);
				 break;
		case 'U':ctx.drawImage(tailu,xPos,yPos,blockSize,blockSize);
				 break;
		case 'D':ctx.drawImage(taild,xPos,yPos,blockSize,blockSize);
				 break;
	}

}

function drawSnake()
{
	var i;
	var xPos,yPos,last;

	xPos=xCords[rear]*blockSize;
	yPos=yCords[rear]*blockSize;

	drawTail(xPos,yPos,directions[rear]);

	last=(front-1)%queueSize;
	if(last<0)
		last+=queueSize;
	for(i=rear+1;i!=last;i=(i+1)%queueSize)
	{
		xPos=xCords[i]*blockSize;
		yPos=yCords[i]*blockSize;
		drawBody(xPos,yPos,directions[i]);
	}

	xPos=xCords[last]*blockSize;
	yPos=yCords[last]*blockSize;

	drawHead(xPos,yPos,directions[last]);

}

function drawFood()
{
	var xPos,yPos;
	xPos=foodX*blockSize;
	yPos=foodY*blockSize;
	ctx.drawImage(food,xPos,yPos,blockSize,blockSize);
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
	for(i=rear;i!=front;i=(i+1)%queueSize)
	{
		if((xCords[i]==xPos)&&(yCords[i]==yPos))
			return false;
	}
	return true;
}

function addFood()
{
	var rand;
	rand=Math.random()*(xMax-1);
	foodX=parseInt(rand+1);
	rand=Math.random()*(yMax-1);
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
	front=(front+1)%queueSize;
}

function removeLast()
{
	rear=(rear+1)%queueSize;
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
					newPosX=xMax-1;
				break;
		case 'R':newPosX=(newPosX+1)%xMax;
				break;
		case 'U':newPosY--;
				if(newPosY<0)
					newPosY=yMax-1;
				break;
		case 'D':newPosY=(newPosY+1)%yMax;
				break;	
	}

	if(validPoint(newPosX,newPosY))
	{
		currentX=newPosX;
		currentY=newPosY;
		logData();
		prevDir=dir;
		addCurrent();
		if(isFood())
		{
			addFood();
			updateScore();
		}
		else
			removeLast();
	}
	else
	{
		initSnake();
	}

};

$(document).keypress(function(event){

	event.preventDefault();
	if((event.which==119)||(event.which==87))
	{
		if(prevDir!='D')
		{
			dir='U';
		}
	}
    else if((event.which==97)||(event.which==65))
    {
    	if(prevDir!='R')
		{
			dir='L';
		}
	}
	else if((event.which==115)||(event.which==83))
	{
		if(prevDir!='U')
		{
			dir='D';
		}
	}
	else if((event.which==100)||(event.which==68))
	{
		if(prevDir!='L')
		{
			dir='R';
		}
	}

});







