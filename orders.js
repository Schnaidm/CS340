module.exports = function(){
    var express = require('express');
    var router = express.Router();

    function getOrders(res, mysql, context, complete){
        mysql.pool.query("SELECT Orders.orderID, DATE(Orders.date) as date, Customers.firstName as CustomerFirstName, Customers.lastName as CustomerLastName, Orders.totalPrice, Employees.firstName as EmployeeFirstName, Employees.lastName as EmployeeLastName FROM Orders JOIN Customers ON Orders.phoneNumber = Customers.phoneNumber LEFT JOIN Employees ON Orders.employeeID = Employees.employeeID", function(error, results, fields){
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
    
    router.post('/', function (req, res) {
        var mysql = req.app.get('mysql');
        var sql = "INSERT INTO Orders (date, phoneNumber, employeeID, bottleID) VALUES (?,?,?,?)";
        var inserts = [req.body.date, req.body.phoneNumber, req.body.employeeID, req.body.bottleID];
        sql = mysql.pool.query(sql, inserts, function (error, results, fields) {
            if (error) {
                res.write(JSON.stringify(error));
                res.end();
            } else {
                res.redirect('/orders');
            }
        });
    });
    
    return router;
}();
