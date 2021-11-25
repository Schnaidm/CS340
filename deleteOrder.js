module.exports = function(){
    var express = require('express');
    var router = express.Router();

    router.post('/:orderID', function(req, res){
        var mysql = req.app.get('mysql');

        var inventorysql = "UPDATE Wines SET inventoryAmount = inventoryAmount + (SELECT quantity FROM Orders_Wines join Wines on Orders_Wines.bottleID = Wines.bottleID WHERE Orders_Wines.orderID = ?";
        var inventoryinserts = [req.body.orderID];
        

        var sql = "DELETE FROM Orders WHERE Orders.orderID=?";
        var inserts = [req.params.orderID];
        sql = mysql.pool.query(sql, inserts, function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.status(400); 
                res.end(); 
            }else {
                res.redirect('/orders');
            }
        })
    })


    return router;
}();
