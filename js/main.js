import { Constants as CONST } from "./const.js";
import { Assets } from "./const.js";
import { LifeGame, Player } from "./game.js";


var boardSizeIdx = 1;
const boardSizes = [
	{ X: 10, Y: 10 },
	{ X: 20, Y: 20 }
];
let game;

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

    if(game) {
        drawGame(game);
    }
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

function drawGame(g) {
    drawBoard(g.getBoard(), g.getPlayers());
    drawPlayers(g.getPlayers());
}

function drawBoard(board, pl) {
	clearCanvas();
    drawBackground();

    ctx.beginPath();
    ctx.save();
    
	for (let i = 0; i < board.width; i++) {
		for (let j = 0; j < board.height; j++) {
			var p = game.getPlayerAt(i,j);
			ctx.fillStyle = p !== undefined ? p.color : "rgba(255,255,255,1)";
			ctx.fillRect(i*tileSize,j*tileSize,tileSize,tileSize);
        }
    }

    ctx.restore();
    ctx.closePath();
}   

function drawPlayers(pl) {
    // Clear players area, then print player scores
	pl.forEach((a, idx, arr) => {
		console.log(a.id + ": "+ a.population + ", " + a.score);
	});
}


function gameOver(reason){
	console.log("GAMEEND: " + reason);
	if(loop) {
        window.clearInterval(loop);
        loop = undefined;
	}
}

function run() {
	if(!game) {
		game = new LifeGame(boardSizes[boardSizeIdx].X, boardSizes[boardSizeIdx].Y, players, drawPlayers, drawBoard, gameOver);
	}
	game.tick();
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
window.addEventListener("click", run);

let players = new Array(5);

players[0] = new Player(1, tileColor[1], ["5,5", "6,5", "4,5", "5,4", "6,6"]);

players[1] = new Player(2, tileColor[2], ["10,10", "11,10", "9,10", "10,9", "11,11"]);

players[2] = new Player(3, tileColor[3], ["15,5", "16,5", "14,5", "15,4", "16,6"]);

players[3] = new Player(4, tileColor[4], ["5,15", "6,15", "4,15", "5,14", "6,16"]);

players[4] = new Player(5, tileColor[5], ["15,15", "16,15", "14,15", "15,14", "16,16"]);