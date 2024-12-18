#!/bin/bash

# 出力ディレクトリの作成
mkdir -p public/videos

# 各品質レベルでのエンコード設定の説明
# 1080p: 高品質 - ビットレート5Mbps、音声192kbps
# 720p:  中品質 - ビットレート2.8Mbps、音声128kbps
# 480p:  低品質 - ビットレート1.4Mbps、音声96kbps

# HLS関連の主要なオプション
# - hls_time 6
#   - セグメントの長さを6秒に設定
#     - 短すぎると：ファイル数が増える、サーバー負荷が上がる
#     - 長すぎると：品質切り替えの遅延が大きくなる、初期バッファリングが長くなる
#     - 一般的な設定値は4-10秒の間
# - hls_list_size 0
#   - m3u8プレイリストに含めるセグメント数
#     - 0 = 制限なし（全セグメントを保持）
#     - ライブ配信の場合は適切な数値（例：5や10）を設定して古いセグメントを削除する
#     - アーカイブ配信の場合は0で問題なし
# - hls_segment_filename "public/videos/1080p_%03d.ts"
#   - セグメントファイルの命名規則
#   - %03d = 3桁の連番（001, 002, ...）
#   - この例では 1080p_001.ts, 1080p_002.ts という形式で出力される

# 高品質バージョン (1080p)
ffmpeg -i input.mp4 \
  -vf "scale=1920:1080" \
  -c:v libx264 -b:v 5000k \
  -c:a aac -b:a 192k \
  -hls_time 6 \
  -hls_list_size 0 \
  -hls_segment_filename "public/videos/1080p_%03d.ts" \
  public/videos/1080p.m3u8

# 中画質バージョン (720p)
ffmpeg -i input.mp4 \
  -vf "scale=1280:720" \
  -c:v libx264 -b:v 2800k \
  -c:a aac -b:a 128k \
  -hls_time 6 \
  -hls_list_size 0 \
  -hls_segment_filename "public/videos/720p_%03d.ts" \
  public/videos/720p.m3u8

# 低画質バージョン (480p)
ffmpeg -i input.mp4 \
  -vf "scale=854:480" \
  -c:v libx264 -b:v 1400k \
  -c:a aac -b:a 96k \
  -hls_time 6 \
  -hls_list_size 0 \
  -hls_segment_filename "public/videos/480p_%03d.ts" \
  public/videos/480p.m3u8

# マスタープレイリストの作成
# 各ストリームのBANDWIDTHは対応するビットレートと一致させる
cat > public/videos/playlist.m3u8 << EOF
#EXTM3U
#EXT-X-VERSION:3

#EXT-X-STREAM-INF:BANDWIDTH=5000000,RESOLUTION=1920x1080
1080p.m3u8

#EXT-X-STREAM-INF:BANDWIDTH=2800000,RESOLUTION=1280x720
720p.m3u8

#EXT-X-STREAM-INF:BANDWIDTH=1400000,RESOLUTION=854x480
480p.m3u8
EOF