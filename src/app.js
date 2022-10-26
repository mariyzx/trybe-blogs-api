const express = require('express');
const { authController, userController } = require('./controllers');
const { validateAuth } = require('./middlewares/validateToken');
// ...
const app = express();

app.use(express.json());

app.post('/login', authController.login);

app.post('/user', userController.createUser);

app.get('/user', validateAuth, userController.getAllUsers);

// ...

// É importante exportar a constante `app`,
// para que possa ser utilizada pelo arquivo `src/server.js`
module.exports = app;
