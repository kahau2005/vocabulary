const express = require('express');
const router = express.Router();
const middlewareController = require('../app/controllers/MiddlewareController');
const dataController = require('../app/controllers/dataController');

router.post('/user', dataController.getUserData);
router.post('/upload-paragraph', dataController.uploadParagrap);
router.post('/word-data', dataController.processWord);
router.post('/get-doc', dataController.getDocData);
router.post('/upload-words', dataController.uploadWords);

module.exports = router;