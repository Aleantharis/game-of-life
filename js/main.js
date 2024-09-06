import { Constants as CONST } from "./const.js";
import { Assets } from "./const.js";
import { Board } from "./game.js";


var boardSizeIdx = 1;
const boardSizes = [
	{ X: 10, Y: 10 },
	{ X: 20, Y: 20 }
];
let b = new Board(boardSizes[boardSizeIdx].X, boardSizes[boardSizeIdx].Y);

var canvasMinSize = 0;
const BOARDSCALE = 0.9;
var boardScaleY = 1;


let canvas = document.getElementById("cvGame");
var ctx = canvas.getContext("2d");
let tileSize;

const tileColor = [
    "rgba(255,255,255,1)",
    "rgba(255,0,0,1)",
    "rgba(255,255,0,1)",
    "rgba(0,255,0,1)",
	"rgba(0,0,255,1)",
	"rgba(10,10,10,1)",
];

resizeCanvas();
// Attempt at auto-resize
function resizeCanvas() {
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight //- (document.getElementById("fMenu").offsetHeight + CONST.canvasHeightMargin);


	if (canvas.width < canvas.height) {
		canvasMinSize = canvas.width;
	}
	else {
		canvasMinSize = canvas.height;
	}

	tileSize = Math.min(canvas.width / boardSizes[boardSizeIdx].X, Math.min(canvas.height, canvas.width * boardScaleY) / boardSizes[boardSizeIdx].Y) * BOARDSCALE;
	ctx.translate((canvas.width - (tileSize * boardSizes[boardSizeIdx].X)) / 2, (canvas.height - (tileSize * boardSizes[boardSizeIdx].Y)) / 2);


    draw(b);
	// switch (gameState) {
	// 	case "Intro":
	// 		drawIntro();
	// 		break;
	// 	case "Success":
	// 		drawSuccess();
	// 		break;
	// 	case "Failure":
	// 		drawFailure();
	// 		break;
	// 	case "Generating":
	// 		drawGenerating();
	// 		break;
	// }
}
window.addEventListener("resize", resizeCanvas);
window.addEventListener("orientationchange", resizeCanvas);


function clearCanvas() {
	// https://stackoverflow.com/a/6722031
	ctx.save();
	ctx.setTransform(1, 0, 0, 1, 0, 0);
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	ctx.restore();
}

function drawBackground() {
	// draw test image
	ctx.save();
	ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.fillStyle = "rgba(0,0,0,0.5)"
	ctx.fillRect(0, 0, canvas.width, canvas.height);
	ctx.restore();
}

function draw(board) {
    clearCanvas();
    drawBackground();

    ctx.beginPath();
    ctx.save();
    
	for (let i = 0; i < boardSizes[boardSizeIdx].X; i++) {
		for (let j = 0; j < boardSizes[boardSizeIdx].Y; j++) {
            ctx.fillStyle = tileColor[board.getSquare(i,j)];
            ctx.fillRect(i*tileSize,j*tileSize,tileSize,tileSize);
        }
    }

    ctx.restore();
    ctx.closePath();
}

// b.setSquare(5,5,1);
// b.setSquare(6,5,1);
// b.setSquare(5,6,1);

// b.setSquare(8,7,1);
// b.setSquare(7,8,1);
// b.setSquare(8,8,1);

// for (let m = 0; m < 10; m++) {
//     b = Board.advance(b);
//     draw(b);
    
// }

function clickhandler() {
    b = Board.advance(b);
    draw(b);
}
window.addEventListener("click", clickhandler);

function run() {
    b = Board.advance(b);
	//console.log(b.score());
    draw(b);
}
let loop;
function keyhandler() {
    if(loop) {
        window.clearInterval(loop);
        loop = undefined;
    }
    else {
        loop = window.setInterval(run, 200);
    }
}
window.addEventListener("keypress", keyhandler);

// console.log(b.board);

// let nb = Board.advance(b);

// console.log(nb.board);

// //console.table(nb.board);

// let nb2 = Board.advance(nb);

// console.log(nb2);

// console.log(nb2.population());

b.setSquare(5, 5, 1)
b.setSquare(6, 5, 1)
b.setSquare(4, 5, 1)
b.setSquare(5, 4, 1)
b.setSquare(6, 6, 1)

b.setSquare(10, 10, 2)
b.setSquare(11, 10, 2)
b.setSquare(9, 10, 2)
b.setSquare(10, 9, 2)
b.setSquare(11, 11, 2)

b.setSquare(15, 5, 3)
b.setSquare(16, 5, 3)
b.setSquare(14, 5, 3)
b.setSquare(15, 4, 3)
b.setSquare(16, 6, 3)

b.setSquare(5, 15, 4)
b.setSquare(6, 15, 4)
b.setSquare(4, 15, 4)
b.setSquare(5, 14, 4)
b.setSquare(6, 16, 4)

b.setSquare(15, 15, 5)
b.setSquare(16, 15, 5)
b.setSquare(14, 15, 5)
b.setSquare(15, 14, 5)
b.setSquare(16, 16, 5)