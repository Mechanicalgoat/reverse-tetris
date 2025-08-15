// メインゲームロジック

const TETROMINOS = {
    I: { shape: [[1,1,1,1]], color: '#60a5fa' },
    O: { shape: [[1,1],[1,1]], color: '#fbbf24' },
    T: { shape: [[0,1,0],[1,1,1]], color: '#c084fc' },
    S: { shape: [[0,1,1],[1,1,0]], color: '#34d399' },
    Z: { shape: [[1,1,0],[0,1,1]], color: '#f87171' },
    J: { shape: [[1,0,0],[1,1,1]], color: '#38bdf8' },
    L: { shape: [[0,0,1],[1,1,1]], color: '#fb923c' }
};

class ReverseTetris {
    constructor() {
        this.canvas = document.getElementById('game-board');
        this.ctx = this.canvas.getContext('2d');
        this.nextCanvas = document.getElementById('next-piece');
        this.nextCtx = this.nextCanvas.getContext('2d');
        
        this.gridWidth = 10;
        this.gridHeight = 20;
        this.cellSize = 30;
        
        this.board = {
            width: this.gridWidth,
            height: this.gridHeight,
            grid: Array(this.gridHeight).fill().map(() => Array(this.gridWidth).fill(0))
        };
        
        this.ai = new TetrisAI('normal');
        this.selectedPiece = null;
        this.isPlaying = false;
        this.isPaused = false;
        this.score = 0;
        this.piecesSent = 0;
        this.linesCleared = 0;
        
        this.animationFrame = null;
        this.dropSpeed = 1000; // ミリ秒
        this.lastDropTime = 0;
        this.currentPiece = null;
        this.currentPosition = null;
        
        this.init();
    }
    
    init() {
        this.setupPieceSelector();
        this.setupControls();
        this.updateDisplay();
    }
    
    setupPieceSelector() {
        const selector = document.getElementById('piece-selector');
        selector.innerHTML = '';
        
        Object.entries(TETROMINOS).forEach(([type, tetromino]) => {
            const btn = document.createElement('button');
            btn.className = 'piece-btn';
            btn.dataset.type = type;
            
            const canvas = document.createElement('canvas');
            canvas.width = 60;
            canvas.height = 60;
            const ctx = canvas.getContext('2d');
            
            // ミノを描画
            this.drawMiniPiece(ctx, tetromino.shape, tetromino.color, 60, 60);
            
            btn.appendChild(canvas);
            btn.addEventListener('click', () => this.selectPiece(type));
            selector.appendChild(btn);
        });
    }
    
    drawMiniPiece(ctx, shape, color, width, height) {
        ctx.clearRect(0, 0, width, height);
        const pieceWidth = shape[0].length;
        const pieceHeight = shape.length;
        const cellSize = Math.min(width / (pieceWidth + 1), height / (pieceHeight + 1));
        const offsetX = (width - pieceWidth * cellSize) / 2;
        const offsetY = (height - pieceHeight * cellSize) / 2;
        
        ctx.fillStyle = color;
        ctx.strokeStyle = '#333';
        ctx.lineWidth = 1;
        
        for (let y = 0; y < shape.length; y++) {
            for (let x = 0; x < shape[y].length; x++) {
                if (shape[y][x]) {
                    ctx.fillRect(
                        offsetX + x * cellSize,
                        offsetY + y * cellSize,
                        cellSize - 1,
                        cellSize - 1
                    );
                    ctx.strokeRect(
                        offsetX + x * cellSize,
                        offsetY + y * cellSize,
                        cellSize - 1,
                        cellSize - 1
                    );
                }
            }
        }
    }
    
    selectPiece(type) {
        if (!this.isPlaying || this.currentPiece) return;
        
        // 前の選択をクリア
        document.querySelectorAll('.piece-btn').forEach(btn => {
            btn.classList.remove('selected');
        });
        
        // 新しい選択
        const btn = document.querySelector(`[data-type="${type}"]`);
        btn.classList.add('selected');
        
        this.selectedPiece = type;
        
        // 次のピースを表示
        const tetromino = TETROMINOS[type];
        this.drawMiniPiece(this.nextCtx, tetromino.shape, tetromino.color, 120, 80);
        
        // 自動的にピースを送る（高速化）
        setTimeout(() => this.sendPiece(), 200);
    }
    
    sendPiece() {
        if (!this.selectedPiece || !this.isPlaying || this.currentPiece) return;
        
        const tetromino = TETROMINOS[this.selectedPiece];
        const piece = tetromino.shape.map(row => row.map(cell => cell ? this.selectedPiece : 0));
        
        // AIに最適な配置を計算させる
        const bestMove = this.ai.findBestMove(this.board, piece);
        
        if (bestMove) {
            this.currentPiece = {
                type: this.selectedPiece,
                shape: piece,
                color: tetromino.color,
                targetX: bestMove.x,
                targetRotation: bestMove.rotation,
                targetY: bestMove.y,
                currentX: bestMove.x,
                currentY: 0,
                rotation: 0
            };
            
            this.piecesSent++;
            this.score += 10;
            
            // アニメーション開始
            this.animatePieceDrop();
        }
        
        // 選択をクリア
        this.selectedPiece = null;
        document.querySelectorAll('.piece-btn').forEach(btn => {
            btn.classList.remove('selected');
        });
        this.nextCtx.clearRect(0, 0, 120, 80);
    }
    
    animatePieceDrop() {
        if (!this.currentPiece) return;
        
        const piece = this.currentPiece;
        
        // 回転アニメーション
        if (piece.rotation < piece.targetRotation) {
            piece.shape = this.ai.rotatePiece(TETROMINOS[piece.type].shape.map(row => 
                row.map(cell => cell ? piece.type : 0)), piece.rotation + 1);
            piece.rotation++;
        }
        
        // 落下アニメーション（高速化）
        if (piece.currentY < piece.targetY) {
            // より高速な落下のため、複数ステップ進む
            const remainingSteps = piece.targetY - piece.currentY;
            const dropSpeed = Math.min(remainingSteps, 2); // 最大2ステップずつ
            piece.currentY += dropSpeed;
        } else {
            // 配置完了
            this.placePieceOnBoard();
            return;
        }
        
        // 描画更新
        this.draw();
        
        // 次のフレーム（高速化）
        setTimeout(() => this.animatePieceDrop(), 15);
    }
    
    placePieceOnBoard() {
        if (!this.currentPiece) return;
        
        const piece = this.currentPiece;
        
        // ボードに配置
        for (let y = 0; y < piece.shape.length; y++) {
            for (let x = 0; x < piece.shape[y].length; x++) {
                if (piece.shape[y][x]) {
                    const boardY = piece.targetY + y;
                    const boardX = piece.targetX + x;
                    if (boardY >= 0 && boardY < this.gridHeight && 
                        boardX >= 0 && boardX < this.gridWidth) {
                        this.board.grid[boardY][boardX] = piece.type;
                    }
                }
            }
        }
        
        this.currentPiece = null;
        
        // ライン消去チェック
        this.clearLines();
        
        // ゲームオーバーチェック
        if (this.checkGameOver()) {
            this.gameOver();
        }
        
        this.updateDisplay();
        this.draw();
    }
    
    clearLines() {
        let linesCleared = 0;
        
        for (let y = this.gridHeight - 1; y >= 0; y--) {
            if (this.board.grid[y].every(cell => cell !== 0)) {
                // ライン消去
                this.board.grid.splice(y, 1);
                this.board.grid.unshift(Array(this.gridWidth).fill(0));
                linesCleared++;
                y++; // 同じ行を再チェック
            }
        }
        
        if (linesCleared > 0) {
            this.linesCleared += linesCleared;
            this.score += linesCleared * 100;
            
            // AIを助けてしまったのでスコア減少
            this.score -= linesCleared * 20;
        }
    }
    
    checkGameOver() {
        // 一番上の行にブロックがあるかチェック
        return this.board.grid[0].some(cell => cell !== 0);
    }
    
    gameOver() {
        this.isPlaying = false;
        const status = document.getElementById('game-status');
        const t = window.currentTranslations || translations.en;
        status.innerHTML = `
            <h2>${t.gameOver}</h2>
            <p>${t.gameOverMessage}</p>
            <p>${t.finalScore} ${this.score}</p>
            <p>${t.finalPieces} ${this.piecesSent}</p>
        `;
        status.classList.add('show');
    }
    
    draw() {
        // キャンバスクリア
        this.ctx.fillStyle = '#111';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // グリッド線
        this.ctx.strokeStyle = '#333';
        this.ctx.lineWidth = 0.5;
        for (let x = 0; x <= this.gridWidth; x++) {
            this.ctx.beginPath();
            this.ctx.moveTo(x * this.cellSize, 0);
            this.ctx.lineTo(x * this.cellSize, this.canvas.height);
            this.ctx.stroke();
        }
        for (let y = 0; y <= this.gridHeight; y++) {
            this.ctx.beginPath();
            this.ctx.moveTo(0, y * this.cellSize);
            this.ctx.lineTo(this.canvas.width, y * this.cellSize);
            this.ctx.stroke();
        }
        
        // ボードのブロック（改良されたビジュアル）
        for (let y = 0; y < this.gridHeight; y++) {
            for (let x = 0; x < this.gridWidth; x++) {
                const cell = this.board.grid[y][x];
                if (cell) {
                    const color = TETROMINOS[cell].color;
                    
                    // グラデーション効果
                    const gradient = this.ctx.createLinearGradient(
                        x * this.cellSize,
                        y * this.cellSize,
                        (x + 1) * this.cellSize,
                        (y + 1) * this.cellSize
                    );
                    gradient.addColorStop(0, color);
                    gradient.addColorStop(1, this.adjustColor(color, -30));
                    
                    this.ctx.fillStyle = gradient;
                    this.ctx.fillRect(
                        x * this.cellSize + 1,
                        y * this.cellSize + 1,
                        this.cellSize - 2,
                        this.cellSize - 2
                    );
                    
                    // ハイライト効果
                    this.ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
                    this.ctx.fillRect(
                        x * this.cellSize + 2,
                        y * this.cellSize + 2,
                        this.cellSize - 4,
                        3
                    );
                    
                    // 境界線
                    this.ctx.strokeStyle = this.adjustColor(color, -40);
                    this.ctx.lineWidth = 1;
                    this.ctx.strokeRect(
                        x * this.cellSize + 1,
                        y * this.cellSize + 1,
                        this.cellSize - 2,
                        this.cellSize - 2
                    );
                }
            }
        }
        
        // 落下中のピース（改良されたビジュアル）
        if (this.currentPiece) {
            const piece = this.currentPiece;
            this.ctx.globalAlpha = 0.9;
            
            for (let y = 0; y < piece.shape.length; y++) {
                for (let x = 0; x < piece.shape[y].length; x++) {
                    if (piece.shape[y][x]) {
                        // グラデーション効果を追加
                        const gradient = this.ctx.createLinearGradient(
                            (piece.currentX + x) * this.cellSize,
                            (piece.currentY + y) * this.cellSize,
                            (piece.currentX + x + 1) * this.cellSize,
                            (piece.currentY + y + 1) * this.cellSize
                        );
                        gradient.addColorStop(0, piece.color);
                        gradient.addColorStop(1, this.adjustColor(piece.color, -20));
                        
                        this.ctx.fillStyle = gradient;
                        this.ctx.fillRect(
                            (piece.currentX + x) * this.cellSize + 1,
                            (piece.currentY + y) * this.cellSize + 1,
                            this.cellSize - 2,
                            this.cellSize - 2
                        );
                        
                        // ハイライト効果
                        this.ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
                        this.ctx.fillRect(
                            (piece.currentX + x) * this.cellSize + 2,
                            (piece.currentY + y) * this.cellSize + 2,
                            this.cellSize - 4,
                            4
                        );
                        
                        // 境界線
                        this.ctx.strokeStyle = this.adjustColor(piece.color, -30);
                        this.ctx.lineWidth = 1;
                        this.ctx.strokeRect(
                            (piece.currentX + x) * this.cellSize + 1,
                            (piece.currentY + y) * this.cellSize + 1,
                            this.cellSize - 2,
                            this.cellSize - 2
                        );
                    }
                }
            }
            
            this.ctx.globalAlpha = 1;
        }
    }
    
    updateDisplay() {
        document.getElementById('score').textContent = this.score;
        document.getElementById('pieces-sent').textContent = this.piecesSent;
        document.getElementById('lines-cleared').textContent = this.linesCleared;
        
        // 最大高さを計算
        let maxHeight = 0;
        for (let y = 0; y < this.gridHeight; y++) {
            if (this.board.grid[y].some(cell => cell !== 0)) {
                maxHeight = this.gridHeight - y;
                break;
            }
        }
        document.getElementById('max-height').textContent = maxHeight;
    }
    
    // 色を明度調整するユーティリティ関数
    adjustColor(color, percent) {
        const num = parseInt(color.replace("#",""), 16);
        const amt = Math.round(2.55 * percent);
        const R = (num >> 16) + amt;
        const G = (num >> 8 & 0x00FF) + amt;
        const B = (num & 0x0000FF) + amt;
        return "#" + (0x1000000 + (R < 255 ? R < 1 ? 0 : R : 255) * 0x10000 +
            (G < 255 ? G < 1 ? 0 : G : 255) * 0x100 +
            (B < 255 ? B < 1 ? 0 : B : 255))
            .toString(16).slice(1);
    }
    
    setupControls() {
        const startBtn = document.getElementById('start-btn');
        const pauseBtn = document.getElementById('pause-btn');
        const resetBtn = document.getElementById('reset-btn');
        const difficultySelect = document.getElementById('difficulty');
        
        startBtn.addEventListener('click', () => this.start());
        pauseBtn.addEventListener('click', () => this.togglePause());
        resetBtn.addEventListener('click', () => this.reset());
        
        difficultySelect.addEventListener('change', (e) => {
            this.ai = new TetrisAI(e.target.value);
        });
    }
    
    start() {
        if (this.isPlaying) return;
        
        this.isPlaying = true;
        this.isPaused = false;
        
        document.getElementById('start-btn').disabled = true;
        document.getElementById('pause-btn').disabled = false;
        document.getElementById('game-status').classList.remove('show');
        
        this.draw();
    }
    
    togglePause() {
        if (!this.isPlaying) return;
        
        this.isPaused = !this.isPaused;
        const t = window.currentTranslations || translations.en;
        document.getElementById('pause-btn').textContent = this.isPaused ? t.resumeGame : t.pauseGame;
    }
    
    reset() {
        this.isPlaying = false;
        this.isPaused = false;
        this.score = 0;
        this.piecesSent = 0;
        this.linesCleared = 0;
        this.currentPiece = null;
        this.selectedPiece = null;
        
        this.board.grid = Array(this.gridHeight).fill().map(() => Array(this.gridWidth).fill(0));
        
        document.getElementById('start-btn').disabled = false;
        document.getElementById('pause-btn').disabled = true;
        const t = window.currentTranslations || translations.en;
        document.getElementById('pause-btn').textContent = t.pauseGame;
        document.getElementById('game-status').classList.remove('show');
        
        document.querySelectorAll('.piece-btn').forEach(btn => {
            btn.classList.remove('selected');
        });
        
        this.nextCtx.clearRect(0, 0, 120, 80);
        
        this.updateDisplay();
        this.draw();
    }
}

// ゲーム開始
document.addEventListener('DOMContentLoaded', () => {
    // 言語管理システムを先に初期化
    setTimeout(() => {
        const game = new ReverseTetris();
        window.gameInstance = game; // グローバルアクセス用
    }, 100);
});