const express = require('express');
const router = express.Router();

router.use(require('./viewRoutes'));
//router.use(require('./addRoutes'));
//router.use(require('./updateRoutes'));

module.exports = router;