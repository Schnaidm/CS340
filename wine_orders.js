module.exports = function(){
    var express = require('express');
    var router = express.Router();

    function getWineOrders(res, mysql, context, complete){
        mysql.pool.query("SELECT Orders_Wines.orderID, Orders_Wines.bottleID, Orders_Wines.quantity, Customers.firstName as firstName, Customers.lastName as lastName, Wines.brand as brand, Wines.type as type FROM Orders_Wines JOIN Wines on Orders_Wines.bottleID = Wines.bottleID JOIN Orders on Orders_Wines.orderID = Orders.orderID JOIN Customers on Orders.phoneNumber = Customers.phoneNumber", function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.wine_orders = results;
            complete();
        });
    };    

    function getWines(res, mysql, context, complete){
        mysql.pool.query("SELECT bottleID, brand, type, year, price, inventoryAmount, status FROM Wines", function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.wines = results;
            complete();
        });
    };    


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
        getWineOrders(res, mysql, context, complete);
        getOrders(res, mysql, context, complete);
        getWines(res, mysql, context, complete);
        function complete(){
            callbackCount++;
            if(callbackCount >= 3){
                res.render('wine_orders', context);
                
            }

        }
    });
    
    router.post('/', function (req, res) {
        var mysql = req.app.get('mysql');
        var inventorysql = "UPDATE Wines SET inventoryAmount = inventoryAmount - (SELECT quantity FROM Orders_Wines join Wines on Orders_Wines.bottleID = Wines.bottleID WHERE Orders_Wines.orderID = ? and Wines.bottleID = ?) where Wines.bottleID = ?";
        var inventoryinserts = [req.body.orderID, req.body.bottleID, req.body.bottleID];
        var ordersql = "UPDATE Orders SET totalPrice = totalPrice + (SELECT sum(Wines.price)*? FROM Orders_Wines join Wines on Orders_Wines.bottleID = Wines.bottleID WHERE Orders_Wines.orderID = ?) Where orderID = ?";
        var orderinserts = [req.body.quantity, req.body.orderID, req.body.orderID];
        var sql = "INSERT INTO Orders_Wines (orderID, bottleID, quantity) VALUES (?,?,?)";
        var inserts = [req.body.orderID, req.body.bottleID, req.body.quantity];
        sql = mysql.pool.query(sql, inserts, function (error, results, fields) {
            if (error) {
                res.write(JSON.stringify(error));
                res.end();
            } else {
                ordersql = mysql.pool.query(ordersql, orderinserts, function (error, results, fields) {
                    if (error) {
                        res.write(JSON.stringify(error));
                        res.end();
                    } else {
                        inventorysql = mysql.pool.query(inventorysql, inventoryinserts, function (error, results, fields) {
                            if (error) {
                                res.write(JSON.stringify(error));
                                res.end();
                            } else {
                                res.redirect('/wine_orders');
                            }
                        });
                    }
                });
            }
        });
        
    });    

    return router;
}();
