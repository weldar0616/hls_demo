// public/js/player.js
const player = videojs('player', {
  html5: {
    hls: {
      // HLSのネイティブ実装ではなく、video.jsのHLS実装を使用
      overrideNative: true,
 
      // 初期再生時に低品質から始めない（false = 高品質から開始）
      enableLowInitialPlaylist: false,
 
      // 初期帯域幅の想定値(bps)。高すぎると開始時の品質選択を誤る可能性
      bandwidth: 5000000,
 
      // 自動で読み込みと再生を開始
      autoStartLoad: true,
 
      // 品質切り替え関連の設定
      smoothQualityChange: true,     // 品質切り替え時にスムーズな遷移を行う
      handlePartialData: true,       // 部分的なデータでも処理を試みる
 
      // バッファ関連の設定
      backBufferLength: 30,          // 過去にバッファするデータ量（秒）
      maxMaxBufferLength: 30,        // 先読みバッファの最大値（秒）
 
      // ライブ配信用の設定（アーカイブ配信では影響しない）
      liveSyncDuration: 3,
      liveMaxLatencyDuration: 6,
    }
  }
});

// 品質切り替えのログ
player.on('loadedmetadata', function() {
  const qualityLevels = player.qualityLevels();
  console.log('利用可能な品質:', qualityLevels.length);
  for(let i = 0; i < qualityLevels.length; i++) {
    console.log(`品質 ${i}: ${qualityLevels[i].width}x${qualityLevels[i].height}`);
  }
});

// 品質変更時のログ
player.on('qualityChange', function() {
  const qualityLevels = player.qualityLevels();
  for(let i = 0; i < qualityLevels.length; i++) {
    if (qualityLevels[i].enabled) {
      console.log(`現在の品質: ${qualityLevels[i].width}x${qualityLevels[i].height}`);
    }
  }
});

// 品質設定をより詳細に監視
player.on('playing', function() {
  const qualityLevels = player.qualityLevels();
  
  // 品質レベルの変更を監視
  qualityLevels.on('change', function() {
    const selectedQuality = qualityLevels[qualityLevels.selectedIndex];
    console.log(`品質変更: ${selectedQuality.width}x${selectedQuality.height} (${selectedQuality.bitrate / 1000}kbps)`);
  });
});

// ネットワーク状態のモニタリングを追加
setInterval(() => {
  if (player.tech_ && player.tech_.hls) {
    const hls = player.tech_.hls;
    const bandwidth = hls.bandwidth;  // 現在の推定帯域幅
    console.log(`現在の推定帯域幅: ${Math.round(bandwidth / 1000)}kbps`);
  }
}, 3000);
