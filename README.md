# HLS Streaming Demo

- 途中から再生した時の挙動を確認
- アダプティブビットレートを体験
  - ネットワーク速度 × 解像度

## 1. セットアップ
npm install

## 2. 動画の準備
- FFmpegスクリプトをコピーして実行可能にする
```
chmod +x convert.sh
```
- 元動画をinput.mp4として配置
```
./convert.sh
```

## 3. サーバーの起動
```
npm start
```

## 4. ブラウザで確認
http://localhost:3000/

# ファイル構造
```
.
├── server.js
├── package.json
└── public/
    ├── js/
    │   └── player.js
    └── videos/
        ├── playlist.m3u8
        ├── 1080p.m3u8
        ├── 720p.m3u8
        ├── 480p.m3u8
        └── ...
```