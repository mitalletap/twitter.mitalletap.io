const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const path = require('path');
const userRoutes = require('./routes/user');
const postRoutes = require('./routes/post');

require('dotenv').config();
mongoose.set('useFindAndModify', false);

const app = express();
const port = process.env.PORT || 8080;
app.use(cors());
app.use(express.json());




const uri = process.env.MONGOOSE_URI;
mongoose.connect(uri, { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true });

const db = mongoose.connection;
db.once('open', () => {
    console.log("Connected to MongoDB Cluster");
})


app.use('/user', userRoutes);
app.use('/post', postRoutes);

app.get('/', (req, res) => {
    console.log('/');
    res.json({ "message": "You got the message!" });
});

app.listen(port, function() {
    console.log("Listening on port " + port);
});
