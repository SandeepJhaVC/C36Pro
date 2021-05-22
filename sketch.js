//Create variables here
var dog, sadDog, happyDog, garden, washroom, database;
var foodS, foodStock;
var fedTime, lastFed, currentTime;
var feed, addFood;
var foodObj;
var gameState, readState;

function preload() {
  //load images here

  sadDog = loadImage("images/dogImg.png");
  happyDog = loadImage("images/dogImg1.png");
  garden = loadImage("images/Bed Room.png");
  washroom = loadImage("images/Wash Room.png");
  bedroom = loadImage("images/Garden.png");

}

async function setup() {
  createCanvas(1000, 500);

  database = firebase.database();

  foodObj = new Food();
  foodStock = database.ref('food');
  foodStock.on("value", readStock);

  fedTime = database.ref('FeedTime');
  fedTime.on("value", function (data) {
    lastFed = data.val();
  });

  readState = database.ref('gameState');
  readState.on("value", function (data) {
    gameState = data.val();
  })

  dog = createSprite(500, 350, 10, 60);
  dog.addImage(sadDog);
  dog.scale = 0.3;



  feed = createButton("Feed The Dog");
  feed.position(700, 95);
  feed.mousePressed(feedDog);

  addFood = createButton("Add Food");
  addFood.position(800, 95);
  addFood.mousePressed(addFoods);

}


function draw() {
  //background(46, 139, 87);
  currentTime = hour();

  if (currentTime === (lastFed + 1)) {
    update("playing");
    foodObj.garden();
  } else if (currentTime === (lastFed + 2)) {
    update("sleeping");
    foodObj.bedroom();
  } else if (currentTime > (lastFed + 2) && currentTime <= (lastFed + 4)) {
    update("bathing");
    foodObj.washroom();
  } else {
    update("hungry");
    foodObj.display();
  }

  if (gameState != "hungry") {
    feed.hide();
    addFood.hide();
    dog.remove();
  } else {
    feed.show();
    addFood.show();
    //dog = createSprite(500, 350, 10, 60);
    dog.addImage(sadDog);
    //dog.scale = 0.3;
  }

  fill(255, 255, 254);
  textSize(15);
  if (lastFed >= 12) {
    text("last feed: " + lastFed % 12 + " pm", 350, 30);
  } else if (lastFed === 0) {
    text("last feed: 12 am ", 350, 30);
  } else {
    text("last feed: " + lastFed + "am", 350, 30);
  }

  drawSprites();
}

function readStock(data) {

  foodS = data.val();
  foodObj.updateFoodStock(foodS);

}

/*function writeStock(x) {

  if (x <= 0) {
    x = 0;
  } else {
    x = x - 1;
  }

  database.ref('/').update({
    food: x
  })
}*/

function feedDog() {
  dog.addImage(happyDog);

  foodObj.updateFoodStock(foodObj.getFoodStock() - 1);
  database.ref('/').update({
    food: foodObj.getFoodStock(),
    FeedTime: hour(),
    gameState: "hungry"
  })
}

function addFoods() {
  foodS++;
  database.ref('/').update({
    food: foodS
  })
}

function update(state) {
  database.ref('/').update({
    gameState: state
  })
}