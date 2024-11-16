const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const route = require('./routes');
const {create} = require('express-handlebars');
const cors = require('cors');
const cookieParser = require('cookie-parser');

const app = express();
dotenv.config();
const hbs = create({
    extname: '.hbs'
});
const port = 3000;

app.use(cors({
    origin: '*', // Allow only this origin or use '*' to allow all
  }));
app.use(express.urlencoded({extended: true}));
app.use(cookieParser());
app.use(express.json());
app.use('/', express.static(path.join(__dirname, 'public')));
app.engine('hbs', hbs.engine);
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'resources/views'));

mongoose.connect(process.env.MONGODB).then(() => {
    console.log('Connected to MongoDB');
}).catch((err) => {
    console.log('Can not connect to MongoDB: ' + err);
})



route(app);

app.listen(port, () => {
    console.log(`The app is running at: http://localhost:${port}`);
})