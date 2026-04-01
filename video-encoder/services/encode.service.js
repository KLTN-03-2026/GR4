const ffmpeg = require('fluent-ffmpeg');
const fs = require('fs');
const path = require('path');
const { UPLOAD_DIR, OUTPUT_DIR } = require('../config');

// Set FFmpeg path for Windows
if (process.platform === 'win32') {
  const ffmpegPath = 'C:\\ffmpeg\\bin\\ffmpeg.exe';
  if (fs.existsSync(ffmpegPath)) {
    ffmpeg.setFfmpegPath(ffmpegPath);
    console.log('[encode.service] FFmpeg path set to:', ffmpegPath);
  } else {
    console.warn('[encode.service] FFmpeg not found!');
  }
}

function convertToHLS(filename, movieId) {
  return new Promise((resolve, reject) => {
    const inputPath = path.join(UPLOAD_DIR, filename);
    const outputDir = path.join(OUTPUT_DIR, movieId.toString(), 'hls');

    console.log('[encode.service] convertToHLS', { inputPath, outputDir });

    if (!fs.existsSync(inputPath)) {
      return reject(new Error(`Input video not found: ${inputPath}`));
    }

    fs.mkdirSync(outputDir, { recursive: true });

    // Định nghĩa các variant bitrates
    const variants = [
      { bitrate: '360p', bandwidth: '800k', bufsize: '1200k' },
      { bitrate: '720p', bandwidth: '2500k', bufsize: '3750k' },
      { bitrate: '1080p', bandwidth: '5000k', bufsize: '7500k' }
    ];

    let command = ffmpeg(inputPath);

    // Tạo output cho mỗi variant
    variants.forEach((variant, index) => {
      const variantDir = path.join(outputDir, variant.bitrate);
      fs.mkdirSync(variantDir, { recursive: true });

      command = command
        .output(path.join(variantDir, 'index.m3u8'))
        .outputOptions([
          `-c:v libx264`,
          `-c:a aac`,
          `-b:v ${variant.bandwidth}`,
          `-maxrate ${variant.bandwidth}`,
          `-bufsize ${variant.bufsize}`,
          `-b:a 128k`,
          `-hls_time 10`,
          `-hls_list_size 0`,
          `-hls_segment_filename ${path.join(variantDir, 'segment-%03d.ts')}`,
          `-f hls`
        ]);
    });

    // Tạo master playlist
    const masterPlaylist = `#EXTM3U
#EXT-X-VERSION:3
#EXT-X-STREAM-INF:BANDWIDTH=800000,RESOLUTION=640x360
360p/index.m3u8
#EXT-X-STREAM-INF:BANDWIDTH=2500000,RESOLUTION=1280x720
720p/index.m3u8
#EXT-X-STREAM-INF:BANDWIDTH=5000000,RESOLUTION=1920x1080
1080p/index.m3u8
`;

    command
      .on('start', (cmd) => {
        console.log('[encode.service] FFmpeg start:', cmd);
      })
      .on('end', () => {
        console.log('✅ Encode xong:', filename);

        // Ghi master playlist
        fs.writeFileSync(path.join(outputDir, 'master.m3u8'), masterPlaylist);

        // Trả về URL cho frontend (match với Nginx port 8080)
        const hlsPath = `http://localhost:8080/hls/${movieId}/hls/master.m3u8`;
        resolve(hlsPath);
      })
      .on('error', (err) => {
        console.error('[encode.service] FFmpeg error:', err.message);
        reject(err);
      })
      .run();
  });
}

module.exports = { convertToHLS };