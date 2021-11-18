module.exports = function(){
    var express = require('express');
    var router = express.Router();

    function getWineOrders(res, mysql, context, complete){
        mysql.pool.query("SELECT orderID, bottleID, quantity FROM Orders_Wines", function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.wine_orders = results;
            complete();
        });
    };    

    router.get('/', function(req, res){
        var callbackCount = 0;
        var context = {};
        var mysql = req.app.get('mysql');
        getWineOrders(res, mysql, context, complete);
        function complete(){
            callbackCount++;
            if(callbackCount >= 1){
                res.render('wine_orders', context);
            }

        }
    });
    
    router.post('/', function (req, res) {
        var mysql = req.app.get('mysql');
        var ordersql = "UPDATE Orders SET totalPrice = (SELECT sum(Wines.price) FROM Orders_Wines join Wines on Orders_Wines.bottleID = Wines.bottleID WHERE Orders_Wines.orderID = ?) Where orderID = ?";
        var orderinserts = [req.body.orderID, req.body.orderID];
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
                        res.redirect('/wine_orders');
                    }
                });
            }
        });
        
    });    

    return router;
}();
