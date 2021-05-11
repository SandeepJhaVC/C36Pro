class Food {
    constructor() {
        var foodStock, lastFed;
        this.image = loadImage("images/Milk.png");
    }
    getFoodStock() {
        var foodStock = database.ref('foodStock');
        foodStock.on("value",function(data){
            gameState = data.val();
        })
    }
    updateFoodStock() {
        database.ref('/').update({
            foodStock: state
        })
    }
    deductFood() {
        var foodIndex = "food"+ foodStock;
        database.ref(playerIndex).set({
            food: lastFed
        })
    }
    display() {
        var x = 80,y = 100;

        imageMode(CENTER);
        image(this.image, 720, 220, 70, 70);

        if (this.foodStock != 0) {
            for (var i = 0; i < this.foodStock; i++) {
                if (i % 10 == 0) {
                    x = 80;
                    y = y + 50;
                }
                image(this.image, x, y, 50, 50);
                x = x + 30
            }
        }

    }
}