var refreshInterval,refreshRate,score,highScore,level,levelUpdateScore,levelTargets,baseScore;
var canvas,ctx;

var cellSize,canvasWidth,canvasHeight,xMax,yMax,queueSize;

var xCords;
var yCords
var directions;
var front,rear;

var foodX,foodY,currentX,currentY;
var dir,prevDir;

var headl,headr,headu,headd,taill,tailr,tailu,taild,food,ld,lu,rd,ru,body;

var autoPlay;
var start;



$(document).ready(function(){

	canvas=document.getElementById("background");
	ctx=canvas.getContext("2d");
	canvasWidth=ctx.canvas.width;
	canvasHeight=ctx.canvas.height;
	var bgimg=document.getElementById("bgimage");
	ctx.drawImage(bgimg,0,0);
	initBoard();	 // BLOCK SIZE, REFRESH RATE
	initSnake();  // REFRESH INTERVAL, SCORE, LEVEL, LEVEL TARGETS, BASE SCORE
	initRes();
	updateSnake();
});

function initBoard(blockSize,updateRate)
{
	/*********DEFAULT VALUES***********/
	if(blockSize===undefined)
		blockSize=20;
	if(updateRate===undefined)
		updateRate=2;

	/**********INITIAL VALUES***********/
	cellSize=blockSize;
	refreshRate=updateRate;

	/***********************************/

	xMax=canvasWidth/cellSize;
	yMax=canvasHeight/cellSize;
	queueSize=xMax*yMax;
}




function initSnake(updateInterval,currentScore,currentLevel,levelFoods,foodScore,auto)
{
	/*********DEFAULT VALUES***********/

	if(updateInterval===undefined)
		updateInterval=10;
	if(currentScore===undefined)
		currentScore=0;
	if(currentLevel===undefined)
		currentLevel=1;
	if(levelFoods===undefined)
		levelFoods=1000;
	if(foodScore===undefined)
		foodScore=10;
	if(auto==undefined)
		auto=true;


	/**********INITIAL VALUES***********/
	refreshInterval=updateInterval;
	dir='R';
	prevDir=dir;
	score=currentScore;
	level=currentLevel;
	levelUpdateScore=currentScore+(levelFoods*foodScore*currentLevel);
	levelTargets=levelFoods;
	baseScore=foodScore;
	autoPlay=auto;

	$("#score").html(""+score);
	$("#level").html(""+level);

	setAutoSwitch();

	/**********************************/



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
	body=document.getElementById("body");
	food=document.getElementById("food");
	ld=document.getElementById("ld");
	lu=document.getElementById("lu");
	rd=document.getElementById("rd");
	ru=document.getElementById("ru");

	highScore=0;

}

function switchAuto()
{
	autoPlay=!autoPlay;
	setAutoSwitch();
}

function setAutoSwitch()
{
	if(autoPlay==true)
	{
		$("#switchAuto").removeClass("btn-success");
		$("#switchAuto").addClass("btn-warning");
		$("#switchAuto").html("MANUAL");	
	}
	else
	{
		$("#switchAuto").removeClass("btn-warning");
		$("#switchAuto").addClass("btn-success");
		$("#switchAuto").html("AUTOPLAY");	

	}
}

function updateSnake(timestamp)
{
	var progress;
	if(!start)
		start=timestamp;
	progress=timestamp-start;

	if(move())
		draw();
	//window.requestAnimationFrame(updateSnake);
	setTimeout(function() {
        window.requestAnimationFrame(updateSnake);
    }, refreshInterval);
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
	ctx.drawImage(body,xPos,yPos,cellSize,cellSize);
}

function drawBend(xPos,yPos,orgDir,newDir)
{
	switch(orgDir)
	{
		case 'L':switch(newDir)
				{
					case 'U':ctx.drawImage(lu,xPos,yPos,cellSize,cellSize);
							break;
					case 'D':ctx.drawImage(ld,xPos,yPos,cellSize,cellSize);
							break;
				}
				break;
		case 'R':switch(newDir)
				{
					case 'U':ctx.drawImage(ru,xPos,yPos,cellSize,cellSize);
							break;
					case 'D':ctx.drawImage(rd,xPos,yPos,cellSize,cellSize);
							break;
				}
				break;
		case 'U':switch(newDir)
				{
					case 'L':ctx.drawImage(rd,xPos,yPos,cellSize,cellSize);
							break;
					case 'R':ctx.drawImage(ld,xPos,yPos,cellSize,cellSize);
							break;
				}
				break;
		case 'D':switch(newDir)
				{
					case 'L':ctx.drawImage(ru,xPos,yPos,cellSize,cellSize);
							break;
					case 'R':ctx.drawImage(lu,xPos,yPos,cellSize,cellSize);
							break;
				}
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
	var i,next;
	var xPos,yPos,last;

	var debug=0;

	xPos=xCords[rear]*cellSize;
	yPos=yCords[rear]*cellSize;
	next=(rear+1)%queueSize;


	drawTail(xPos,yPos,directions[next]);

	last=front-1;
	if(last==-1)
		last=queueSize-1;
	for(i=next;i!=last;i=(i+1)%queueSize)
	{
		xPos=xCords[i]*cellSize;
		yPos=yCords[i]*cellSize;
		next=(i+1)%queueSize;
		if(directions[i]==directions[next])
			drawBody(xPos,yPos,directions[i]);
		else 
			drawBend(xPos,yPos,directions[i],directions[next]);		
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

function isValidPoint(xPos,yPos)
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
		success=isValidPoint(foodX,foodY);
	}
}

function isFood()
{
	if((foodX==currentX)&&(foodY==currentY))
		return true;
	return false;
}

function updateLevel()
{
	level++;
	$("#level").fadeOut();
	$("#level").fadeIn();
	setTimeout(function(){
		$("#level").html(""+level);
	},100);

	initSnake(refreshInterval/refreshRate,score,level,levelTargets,baseScore,autoPlay);

}

function updateHighScore()
{
	highScore=score;
	/*$("#high").fadeOut();
	$("#high").fadeIn();*/
	setTimeout(function(){
		$("#high").html(""+score);
	},refreshInterval);
}

function updateScore()
{
	score+=(baseScore*level);
	if(score>highScore)
		updateHighScore();
	if(score==levelUpdateScore)
		updateLevel();
	/*$("#score").fadeOut();
	$("#score").fadeIn();*/
	setTimeout(function(){
		$("#score").html(""+score);
	},refreshInterval);
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

function getNextMove(moveDir)
{
	var newPosX,newPosY;
	var nextPos;
	nextPos = {x:0,y:0};
	newPosX=currentX;
	newPosY=currentY;
	switch(moveDir)
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

	nextPos.x=parseInt(newPosX);
	nextPos.y=parseInt(newPosY);
	return nextPos;
}

function move()
{
	var newPos,newPosX,newPosY;
	if(autoPlay)
		getMove();

	newPos=getNextMove(dir);
	newPosX=newPos.x;
	newPosY=newPos.y;

	if(isValidPoint(newPosX,newPosY))
	{
		currentX=newPosX;
		currentY=newPosY;
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

$(document).keydown(function(event){

	event.preventDefault();
	if((event.which==119)||(event.which==87)||(event.which==38))
	{
		if(prevDir!='D')
		{
			dir='U';
		}
	}
    else if((event.which==97)||(event.which==65)||(event.which==37))
    {
    	if(prevDir!='R')
		{
			dir='L';
		}
	}
	else if((event.which==115)||(event.which==83)||(event.which==40))
	{
		if(prevDir!='U')
		{
			dir='D';
		}
	}
	else if((event.which==100)||(event.which==68)||(event.which==39))
	{
		if(prevDir!='L')
		{
			dir='R';
		}
	}

});

function isLeft()
{
	if(currentX>foodX)
		return true;
	return false;
}

function isRight()
{
	if(currentX<foodX)
		return true;
	return false;
}

function isUp()
{
	if(currentY>foodY)
		return true;
	return false;
}

function isDown()
{
	if(currentY<foodY)
		return true;
	return false;
}

function goLeft()
{
	if(dir!='R')
		dir='L';
	else
		dir='U';
}

function goRight()
{
	if(dir!='L')
		dir='R';
	else
		dir='D';
}

function goUp()
{
	if(dir!='D')
		dir='U';
	else
		dir='R';
}

function goDown()
{
	if(dir!='U')
		dir='D'
	else
		dir='L';
}

function isSafe(nextMoveDir)
{
	var newPos,newPosX,newPosY;

	newPos=getNextMove(nextMoveDir);

	newPosX=newPos.x;
	newPosY=newPos.y;

	if(!isValidPoint(newPosX,newPosY))
		return false;

	switch(dir)
	{
		case 'L':
		case 'R':if(isValidPoint(newPosX,newPosY-1)||isValidPoint(newPosX,newPosY+1))
					return true;
				break;
		case 'U':
		case 'D':if(isValidPoint(newPosX-1,newPosY)||isValidPoint(newPosX+1,newPosY))
					return true;

	}
	return false;
}

function findSafe()
{
	var i,dirs;
	dirs=['L','R','U','D'];
	
	for(i=0;i<4;i++)
		if(isSafe(dirs[i]))
			return dirs[i];
	return dir;
}

/*function isLoop(nextMoveDir)
{
	var newPos,newPosX,newPosY;

	newPos=getNextMove(nextMoveDir);

	newPosX=newPos.x;
	newPosY=newPos.y;

	if(!isValidPoint(newPosX,newPosY))
		return true;

	switch(dir)
	{
		case 'L':
		case 'R':if(isValidPoint(newPosX,newPosY-1)||isValidPoint(newPosX,newPosY+1))
					return false;
				break;
		case 'U':
		case 'D':if(isValidPoint(newPosX-1,newPosY)||isValidPoint(newPosX+1,newPosY))
					return false;

	}
	return true;
}*/


function getMove()
{
	if(isLeft())
		goLeft();
	else if(isRight())
		goRight();
	else if(isUp())
		goUp();
	else if(isDown())
		goDown();

	if(!isSafe(dir))
		dir=findSafe();
}


