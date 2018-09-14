const express = require('express');
const router = express.Router();
const path = require('path');

// start of use controllers
const ctrlUser = require('../controllers/user');
const ctrlNews = require('../controllers/news');

// all GET requests
router.get('/api/getUsers', ctrlUser.getUsers);
router.get('/api/getNews', ctrlNews.getNews);

// all POST requests
router.post('/api/login', ctrlUser.login);
router.post('/api/authFromToken', ctrlUser.authFromToken);
router.post('/api/saveNewUser', ctrlUser.saveNewUser);
router.post('/api/saveUserImage/:id', ctrlUser.saveUserImage);
router.post('/api/newNews', ctrlNews.newNews);

// all PUT requests
router.put('/api/updateUser/:id', ctrlUser.updateUser);
router.put('/api/updateUserPermission/:id', ctrlUser.updateUserPermission);
router.put('/api/updateNews/:id', ctrlNews.updateNews);

// all DELETE requests
router.delete('/api/deleteUser/:id', ctrlUser.deleteUser);
router.delete('/api/deleteNews/:id', ctrlNews.deleteNews);

// all GET requests, response index.html SPA
router.get('*', function (req, res, next) {
    res.sendFile(path.join(__dirname, '../../public/index.html'));
});

module.exports = router;
