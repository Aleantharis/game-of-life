export class Board {
    width = -1;
    height = -1;
    board;
    #score;

    constructor(Width, Height) {
        this.width = Width;
        this.height = Height;
        this.board = new Array(Width);
        this.#score = [];

        for (let i = 0; i < this.width; i++) {
            this.board[i] = new Array(this.height);
            this.board[i].fill(0);
        }
    }

    static fromBoard(b) {
        let r = new this(b.width, b.height);

        b.#score.forEach((a,idx, arr) => {
            r.#score[idx] = a;
        });

        for (let i = 0; i < b.width; i++) {
            for (let j = 0; j < b.height; j++) {
                r.setSquare(i,j, b.getSquare(i,j));
            }
        }

        return r;
    }

    getSquare(x, y) {
        return this.board[x][y];
    }

    setSquare(x, y, value) {
        this.board[x][y] = value
    }

    neighbors(x, y) {
        let r = [];
        for (let i = -1; i < 2; i++) {
            for (let j = -1; j < 2; j++) {
                if (!(i === 0 && j === 0)) {
                    let ix = x + i;
                    let jy = y + j;

                    if (ix >= 0 && ix < this.width && jy >= 0 && jy < this.height && this.board[ix][jy] !== 0) {
                        r[this.board[ix][jy]] = r[this.board[ix][jy]] ? r[this.board[ix][jy]] + 1 : 1;
                    }
                }
            }
        }

        return r;
    }

    static randomMatch(filterFn, collection) {
        let r = [];
        collection.forEach((num,idx, arr) => {
            if(filterFn(num)) {
                r.push(idx);
            }
        });

        let ranIdx = Math.floor(Math.random() * r.length);
        return r[ranIdx];
    }

    static advance(b) {
        let nb = Board.fromBoard(b);

        
        for (let i = 0; i < b.width; i++) {
            for (let j = 0; j < b.height; j++) {
                let n = b.neighbors(i,j);
                let cVal = b.getSquare(i,j);

                if(cVal === 0) {
                    let x = Board.randomMatch((e)=>e===3,n);

                    if(x) {
                        nb.setSquare(i,j,x);
                    }
                    //set square to random neighbor color with exactly 3 neighbors to this square
                }
                else {

                    if((!n[cVal]) || n[cVal] < 2 || n[cVal] > 3) {
                        // Under or overpopulated -> deth
                        nb.setSquare(i,j,0);
                    }
                    else {
                        // Nothing, unless a neighbor eats you
                        let x = Board.randomMatch((e) => e !== cVal && e ===3,n );
                        if(x) {
                            nb.setSquare(i,j, x);
                        }
                        // get random neighbor that could repopulate to this square and set current square to neighbor value
                    }
                }
            }
        }

        nb.population().forEach((a, idx, arr) => {
            if(a >= 0) {
                if(!nb.#score[idx]) {
                    nb.#score[idx] = 0;
                }
                nb.#score[idx] += a;
            }
        });

        return nb;
    }

    population() {
        let r = [];
        
        for (let i = 0; i < this.width; i++) {
            for (let j = 0; j < this.height; j++) {
                let v = this.board[i][j]
                if(v !== 0) {
                    r[v] = r[v] ? r[v]+1 : 1;
                }
            }
        }

        return r;
    }

    score() {
        return this.#score;
    }
}

export class Player {
    id;
    color;
    spawn;
    score;
    population;

    constructor(id, color, spawn) {
        this.id = id;
        this.color = color;
        this.spawn = spawn;
        this.score = 0;
        this.population = 0;
    }
}

export class LifeGame {
    #board;
    #players;
    #deathScore = 100;
    #tickScore = 1;
    #scoreHandler;
    #boardHandler;

    constructor(width, height, players, scoreHandler, boardHandler) {
        this.#board = new Board(width,height);
        this.#players = players;
        this.#scoreHandler = scoreHandler;
        this.#boardHandler = boardHandler;
    }

    tick() {
        this.#board = Board.advance(this.#board);
        // Invoke boardHandler to update board in UI
        this.#boardHandler(this.#board, this.#players);

        var pop = this.#board.population();
        this.#players.forEach((a, idx, arr) => {
            if(a.population > 0) {
                var p = pop[a.id];
                if(p !== undefined) {
                    if(p === 0) {
                        this.#players.filter(e => e.id !== idx && e.population > 0).forEach((el, i, arr) => {el.score += this.#deathScore;});
                    }
                    else {
                        a.population = p;
                        a.score += this.#tickScore;
                    }
                }
            }
        });

        // Invoke score handler (to update score in GUI)
        this.#scoreHandler(this.#players);
    }
}