document.addEventListener("DOMContentLoaded", function () {
    const canvas = document.getElementById("gameCanvas");
    const ctx = canvas.getContext("2d");
    const startScreen = document.getElementById("startScreen");
    const startButton = document.getElementById("startButton");
    
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const background = new Image();
    background.src = "assets/background.png";
    const hookImg = new Image();
    hookImg.src = "assets/hook.png";
    const fishImg = new Image();
    fishImg.src = "assets/fish.png";
    const shurikenImg = new Image();
    shurikenImg.src = "assets/shuriken.png";

    let hook = { x: canvas.width / 2, y: canvas.height - 100, speed: 2 };
    let fish = { x: -100, y: Math.random() * canvas.height, speed: 2 };
    let shurikens = [];

    function drawBackground() {
        ctx.drawImage(background, 0, 0, canvas.width, canvas.height);
    }

    function drawHook() {
        ctx.drawImage(hookImg, hook.x, hook.y, 50, 50);
    }

    function moveHook() {
        hook.y += hook.speed;
        if (hook.y > canvas.height - 50 || hook.y < 0) {
            hook.speed *= -1;
        }
    }

    function drawFish() {
        ctx.drawImage(fishImg, fish.x, fish.y, 60, 40);
    }

    function moveFish() {
        fish.x += fish.speed;
        if (fish.x > canvas.width) {
            fish.x = -100;
            fish.y = Math.random() * canvas.height;
        }
    }

    function drawShurikens() {
        shurikens.forEach(shuriken => {
            ctx.drawImage(shurikenImg, shuriken.x, shuriken.y, 30, 30);
        });
    }

    function moveShurikens() {
        shurikens.forEach((shuriken, index) => {
            shuriken.x += shuriken.speed;
            if (shuriken.x > canvas.width) {
                shurikens.splice(index, 1);
            }
        });
    }

    function throwShuriken() {
        shurikens.push({ x: hook.x + 20, y: hook.y + 10, speed: 5 });
    }

    document.addEventListener("keydown", function (event) {
        if (event.code === "Space") {
            throwShuriken();
        }
    });

    function gameLoop() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        drawBackground();
        moveHook();
        drawHook();
        moveFish();
        drawFish();
        moveShurikens();
        drawShurikens();
        requestAnimationFrame(gameLoop);
    }

    startButton.addEventListener("click", function () {
        startScreen.style.display = "none";
        canvas.style.display = "block";
        background.onload = function () {
            gameLoop();
        };
    });
});
