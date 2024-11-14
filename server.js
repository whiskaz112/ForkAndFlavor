const express = require('express');
const app = express();
const morgan = require('morgan');
const cors = require('cors');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const connectDB = require('./config/db');
const { readdirSync } = require('fs');
const cookies = require('cookie-parser');

// const productRouters = require('./routes/product')
// const authRouters = require('./routes/auth')
const authRouters = require('./routes/auth');

connectDB();

app.use(express.json());
app.use(express.static('public'));
app.use(morgan('dev'));
app.use(cors({
    credentials:true,
    origin: ['http://localhost:5173']
}));
app.use(cookies());
app.use(cookieParser());
// app.use(cors({
//     credentials: true,
//     origin: ['http://localhost:5173']
// }));
app.use(bodyParser.json({ limit: '10mb' }));

app.use('/api', authRouters);

// Route 3
readdirSync('./routes').map(r => app.use('/api', require('./routes/' + r)));

app.listen(5000, () => console.log('Server is Running 5000'));
