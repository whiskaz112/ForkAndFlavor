const express = require('express');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const cors = require('cors');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const { getCurrentUserId } = require('./services/userService');

dotenv.config();

const { readdirSync } = require('fs');

const app = express();

connectDB();

app.use(morgan('dev'));

app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  })
);
app.use(cookieParser());

app.use(bodyParser.json());

readdirSync('./routes').map(r => app.use('', require('./routes/' + r)));

app.listen(process.env.PORT, () =>
  console.log(`Server is running on port ${process.env.PORT}`)
);
