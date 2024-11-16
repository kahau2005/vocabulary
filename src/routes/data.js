const express = require('express');
const router = express.Router();
const middlewareController = require('../app/controllers/MiddlewareController');
const dataController = require('../app/controllers/dataController');

router.post('/user',middlewareController.verifyToken, dataController.getUserData);
router.post('/upload-paragraph',middlewareController.verifyToken, dataController.uploadParagrap);
router.post('/word-data',middlewareController.verifyToken, dataController.processWord);
router.post('/get-doc',middlewareController.verifyToken, dataController.getDocData);
router.post('/upload-words',middlewareController.verifyToken, dataController.uploadWords);

module.exports = router;