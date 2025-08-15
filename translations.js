// 多言語対応システム

const translations = {
    en: {
        // Page Title and Headers
        title: "🎮 Reverse Tetris",
        subtitle: "Send pieces to the AI and make it stack up as quickly as possible!",
        
        // Game Interface
        score: "Score",
        piecesSent: "Pieces Sent",
        linesCleared: "Lines Cleared",
        height: "Height",
        difficulty: "Difficulty",
        difficultyEasy: "Easy (Weak AI)",
        difficultyNormal: "Normal (Standard AI)",
        difficultyHard: "Hard (Strong AI)",
        
        // Piece Selection
        selectNextPiece: "Select Next Piece",
        nextPieceQueue: "Next Piece to Send",
        
        // Game Controls
        startGame: "Start Game",
        pauseGame: "Pause",
        resumeGame: "Resume",
        resetGame: "Reset",
        
        // Game Status
        gameOver: "🎉 Game Clear!",
        gameOverMessage: "You successfully made the AI stack up!",
        finalScore: "Final Score:",
        finalPieces: "Pieces Sent:",
        
        // Instructions
        howToPlay: "How to Play",
        instruction1: "Select pieces from the right panel to send to the AI",
        instruction2: "The AI will try to place pieces in optimal positions",
        instruction3: "Send difficult pieces to trouble the AI!",
        instruction4: "Win when pieces stack up to the top of the screen!",
        
        // Language Selector
        language: "Language",
        english: "English",
        japanese: "日本語",
        chinese: "中文"
    },
    
    ja: {
        // Page Title and Headers
        title: "🎮 Reverse Tetris",
        subtitle: "AIにミノを送って、できるだけ早く積み上げさせよう！",
        
        // Game Interface
        score: "スコア",
        piecesSent: "送ったミノ",
        linesCleared: "消したライン",
        height: "高さ",
        difficulty: "難易度",
        difficultyEasy: "かんたん（弱いAI）",
        difficultyNormal: "ふつう（普通のAI）",
        difficultyHard: "むずかしい（強いAI）",
        
        // Piece Selection
        selectNextPiece: "次のミノを選択",
        nextPieceQueue: "次に送るミノ",
        
        // Game Controls
        startGame: "ゲーム開始",
        pauseGame: "一時停止",
        resumeGame: "再開",
        resetGame: "リセット",
        
        // Game Status
        gameOver: "🎉 ゲームクリア！",
        gameOverMessage: "AIを積ませることに成功しました！",
        finalScore: "最終スコア:",
        finalPieces: "送ったミノ:",
        
        // Instructions
        howToPlay: "遊び方",
        instruction1: "右側のパネルからミノを選んでAIに送ります",
        instruction2: "AIは最適な位置にミノを配置しようとします",
        instruction3: "難しいミノを送って、AIを困らせましょう！",
        instruction4: "画面の上まで積み上がったらあなたの勝ち！",
        
        // Language Selector
        language: "言語",
        english: "English",
        japanese: "日本語",
        chinese: "中文"
    },
    
    zh: {
        // Page Title and Headers
        title: "🎮 Reverse Tetris",
        subtitle: "向AI发送方块，让它尽快堆叠起来！",
        
        // Game Interface
        score: "分数",
        piecesSent: "发送方块",
        linesCleared: "消除行数",
        height: "高度",
        difficulty: "难度",
        difficultyEasy: "简单（弱AI）",
        difficultyNormal: "普通（标准AI）",
        difficultyHard: "困难（强AI）",
        
        // Piece Selection
        selectNextPiece: "选择下一个方块",
        nextPieceQueue: "下一个发送的方块",
        
        // Game Controls
        startGame: "开始游戏",
        pauseGame: "暂停",
        resumeGame: "继续",
        resetGame: "重置",
        
        // Game Status
        gameOver: "🎉 游戏通关！",
        gameOverMessage: "您成功让AI堆叠起来了！",
        finalScore: "最终分数：",
        finalPieces: "发送方块：",
        
        // Instructions
        howToPlay: "游戏规则",
        instruction1: "从右侧面板选择方块发送给AI",
        instruction2: "AI会尝试将方块放置在最佳位置",
        instruction3: "发送困难的方块来为难AI！",
        instruction4: "当方块堆叠到屏幕顶部时你就获胜了！",
        
        // Language Selector
        language: "语言",
        english: "English",
        japanese: "日本語",
        chinese: "中文"
    }
};

class LanguageManager {
    constructor() {
        this.currentLanguage = this.getStoredLanguage() || 'en'; // デフォルトは英語
        this.init();
    }
    
    init() {
        this.updateLanguage(this.currentLanguage);
        this.setupLanguageSelector();
    }
    
    getStoredLanguage() {
        return localStorage.getItem('reverseTetrieLanguage');
    }
    
    storeLanguage(lang) {
        localStorage.setItem('reverseTetrieLanguage', lang);
    }
    
    changeLanguage(lang) {
        if (translations[lang]) {
            this.currentLanguage = lang;
            this.storeLanguage(lang);
            this.updateLanguage(lang);
        }
    }
    
    updateLanguage(lang) {
        const t = translations[lang] || translations.en;
        
        // Update all text elements
        this.updateElement('page-title', t.title);
        this.updateElement('page-subtitle', t.subtitle);
        
        // Game Interface
        this.updateElement('score-label', t.score);
        this.updateElement('pieces-sent-label', t.piecesSent + ':');
        this.updateElement('lines-cleared-label', t.linesCleared + ':');
        this.updateElement('height-label', t.height + ':');
        
        // Difficulty
        this.updateElement('difficulty-label', t.difficulty);
        this.updateSelectOption('difficulty', 'easy', t.difficultyEasy);
        this.updateSelectOption('difficulty', 'normal', t.difficultyNormal);
        this.updateSelectOption('difficulty', 'hard', t.difficultyHard);
        
        // Piece Selection
        this.updateElement('select-piece-label', t.selectNextPiece);
        this.updateElement('next-piece-label', t.nextPieceQueue);
        
        // Game Controls
        this.updateElement('start-btn', t.startGame);
        this.updateElement('pause-btn', t.pauseGame);
        this.updateElement('reset-btn', t.resetGame);
        
        // Instructions
        this.updateElement('instructions-title', t.howToPlay);
        this.updateElement('instruction1', t.instruction1);
        this.updateElement('instruction2', t.instruction2);
        this.updateElement('instruction3', t.instruction3);
        this.updateElement('instruction4', t.instruction4);
        
        // Language Selector
        this.updateElement('language-label', t.language);
        
        // Update language selector value
        const langSelect = document.getElementById('language-select');
        if (langSelect) {
            langSelect.value = lang;
        }
        
        // Store current translations for game use
        window.currentTranslations = t;
    }
    
    updateElement(id, text) {
        const element = document.getElementById(id);
        if (element) {
            element.textContent = text;
        }
    }
    
    updateSelectOption(selectId, optionValue, text) {
        const select = document.getElementById(selectId);
        if (select) {
            const option = select.querySelector(`option[value="${optionValue}"]`);
            if (option) {
                option.textContent = text;
            }
        }
    }
    
    setupLanguageSelector() {
        const langSelect = document.getElementById('language-select');
        if (langSelect) {
            langSelect.addEventListener('change', (e) => {
                this.changeLanguage(e.target.value);
                // ゲームインスタンスのボタンテキストも更新
                if (window.gameInstance) {
                    this.updateGameButtons();
                }
            });
        }
    }
    
    updateGameButtons() {
        const t = translations[this.currentLanguage] || translations.en;
        const pauseBtn = document.getElementById('pause-btn');
        if (pauseBtn && window.gameInstance) {
            if (window.gameInstance.isPaused) {
                pauseBtn.textContent = t.resumeGame;
            } else {
                pauseBtn.textContent = t.pauseGame;
            }
        }
    }
    
    // Get translated text for dynamic content
    t(key) {
        const t = translations[this.currentLanguage] || translations.en;
        return t[key] || key;
    }
}

// グローバルインスタンス
let languageManager;

// DOM読み込み後に初期化
document.addEventListener('DOMContentLoaded', () => {
    languageManager = new LanguageManager();
});