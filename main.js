'use strict';

// NOTE: Don't change the port number
const PORT = 3000;



const express = require("express");
const mysql = require('./dbcon.js');
const app = express();
const handlebars = require('express-handlebars').create({
    defaultLayout: 'main',
});

app.use(express.urlencoded({
    extended: true
}));
app.use(express.static('public'));
app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');
app.set('mysql', mysql);
app.use('/static', express.static('public'));
app.use('/customers', require('./customers.js'));
app.use('/employees', require('./employees.js'));
app.use('/orders', require('./orders.js'));
app.use('/wines', require('./wines.js'));
app.use('/wine_orders', require('./wine_orders.js'));
app.use('/updatewine', require('./updateWine.js'));
app.use('/deleteorder', require('./deleteOrder.js'));
app.use('/', express.static('public'));

app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}...`);
});