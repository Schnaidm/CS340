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
        var sql = "INSERT INTO Orders_Wines (orderID, bottleID) VALUES (?,?)";
        var inserts = [req.body.orderID, req.body.bottleID];
        sql = mysql.pool.query(sql, inserts, function (error, results, fields) {
            if (error) {
                res.write(JSON.stringify(error));
                res.end();
            } else {
                res.redirect('/wine_orders');
            }
        });
    });    

    return router;
}();
