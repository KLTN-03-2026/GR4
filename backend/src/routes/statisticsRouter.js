const express = require('express');
const router = express.Router();
const statisticsController = require('../controllers/statisticsController');
const { verifyToken, isAdmin } = require('../middlewares/usersMiddleware');

router.get('/', verifyToken, isAdmin, statisticsController.getStatistics);

module.exports = router;
