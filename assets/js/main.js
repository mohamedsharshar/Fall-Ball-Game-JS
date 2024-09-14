const game = document.querySelector(".game-container");
const char = document.querySelector(".character");
let interval;
let keyDown = false;
const startbtn = document.getElementById('startbtn');
let passedHole = false; // Flag to ensure score only increases once per block

// Ball Movement
const moveLeft = () => {
    let leftPos = parseInt(window.getComputedStyle(char).getPropertyValue("left"));
    if (leftPos > 0)
        char.style.left = leftPos - 2 + "px";
};

const moveRight = () => {
    let leftPos = parseInt(window.getComputedStyle(char).getPropertyValue("left"));
    if (leftPos < 370)
        char.style.left = leftPos + 2 + "px";
};

document.addEventListener("keydown", (event) => {
    if (!keyDown) {
        if (event.key === "ArrowLeft") {
            interval = setInterval(moveLeft, 1);
        } else if (event.key === "ArrowRight") {
            interval = setInterval(moveRight, 1);
        }
    }
    keyDown = true;
});

document.addEventListener("keyup", () => {
    clearInterval(interval);
    keyDown = false;
});

// Generating Obstacles
const generateObstacle = () => {
    let block = document.createElement("div");
    let hole = document.createElement("div");
    block.setAttribute("class", "block");
    hole.setAttribute("class", "hole");
    let randHolePos = Math.floor(Math.random() * 320);
    hole.style.left = randHolePos + "px";

    game.appendChild(block);
    game.appendChild(hole);

    // Reset the flag when a new block is generated
    passedHole = false;

    // to remove these elements at the end of Animation
    $('.block').bind('animationend webkitAnimationEnd oAnimationEnd MSAnimationEnd', function (e) { $(this).remove(); });
    $('.hole').bind('animationend webkitAnimationEnd oAnimationEnd MSAnimationEnd', function (e) { $(this).remove(); });
};

// start button
startbtn.addEventListener('click', () => {
    setInterval(generateObstacle, 1500);
});

const checkCollisions = () => {
    const allBlocks = document.querySelectorAll(".block");
    const allHoles = document.querySelectorAll(".hole");

    allBlocks.forEach((b, i) => {
        let hitObstacle = false;
        let hole = allHoles[i];

        // Check for collision with block
        if (collision(b, char)) {
            hitObstacle = true;

            // If the character successfully passes through the hole
            if (holeCollision(hole, char) && !passedHole) {
                hitObstacle = false; // No hit if passed through hole
                updateHoleScore(); // Increase score once
                passedHole = true; // Set flag to true to avoid multiple increments
            }
        }

        if (hitObstacle && !holeCollision(hole, char)) {
            // Only end the game if the character hits the block and not the hole
            alert("Game Over !!!!!!!!!");
            location.reload();
        }
    });
};

// Run checkCollisions periodically
setInterval(checkCollisions, 10);

// Check Obstacle Collisions
function collision(a, b) {
    let a_top = parseInt(window.getComputedStyle(a).getPropertyValue("top"));
    let b_top = parseInt(window.getComputedStyle(b).getPropertyValue("top"));

    return (
        a_top + 20 > b_top && a_top < b_top + 20
    );
}

// Check Hole Collisions
function holeCollision(h, b) {
    let h_left = parseInt(window.getComputedStyle(h).getPropertyValue("left"));
    let h_top = parseInt(window.getComputedStyle(h).getPropertyValue("top"));

    let b_left = parseInt(window.getComputedStyle(b).getPropertyValue("left"));
    let b_top = parseInt(window.getComputedStyle(b).getPropertyValue("top"));

    return (
        b_left > h_left && b_left < h_left + 50 &&
        h_top + 20 > b_top && h_top < b_top + 20
    );
}

// counter
let holeScore = 0; // Initialize hole score
const holeScoreDisplay = document.getElementById('score'); // Correct reference to score display

// Update hole score function
const updateHoleScore = () => {
    holeScore += 1;
    holeScoreDisplay.textContent = holeScore; // Update the displayed hole score
};
