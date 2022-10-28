const express = require('express');
const { 
  authController, 
  userController, 
  categoryController, 
  postController, 
} = require('./controllers');
const { validateAuth } = require('./middlewares/validateToken');
// ...
const app = express();

app.use(express.json());

app.post('/login', authController.login);

app.post('/user', userController.createUser);

app.get('/user', validateAuth, userController.getAllUsers);

app.get('/user/:id', validateAuth, userController.getUserById);

app.post('/categories', validateAuth, categoryController.createCategory);

app.get('/categories', validateAuth, categoryController.getAllCategories);

app.post('/post', validateAuth, postController.createPost);

app.get('/post', validateAuth, postController.getAllPosts);

// ...

// É importante exportar a constante `app`,
// para que possa ser utilizada pelo arquivo `src/server.js`
module.exports = app;
