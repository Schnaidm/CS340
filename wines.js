module.exports = function(){
    var express = require('express');
    var router = express.Router();

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

    router.get('/', function(req, res){
        var callbackCount = 0;
        var context = {};
        var mysql = req.app.get('mysql');
        getWines(res, mysql, context, complete);
        function complete(){
            callbackCount++;
            if(callbackCount >= 1){
                res.render('wines', context);
            }

        }
    });
    
    router.post('/', function (req, res) {
        var mysql = req.app.get('mysql');
        var sql = "INSERT INTO Wines (brand, type, year, price, inventoryAmount) VALUES (?,?,?,?,?)";
        var inserts = [req.body.brand, req.body.type, req.body.year, req.body.price, req.body.inventoryAmount];
        sql = mysql.pool.query(sql, inserts, function (error, results, fields) {
            if (error) {
                res.write(JSON.stringify(error));
                res.end();
            } else {
                res.redirect('/wines');
            }
        });
    });

    return router;
}();
