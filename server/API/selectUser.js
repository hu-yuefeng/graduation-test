let express = require('express')
let router = express.Router()
let db = require('../db/index')

router.get('/selectUser', async(req, res) => {
    let { id } = req.query;

  var sql = "select * from user where id = ?"
    var sqlall = [id];
  await db.query(sql,sqlall,(err, data) => {
    if (err) {
      return res.send('错误:' + err.message)
    }
    res.send(data)
  })
    
});
router.post('/newlyShow', async(req, res) => {
    const id  = req.body.data.id;
    var sql = "select * from lygl where id = ?"
    await db.query(sql,id,(err, data) => {
        if (err) {
            return res.send('错误:' + err.message)
        }
    res.send(data)
    })
    
})
module.exports = router