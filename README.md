# 🎮 Reverse Tetris - AIを積ませろ！

![Game Preview](https://img.shields.io/badge/Status-Playable-brightgreen)
![Language](https://img.shields.io/badge/Language-JavaScript-yellow)
![License](https://img.shields.io/badge/License-MIT-blue)

## 📝 概要

Reverse Tetrisは、従来のテトリスを逆転させた新しいゲームです。プレイヤーはAI（コンピューター）にミノ（テトリミノ）を送って、できるだけ早くAIを積み上げさせることが目標です。

## 🎯 ゲームの特徴

- **逆転の発想**: プレイヤーがミノを選んでAIに送る
- **3段階のAI難易度**: かんたん、ふつう、むずかしい
- **リアルタイム戦略**: どのミノを送るかの戦略が重要
- **美しいUI**: モダンでレスポンシブなデザイン

## 🚀 遊び方

1. **ゲーム開始**: 「ゲーム開始」ボタンをクリック
2. **ミノ選択**: 右側のパネルから送りたいミノを選択
3. **AIの動き**: AIが最適な位置にミノを配置
4. **勝利条件**: 画面の上まで積み上がったらプレイヤーの勝ち！

### 戦略のコツ
- 長いIピースは避けられがち
- SやZピースは配置が難しい
- 難易度を上げるとAIが賢くなります

## 🛠️ 技術仕様

- **フロントエンド**: Pure JavaScript (ES6+), HTML5 Canvas
- **AI**: 評価関数ベースの思考エンジン
- **レスポンシブ**: デスクトップ・モバイル対応

## 🎮 プレイ

GitHub Pagesで直接プレイできます:
👉 **[Play Reverse Tetris](https://mechanicalgoat.github.io/reverse-tetris/)**

## 📦 ローカル実行

```bash
# リポジトリをクローン
git clone https://github.com/Mechanicalgoat/reverse-tetris.git

# ディレクトリに移動
cd reverse-tetris

# ローカルサーバーで実行（例：Live Server, Python等）
python -m http.server 8000
# または
npx live-server
```

ブラウザで `http://localhost:8000` にアクセス

## 🏗️ ファイル構成

```
reverse-tetris/
├── index.html          # メインHTML
├── style.css           # スタイルシート
├── game.js             # ゲームロジック
├── tetris-ai.js        # AI思考エンジン
└── README.md           # このファイル
```

## 🤖 AI の仕組み

AIは以下の要素を評価してミノの配置を決定します:

- **高さ**: 積み上がりの高さ（低い方が良い）
- **ライン消去**: 完成ラインの数（多い方が良い）
- **穴**: 埋められない空洞（少ない方が良い）
- **凸凹度**: 表面の凸凹（少ない方が良い）

難易度によってこれらの重み付けが変わります。

## 🎨 スクリーンショット

[ゲーム画面のスクリーンショットをここに追加予定]

## 📝 ライセンス

MIT License - 詳細は [LICENSE](LICENSE) ファイルを参照

## 🤝 コントリビューション

バグ報告や機能提案は Issues にお気軽にどうぞ！

## 👨‍💻 開発者

Developed with ❤️ by [Mechanicalgoat](https://github.com/Mechanicalgoat)

---

🎮 **楽しいゲーム体験をお楽しみください！**