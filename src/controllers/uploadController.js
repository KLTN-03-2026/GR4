exports.uploadImages = (req, res) => {
  const files = req.files || {};
  const uploaded = {};

  if (files.avatar && files.avatar[0]) {
    uploaded.avatar_url = files.avatar[0].path; // Cloudinary URL
  }
  if (files.background && files.background[0]) {
    uploaded.background_url = files.background[0].path; // Cloudinary URL
  }

  res.json(uploaded);
};