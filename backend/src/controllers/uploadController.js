exports.uploadImages = (req, res) => {
  const files = req.files || {};
  const hostUrl = `${req.protocol}://${req.get('host')}`;
  const uploaded = {};

  if (files.avatar && files.avatar[0]) {
    uploaded.avatar_url = `${hostUrl}/uploads/${files.avatar[0].filename}`;
  }
  if (files.background && files.background[0]) {
    uploaded.background_url = `${hostUrl}/uploads/${files.background[0].filename}`;
  }

  res.json(uploaded);
};