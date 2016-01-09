var refreshInterval,score;
var canvas,ctx;

var cellSize,canvasWidth,canvasHeight,xMax,yMax,queueSize;

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
	initSnake();  // REFRESH INTERVAL, CELL SIZE, INITIAL DIRECTION, INITIAL SCORE
	initRes();
	updateSnake();
});

function initSnake(updateInterval,blockSize,initialDirection,initialScore)
{
	/*********DEFAULT VALUES***********/

	if(updateInterval===undefined)
		updateInterval=100;
	if(blockSize===undefined)
		blockSize=20;
	if(initialDirection===undefined)
		initialDirection='R';
	if(initialScore===undefined)
		initialScore=0;

	/**********INITIAL VALUES***********/
	refreshInterval=updateInterval;
	cellSize=blockSize;
	dir=initialDirection;
	score=initialScore;
	/**********************************/
	
	prevDir=dir;
	xMax=canvasWidth/cellSize;
	yMax=canvasHeight/cellSize;
	queueSize=xMax*yMax;
	currentX=1;
	currentY=parseInt(yMax/2);

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
	console.log("X : "+currentX+";Y : "+currentY+";Direction : "+dir+";Front : "+front+";Rear : "+rear+";FoodX : "+foodX+";FoodY : "+foodY);
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

	if(move())
		draw();

	setTimeout(updateSnake,refreshInterval);
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
		case 'L':ctx.drawImage(headl,xPos,yPos,cellSize,cellSize);
				 break;
		case 'R':ctx.drawImage(headr,xPos,yPos,cellSize,cellSize);
				 break;
		case 'U':ctx.drawImage(headu,xPos,yPos,cellSize,cellSize);
				 break;
		case 'D':ctx.drawImage(headd,xPos,yPos,cellSize,cellSize);
				 break;
	}

}

function drawBody(xPos,yPos,bodyDir)
{

	switch(bodyDir)
	{
		case 'L':
		case 'R':ctx.drawImage(bodyh,xPos,yPos,cellSize,cellSize);
				 break;
		case 'U':
		case 'D':ctx.drawImage(bodyv,xPos,yPos,cellSize,cellSize);
				 break;
	}

}

function drawTail(xPos,yPos,tailDir)
{
	switch(tailDir)
	{
		case 'L':ctx.drawImage(taill,xPos,yPos,cellSize,cellSize);
				 break;
		case 'R':ctx.drawImage(tailr,xPos,yPos,cellSize,cellSize);
				 break;
		case 'U':ctx.drawImage(tailu,xPos,yPos,cellSize,cellSize);
				 break;
		case 'D':ctx.drawImage(taild,xPos,yPos,cellSize,cellSize);
				 break;
	}

}

function drawSnake()
{
	var i;
	var xPos,yPos,last;

	xPos=xCords[rear]*cellSize;
	yPos=yCords[rear]*cellSize;

	drawTail(xPos,yPos,directions[rear]);

	last=(front-1)%queueSize;
	if(last<0)
		last+=queueSize;
	for(i=rear+1;i!=last;i=(i+1)%queueSize)
	{
		xPos=xCords[i]*cellSize;
		yPos=yCords[i]*cellSize;
		drawBody(xPos,yPos,directions[i]);
	}

	xPos=xCords[last]*cellSize;
	yPos=yCords[last]*cellSize;

	drawHead(xPos,yPos,directions[last]);

}

function drawFood()
{
	var xPos,yPos;
	xPos=foodX*cellSize;
	yPos=foodY*cellSize;
	ctx.drawImage(food,xPos,yPos,cellSize,cellSize);
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
	var rand,success;
	success=false;
	while(!success)
	{
		rand=Math.random()*(xMax-1);
		foodX=parseInt(rand+1);
		rand=Math.random()*(yMax-1);
		foodY=parseInt(rand+1);
		success=validPoint(foodX,foodY);
	}
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
		$("#score").html(""+score);
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

	newPosX=parseInt(newPosX);
	newPosY=parseInt(newPosY);

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
	return true;

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
