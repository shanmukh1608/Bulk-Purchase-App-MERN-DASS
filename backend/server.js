const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose')

const app = express();
const PORT = 4000;
const userRoutes = express.Router();

// let User = require('./models/user');

app.use(cors());
app.use(bodyParser.json());

// Connection to mongodb
mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.set('useUnifiedTopology', true);

mongoose.connect('mongodb://127.0.0.1:27017/users');
const connection = mongoose.connection;
connection.once('open', function() {
	console.log("MongoDB database connection established succesfully.");
})

// API endpoints

// Getting all the users

customerRoute = require('./routes/customer');
vendorRoute = require('./routes/vendor');
loginRoute = require('./routes/login');
productRoute = require('./routes/product');
orderRoute = require('./routes/order')
reviewRoute = require('./routes/review')


app.use('/customer', customerRoute);
app.use('/vendor', vendorRoute);
app.use('/login', loginRoute);
app.use('/product', productRoute);
app.use('/order', orderRoute);

app.use('/review', reviewRoute);


// // Getting a user by id
// userRoutes.route('/:id').get(function(req, res) {
//     let id = req.params.id;
//     User.findById(id, function(err, user) {
//         res.json(user);
//     });
// });

app.use('/', userRoutes);

app.listen(PORT, function() {
	console.log("Server is running on port: " + PORT);
});
