const express = require('express');
const app = express();
const morgan = require('morgan');
const cors = require('cors');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const connectDB = require('./config/db');

dotenv.config();

const authRouters = require('./routes/auth');

connectDB();

app.use(express.json());
app.use(express.static('public'));
app.use(morgan('dev'));
app.use(cors({
    credentials:true,
    origin: process.env.CLIENT_URL
    // origin: ['http://localhost:5173']
}));
app.use(cookieParser());
app.use(bodyParser.json());

app.use('/api', authRouters);

readdirSync('./routes').map(r => app.use('', require('./routes/' + r)));

app.listen(process.env.PORT, () =>
  console.log(`Server is running on port ${process.env.PORT}`)
);
