//Create variables here
var dogi, happyDog, database, foodS, foodStock;
var dog
var addFood, feedPet, fedTime, lastFed, foodObj;
var bedimg, washimg, gardimg;
var readState, changeState, gameState;
var currentTime = hour();

function preload() {
  //load images here

  dogi = loadImage("images/dogImg.png");
  happyDog = loadImage("images/dogImg1.png");
  bedimg = loadImage("images/Bed Room.png");
  washimg = loadImage("images/Wash Room.png");
  gardimg = loadImage("images/Garden.png");

}

async function setup() {
  createCanvas(1000, 500);


  database = firebase.database();
  foodStock = database.ref('food');
  foodStock.on("value", readStock);
  //foodStock.set(20);

  readState = database.ref('gameState');
  readState.on("value", function (data) {
    gameState = data.val();
  })

  dog = createSprite(500, 350, 10, 60);
  dog.addImage(dogi);
  dog.scale = 0.3;

  foodObj = new Food();

  feed = createButton("Feed The Dog");
  feed.position(700, 95);
  feed.mousePressed(feedDog);

  addFood = createButton("Add Food");
  addFood.position(800, 95);
  addFood.mousePressed(addFoods);

  fedTime = database.ref('FeedTime');
  fedTime.on("value", function (data) {
    lastFed = data.val();
  });

}


function draw() {
  background(46, 139, 87);


  drawSprites();
  //add styles here


  //foodObj.display();

  if(mousePressed(feed)){
    gameState = "hungry";
  }

  if (gameState !== "Hungry") {
    feed.hide();
    addFood.hide();
    dog.remove();
  } else {
    feed.show();
    addFood.show();
    dog.addImage(dogi);
  }

  
  if (currentTime === (lastFed + 1)) {
    update("Playing");
    foodObj.garden();
  } else if (currentTime === (lastFed + 2)) {
    update("sleeping");
    foodObj.bedroom();
  } else if (currentTime > (lastFed + 2) && currentTime <= (lastFed + 4)) {
    update("bathing");
    foodObj.washroom();
  } else {
    update("Hungry");
    foodObj.display();
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
}

function readStock(data) {

  foodS = data.val();
  foodObj.updateFoodStock(foodS);
}

function writeStock(x) {

  if (x <= 0) {
    x = 0;
  } else {
    x = x - 1;
  }

  database.ref('/').update({
    food: x
  })
}

function feedDog() {
  dog.addImage(happyDog);
  //foodS -= 1;
  foodObj.updateFoodStock(foodObj.getFoodStock() - 1);
  database.ref('/').update({
    food: foodObj.getFoodStock(),
    feedTime: hour()
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