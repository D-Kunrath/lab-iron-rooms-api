// configurações
require('dotenv').config();
const connect = require('./configs/db.config');
connect();

// pacotes
const express = require('express');
const cors = require('cors');

const app = express();

app.listen(process.env.PORT, () => {
  console.log(`Server running on PORT: ${process.env.PORT}`);
});