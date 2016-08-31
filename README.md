#SNAKE

A Classic snake game built using HTML Canvas and javascript. AI mode is implemented using greedy algorithm. 

#FUNCTIONS

##initSnake(updateInterval, currentScore, currentLevel, levelFoods, foodScore, auto) 

### Parameters

 - updateInteral : Refresh interval in ms. Determines the speed of the game
 - currentScore : Starting score.
 - currentLevel : Starting level.
 - levelFoods : No of foods for a level.
 - foodScore : Score obtained for eating a food item.
 - auto : Set to true for AI mode and false for Manual mode.

### Usage

- Set the parameters as required, if none specified default values will be taken
- Modify the initSnake() in updateLevel() to set how difficulty increases in each level.

### Default Values

These default values are used for testing the auto play.

 - updateInteral : 1
 - currentScore : 0
 - currentLevel : 1
 - levelFoods : 1000
 - foodScore : 10
 - auto : true




##initBoard(blockSize, updateRate)

### Parameters

 - blockSize: Size of a game cell in pixel.
 - updateRate: Rate at which the speed of the game increases.

### Usage

- Set the parameters as required, if none specified default values will be taken


### Default Values

 - blockSize: 20
 - updateRate: 2


#INSTRUCTIONS

 - Use W A S D for navigation in manual mode
 - Use Space bar for pause/resume


