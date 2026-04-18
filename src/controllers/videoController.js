const path = require('path');
const { addEncodeJob } = require('../services/encoder.service');

const uploadVideo = async (req, res) => {
  console.log('--- NEW UPLOAD REQUEST ---');
  console.log('Headers:', req.headers['content-type']);
  console.log('Body:', req.body);
  console.log('File:', req.file ? 'Received' : 'Missing');

  try {
    if (!req) {
      return res.status(500).json({
        success: false,
        message: 'Request object is missing'
      });
    }

    const file = req.file;
    const body = req.body || {};
    const movieId = body.movieId || body.movieid;

    // Validation
    if (!movieId) {
      return res.status(400).json({
        success: false,
        message: 'movieId is required'
      });
    }

    if (!file) {
      return res.status(400).json({
        success: false,
        message: 'video file is required'
      });
    }

    console.log('[videoController] Upload video:', {
      filename: file.filename,
      movieId: movieId,
      size: file.size
    });

    // Thêm job encode
    const job = addEncodeJob({
      file: file.filename,
      movieId: parseInt(movieId)
    });

    res.json({
      success: true,
      message: 'Upload thành công, đang encode...',
      job: job
    });

  } catch (err) {
    console.error('[videoController] Upload error:', err);
    res.status(500).json({
      success: false,
      message: "Upload failed",
      error: err.message
    });
  }
};

module.exports = { uploadVideo };