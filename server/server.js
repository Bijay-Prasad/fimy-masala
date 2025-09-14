// backend/server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.get('/', (req, res) => {
    return res.status(200).send({status: true, message: "Welcome to Filmy Masala API - Node-Express-MongoDB Backend"});
});

app.use('/api/auth', require('./routes/auth'));
app.use('/api/movies', require('./routes/movies'));
app.use('/api/users', require('./routes/users'));
app.use('/api/social', require('./routes/social'));
app.use('/api/admin', require('./routes/admin'));
// app.use('/api/reviews', require('./routes/reviews'));

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI)
.then(() => console.log('MongoDB connected'))
.catch(err => console.log(err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));