// テトリスAI - コンピュータープレイヤーのロジック

class TetrisAI {
    constructor(difficulty = 'normal') {
        this.difficulty = difficulty;
        // 難易度による評価パラメータの調整
        this.params = this.getDifficultyParams(difficulty);
    }
    
    getDifficultyParams(difficulty) {
        const params = {
            easy: {
                // 弱いAI - わざと悪い手を選ぶことがある
                heightWeight: -0.3,
                linesWeight: 0.5,
                holesWeight: -0.5,
                bumpinessWeight: -0.2,
                randomness: 0.3 // ランダム性を加える
            },
            normal: {
                // 普通のAI - バランスの取れたプレイ
                heightWeight: -0.5,
                linesWeight: 1.0,
                holesWeight: -1.0,
                bumpinessWeight: -0.3,
                randomness: 0.1
            },
            hard: {
                // 強いAI - 最適なプレイを目指す
                heightWeight: -0.8,
                linesWeight: 1.5,
                holesWeight: -2.0,
                bumpinessWeight: -0.5,
                randomness: 0
            }
        };
        return params[difficulty] || params.normal;
    }
    
    // 最適な配置を決定
    findBestMove(board, piece) {
        let bestScore = -Infinity;
        let bestMove = null;
        
        // すべての回転状態を試す
        for (let rotation = 0; rotation < 4; rotation++) {
            const rotatedPiece = this.rotatePiece(piece, rotation);
            
            // すべての横位置を試す
            for (let x = 0; x <= board.width - rotatedPiece[0].length; x++) {
                // この位置に配置可能かチェック
                const testBoard = this.cloneBoard(board);
                const y = this.dropPiece(testBoard, rotatedPiece, x);
                
                if (y >= 0) {
                    // 配置後のボードを評価
                    this.placePiece(testBoard, rotatedPiece, x, y);
                    const score = this.evaluateBoard(testBoard);
                    
                    // ランダム性を加える（難易度による）
                    const finalScore = score + (Math.random() - 0.5) * this.params.randomness;
                    
                    if (finalScore > bestScore) {
                        bestScore = finalScore;
                        bestMove = { x, rotation, y };
                    }
                }
            }
        }
        
        return bestMove;
    }
    
    // ボードの評価関数
    evaluateBoard(board) {
        const height = this.getMaxHeight(board);
        const lines = this.countCompleteLines(board);
        const holes = this.countHoles(board);
        const bumpiness = this.getBumpiness(board);
        
        return (
            this.params.heightWeight * height +
            this.params.linesWeight * lines +
            this.params.holesWeight * holes +
            this.params.bumpinessWeight * bumpiness
        );
    }
    
    // 最大高さを取得
    getMaxHeight(board) {
        for (let y = 0; y < board.height; y++) {
            for (let x = 0; x < board.width; x++) {
                if (board.grid[y][x]) {
                    return board.height - y;
                }
            }
        }
        return 0;
    }
    
    // 完成ラインの数を数える
    countCompleteLines(board) {
        let lines = 0;
        for (let y = 0; y < board.height; y++) {
            if (board.grid[y].every(cell => cell !== 0)) {
                lines++;
            }
        }
        return lines;
    }
    
    // 穴の数を数える
    countHoles(board) {
        let holes = 0;
        for (let x = 0; x < board.width; x++) {
            let blockFound = false;
            for (let y = 0; y < board.height; y++) {
                if (board.grid[y][x]) {
                    blockFound = true;
                } else if (blockFound) {
                    holes++;
                }
            }
        }
        return holes;
    }
    
    // 凸凹度を計算
    getBumpiness(board) {
        const heights = [];
        for (let x = 0; x < board.width; x++) {
            let height = 0;
            for (let y = 0; y < board.height; y++) {
                if (board.grid[y][x]) {
                    height = board.height - y;
                    break;
                }
            }
            heights.push(height);
        }
        
        let bumpiness = 0;
        for (let i = 0; i < heights.length - 1; i++) {
            bumpiness += Math.abs(heights[i] - heights[i + 1]);
        }
        return bumpiness;
    }
    
    // ピースを回転
    rotatePiece(piece, times) {
        let rotated = piece;
        for (let i = 0; i < times; i++) {
            const newPiece = [];
            const rows = rotated.length;
            const cols = rotated[0].length;
            
            for (let col = 0; col < cols; col++) {
                const newRow = [];
                for (let row = rows - 1; row >= 0; row--) {
                    newRow.push(rotated[row][col]);
                }
                newPiece.push(newRow);
            }
            rotated = newPiece;
        }
        return rotated;
    }
    
    // ピースをドロップ（最下部まで落とす）
    dropPiece(board, piece, x) {
        for (let y = 0; y <= board.height - piece.length; y++) {
            if (!this.canPlacePiece(board, piece, x, y)) {
                return y - 1;
            }
        }
        return board.height - piece.length;
    }
    
    // ピースが配置可能かチェック
    canPlacePiece(board, piece, x, y) {
        for (let py = 0; py < piece.length; py++) {
            for (let px = 0; px < piece[0].length; px++) {
                if (piece[py][px]) {
                    const boardY = y + py;
                    const boardX = x + px;
                    
                    if (boardY >= board.height || boardX < 0 || boardX >= board.width) {
                        return false;
                    }
                    
                    if (boardY >= 0 && board.grid[boardY][boardX]) {
                        return false;
                    }
                }
            }
        }
        return true;
    }
    
    // ピースをボードに配置
    placePiece(board, piece, x, y) {
        for (let py = 0; py < piece.length; py++) {
            for (let px = 0; px < piece[0].length; px++) {
                if (piece[py][px]) {
                    const boardY = y + py;
                    const boardX = x + px;
                    if (boardY >= 0 && boardY < board.height && boardX >= 0 && boardX < board.width) {
                        board.grid[boardY][boardX] = piece[py][px];
                    }
                }
            }
        }
    }
    
    // ボードをクローン
    cloneBoard(board) {
        return {
            width: board.width,
            height: board.height,
            grid: board.grid.map(row => [...row])
        };
    }
}