const express = require('express');
const { authController, userController } = require('./controllers');
// ...

const app = express();

app.use(express.json());

app.post('/login', authController.login);

app.post('/user', userController.createUser);

// ...

// É importante exportar a constante `app`,
// para que possa ser utilizada pelo arquivo `src/server.js`
module.exports = app;
