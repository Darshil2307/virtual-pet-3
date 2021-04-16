var dog; 
var happyDog,sadDog;
var database;
var foodS;
var foodStock;
var dognor;
var feed, addFood,garden,washroom,bedroom;
var fedTime, lastFed;
var foodObj; 
var gameState = "Hungry"
        
function preload()
{
  dognor = loadImage("dogImg.png");
  happyDog = loadImage("dogImg1.png");
  garden=loadImage("Garden.png");
  washroom=loadImage("WashRoom.png");
  bedroom=loadImage("BedRoom.png"); 
}

function setup() {
	createCanvas(500, 500);
  database = firebase.database();

  foodObj = new food(250,250,30,50);

  foodStock=database.ref('Food');
  foodStock.on("value",readStock);

  dog = createSprite(250,300,250,250);
  dog.addImage(dognor);
  dog.scale = 0.15;

  
  feed = createButton("Feed Maxi");
  feed.position(600,95);
  feed.mousePressed(feedDog);

  addFood=createButton("Add Food");
  addFood.position(500,95);
  addFood.mousePressed(addFoods);
}


function draw()
 {
   //background(46,139,87) ;
  
  fedTime=database.ref('FeedTime');
  fedTime.on("value",function(data){
    lastFed=data.val();
  });

  currentTime=hour();
  if(currentTime==(lastFed+1)){
      update("Playing");
      foodObj.garden();
   }else if(currentTime==(lastFed+2)){
    update("Sleeping");
      foodObj.bedroom();
   }else if(currentTime>(lastFed+2) && currentTime<=(lastFed+4)){
    update("Bathing");
      foodObj.washroom();
   }else{
    update("Hungry")
    foodObj.display();
   }

   if(gameState!="Hungry"){
     feed.hide();
     addFood.hide();
     dog.hide();
   }else{
    feed.show();
    addFood.show();

   }

   dog.display();
   drawSprites();
}

function readStock(data){
  foodS = data.val();
  foodObj.updateFoodStock(foodS);
  }

  function feedDog(){
    dog.addImage(happyDog);
  
    foodObj.updateFoodStock(foodObj.getFoodStock()-1);
    database.ref('/').update({
      Food:foodObj.getFoodStock(),
      FeedTime:hour()
    })
  }

  function addFoods(){
    foodS++;
    database.ref('/').update({
      Food:foodS
    })
  } 

  function update(state){
    database.ref('/').update({
      gameState:state
    })
  }
