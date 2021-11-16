module.exports = function(){
    var express = require('express');
    var router = express.Router();

    function getOrders(res, mysql, context, complete){
        mysql.pool.query("SELECT Orders.orderID, Orders.date, Customers.firstName as CustomerFirstName, Customers.lastName as CustomerLastName, Orders.totalPrice, Employees.firstName as EmployeeFirstName, Employees.lastName as EmployeeLastName FROM Orders JOIN Customers ON Orders.phoneNumber = Customers.phoneNumber LEFT JOIN Employees ON Orders.employeeID = Employees.employeeID", function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.orders = results;
            complete();
        });
    };    

    router.get('/', function(req, res){
        var callbackCount = 0;
        var context = {};
        var mysql = req.app.get('mysql');
        getOrders(res, mysql, context, complete);
        function complete(){
            callbackCount++;
            if(callbackCount >= 1){
                res.render('orders', context);
            }

        }
    });

    return router;
}();