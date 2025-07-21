require('dotenv').config();
const express = require('express');
const app = express();
const connectDB = require('./config/db');

app.use(express.json());
app.set('view engine', 'ejs');
app.use(express.static('public'));

//mongo connection
connectDB();

app.use('/auth', require('./routes/auth'));
app.use('/user', require('./routes/user'));
app.use('/admin', require('./routes/admin'));

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`)); 