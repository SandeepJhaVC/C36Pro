//Create variables here
var dogi, happyDog, database, foodS, foodStock;
var dog
var addFood, feedPet, fedTime, lastFed, foodObj;

function preload() {
  //load images here

  dogi = loadImage("images/dogImg.png");
  happyDog = loadImage("images/dogImg1.png");
}

async function setup() {
  createCanvas(1000, 500);


  database = firebase.database();
  foodStock = database.ref('food');
  foodStock.on("value", readStock);
  //foodStock.set(20);

  dog = createSprite(250, 350, 10, 60);
  dog.addImage(dogi);
  dog.scale = 0.2;

  foodObj = new Food();

  feed = createButton("Feed The Dog");
  feed.position(700, 95);
  feed.mousePressed(feedDog);

  addFood = createButton("Add Food");
  addFood.position(800, 95);
  addFood.mousePressed(addFoods);
}


function draw() {
  background(46, 139, 87);

  /*if (keyWentDown(UP_ARROW)) {
    dog.addImage(happyDog);
    writeStock(foodS);

  }
  if (keyWentUp(UP_ARROW)) {
    dog.addImage(dogi);
    //writeStock(foodS);

  }*/

  drawSprites();
  //add styles here
  

  foodObj.display();

  fedTime = database.ref('FeedTime');
  fedTime.on("value",function(data){
    lastFed = data.val();
  });

  fill(255,255,254);
  textSize(15);
  if(lastFed>=12){
    text("last feed: " + lastFed%12 + " pm", 350, 30);
  }else if(lastFed === 0){
    text("last feed: 12 am ",350,30);
  }else{
    text("last feed: " + lastFed + "am",350,30);
  }
}

function readStock(data) {
  foodObj.updateFoodStock(foodS);
  foodS = data.val();
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
  foodS -=1;
  foodObj.updateFoodStock(foodObj.getFoodStock() - 1);
  database.ref('/').update({
    food: foodObj.getFoodStock(),
    fedTime: hour()
  })
}

function addFoods() {
  foodS++;
  database.ref('/').update({
    food: foodS
  })
}