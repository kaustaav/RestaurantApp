// Connencting with mongDB atlas server

const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const morgan = require('morgan');
const passport = require('passport');
const path = require('path');

const users = require('./routes/api/users');
const restaurants = require('./routes/api/restaurants');

const app = express();
const port = process.env.PORT || 5000;

app.use(
    bodyParser.urlencoded({
        extended: false
    })
);

app.use(cors());

app.use(bodyParser.json());

const db = require('./config/keys').mongoURI;

mongoose
    .connect(
        db,
        { 
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useFindAndModify: false
        }
    )
    .then(() => console.log('MongoDB successfully connected'))
    .catch(err => console.log(err));

mongoose.connection.on('connected', () => {
    console.log('Mongoose is connected');
})

if(process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, 'client/build')));

    app.get('*', function(req,res) {
        res.sendFile(path.join(__dirname, 'client/build/index.html'));
    })
}

app.use(morgan('tiny'));

app.use(passport.initialize());

require('./config/passport')(passport);

app.use('/api/users', users);
app.use('/api/restaurants', restaurants);

app.listen(port, () => console.log(`Server running on port ${port}`));