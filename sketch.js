//Create variables here
var dogi, happyDog, database, foodS, foodStock;
var dog

function preload() {
  //load images here

  dogi = loadImage("images/dogImg.png");
  happyDog = loadImage("images/dogImg1.png");
}

function setup() {
  createCanvas(500, 500);
  

  database = firebase.database();
  foodStock = database.ref('food');
  foodStock.on("value", readStock);
  foodStock.set(20);
  
  dog = createSprite(250,350,10,60);
  dog.addImage(dogi);
  dog.scale = 0.2;
}


function draw() {
  background(46, 139, 87);

  if (keyWentDown(UP_ARROW)) {
    dog.addImage(happyDog);
    writeStock(foodS);
    
  }
  if (keyWentUp(UP_ARROW)) {
    dog.addImage(dogi);
    //writeStock(foodS);
    
  }

  drawSprites();
  //add styles here
  textSize(15);
  fill("blue");
  stroke("red");
  strokeWeight(5);
  text("food: " + foodS, 100, 200);
  textSize(29);
  text("Please press UP ARROW to feed dog", 0, 100);

}

function readStock(data) {
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