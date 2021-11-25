module.exports = function(){
    var express = require('express');
    var router = express.Router();

    router.post('/', function (req, res) {
        console.log("h");
        var mysql = req.app.get('mysql');
        var sql = "UPDATE Wines SET price=?, inventoryAmount= ?, status=? WHERE brand=? AND year=? AND type=?";
        var inserts = [req.body.price, req.body.inventoryAmount, req.body.status, req.body.brand, req.body.year, req.body.type];
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
