module.exports = function(){
    var express = require('express');
    var router = express.Router();

    router.post('/', function (req, res) {
        console.log(req.body.bottleID);
        var mysql = req.app.get('mysql');
        var sql = "UPDATE Wines SET price=?, inventoryAmount= ?, status=?, brand=?, year=?, type=? WHERE bottleID=?";
        var inserts = [req.body.price, req.body.inventoryAmount, req.body.status, req.body.brand, req.body.year, req.body.type, req.body.bottleID];
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
