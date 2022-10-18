let express = require('express')
let router = express.Router()
let db = require('../db/index')

router.get('/user', (req, res) => {
  var sql = 'select * from user'
  db.query(sql, (err, data) => {
    if (err) {
      return res.send('错误:' + err.message)
    }
    res.send(data)
  })
}),
router.post('/updateUserPass', (req, res) => {
  // var sql = 'update user set campus = ?, class = ?, phone = ?, dom = ?, dom_number = ?, new_password = ? where id=1'
  var sql = 'update user set campus = ?, class = ?, phone = ?, dom = ?, dom_number = ?,password = ? where id=?'

  var sqlall = [
    req.body.data.campus,
    req.body.data.class,
    req.body.data.phone,
    req.body.data.dom,
    req.body.data.dom_number,
    req.body.data.new_password,
    req.body.data.id,
  ];
  db.query(sql, sqlall,(err, data) => {
    if (err) {
      return res.send('错误:' + err.message)
    }
    res.send(data)
  })
}),
router.post('/updateUser', (req, res) => {
  // var sql = 'update user set campus = ?, class = ?, phone = ?, dom = ?, dom_number = ?, new_password = ? where id=1'
  var sql = 'update user set campus = ?, class = ?, phone = ?, dom = ?, dom_number = ? where id=?'

  var sqlall = [
    req.body.data.campus,
    req.body.data.class,
    req.body.data.phone,
    req.body.data.dom,
    req.body.data.dom_number,
    // req.body.data.new_password,
    req.body.data.id,
  ];
  db.query(sql, sqlall,(err, data) => {
    if (err) {
      return res.send('错误:' + err.message)
    }
    res.send(data)
  })
}),
router.post("/newly", (req, res) => {
const page_num = req.body.data.pagenum //当前的num

const page_size = req.body.data.pagesize //当前页的数量

const params = [(parseInt(page_num) - 1) * parseInt(page_size), parseInt(page_size)]

  var sql = "select * from lygl limit ?,?"
  db.query(sql, params,(err, data) => {
    if (err) {
      return res.send('错误:' + err.message)
    }
    res.send(data)
  })
}),
router.get("/newlyAll", (req, res) => {
    var sql = "select * from lygl"
    db.query(sql, (err, data) => {
      if (err) {
        return res.send('错误:' + err.message)
      }
      res.send(data)
    })
}),
router.post("/newlyAllDelete", (req, res) => {
  const id = req.body.data.id;
  // const page_num = req.body.data.pagenum //当前的num
  // const page_size = req.body.data.pagesize //当前页的数量
  // const params = [id,(parseInt(page_num) - 1) * parseInt(page_size), parseInt(page_size)]
  var sql = "delete from lygl where id = ?"
  db.query(sql,id, (err, data) => {
    if (err) {
      return res.send('错误:' + err.message)
    }
    res.send(data)
  })
}),
router.post("/ssglDelete", (req, res) => {
  const id = req.body.data.id;
  // const page_num = req.body.data.pagenum //当前的num
  // const page_size = req.body.data.pagesize //当前页的数量
  // const params = [id,(parseInt(page_num) - 1) * parseInt(page_size), parseInt(page_size)]
  var sql = "delete from ssuser where id = ?"
  db.query(sql,id, (err, data) => {
    if (err) {
      return res.send('错误:' + err.message)
    }
    res.send(data)
    
  })
}),
router.post('/updateNewly', (req, res) => {
  // var sql = 'update user set campus = ?, class = ?, phone = ?, dom = ?, dom_number = ?, new_password = ? where id=1'
  var sql = 'update lygl set leader = ?, sex = ?, tel = ? where id=?'

  var sqlall = [
    req.body.data.leader,
    req.body.data.sex,
    req.body.data.tel,
    req.body.data.id,
  ];
  db.query(sql, sqlall,(err, data) => {
    if (err) {
      return res.send('错误:' + err.message)
    }
    res.send(data)
  })
}),
router.post("/domList", (req, res) => {
  const page_num = req.body.data.pagenum //当前的num
  
  const page_size = req.body.data.pagesize //当前页的数量
  
  const params = [(parseInt(page_num) - 1) * parseInt(page_size), parseInt(page_size)]
  
    var sql = "select * from ssgl limit ?,?"
    db.query(sql, params,(err, data) => {
      if (err) {
        return res.send('错误:' + err.message)
      }
      res.send(data)
    })
}),
router.get("/domListShow", (req, res) => {
    var sql = "select * from ssgl"
    db.query(sql,(err, data) => {
      if (err) {
        return res.send('错误:' + err.message)
      }
      res.send(data)
    })
}),
router.post("/ssuser", (req, res) => {
  var sushe  = req.body.data.dom;
  var sql = "select * from ssuser where dom = ?"
  db.query(sql,sushe,(err, data) => {
    if (err) {
      return res.send('错误:' + err.message)
    }
    res.send(data)
  })
}),
router.post("/addssuser", (req, res) => {
  const name = req.body.data.name;
  const campus = req.body.data.campus;
  const number = req.body.data.number;
  const tel = req.body.data.tel;
  const dom = req.body.data.dom;
  const cla=req.body.data.class;
  const data = [name, cla, campus, number, tel, dom];
  var sql = "insert into ssuser (name,class,campus,number,tel,dom) values(?,?,?,?,?,?)"
  db.query(sql,data,(err, data) => {
    if (err) {
      return res.send('错误:' + err.message)
    }
    res.send(data)
  })
}),
router.post("/yhqx/search", (req, res) => {
  // const query = req.body.queryInfo.query;
  const pagenum = req.body.data.pagenum;
  const pagesize = req.body.data.pagesize;
  const params = [(parseInt(pagenum) - 1) * parseInt(pagesize), parseInt(pagesize)]
  var sql = "select * from yhqx limit ?,?";
  db.query(sql, params, (err, data) => {
    if (err) {
      return res.send('错误1:' + err.message)
    }
    res.send(data);
  });
}),
router.get("/yhqx/searchAll", (req, res) => {
  // const query = req.body.queryInfo.query;
  var sql = "select * from yhqx";
  db.query(sql, (err, data) => {
    if (err) {
      return res.send('错误1:' + err.message)
    }
    res.send(data);
  });
}),
router.post("/yhqx/add", (req, res) => {
  const name = req.body.data.name;
  const sex = req.body.data.sex;
  const tel = req.body.data.tel;
  const roler = req.body.data.role;
  const data = [name, sex, tel, roler];
  var sql = "insert into yhqx (name, sex, tel, roler) values(?,?,?,?)"
  db.query(sql,data,(err, data) => {
    if (err) {
      return res.send('错误:' + err.message)
    }
    res.send(data)
  })
}),
router.post('/yhqx/edit', (req, res) => {
  // var sql = 'update user set campus = ?, class = ?, phone = ?, dom = ?, dom_number = ?, new_password = ? where id=1'
  var sql = 'update yhqx set tel = ?, roler = ? where id=?'

  var sqlall = [
    req.body.data.tel,
    req.body.data.roler,
    req.body.data.id,
  ];
  db.query(sql, sqlall,(err, data) => {
    if (err) {
      return res.send('错误:' + err.message)
    }
    res.send(data)
  })
}),
router.post("/yhqx/del", (req, res) => {
  const id = req.body.data.id;
  var sql = "delete from yhqx where id = ?"
  db.query(sql,id, (err, data) => {
    if (err) {
      return res.send('错误:' + err.message)
    }
    res.send(data)
    
  })
}),
router.post("/yhqx/likeSearch", (req, res) => {
  const likeName = req.body.data.myName;
  const page_num = req.body.data.pagenum //当前的num
  const page_size = req.body.data.pagesize //当前页的数量
  var sql = "select * from yhqx where name like ? limit ?,?"
  const params = ['%'+likeName+'%',(parseInt(page_num) - 1) * parseInt(page_size), parseInt(page_size)]
  db.query(sql,params, (err, data) => {
    if (err) {
      return res.send('错误:' + err.message)
    }
    res.send(data)
    
  })
}),
router.post("/xslb", (req, res) => {
  const page_num = req.body.data.pagenum //当前的num
  const page_size = req.body.data.pagesize //当前页的数量
  var sql = "select * from student limit ?,?"
  const params = [(parseInt(page_num) - 1) * parseInt(page_size), parseInt(page_size)]
  db.query(sql,params, (err, data) => {
    if (err) {
      return res.send('错误:' + err.message)
    }
    res.send(data)
    
  })
}),
router.get("/xslbAll", (req, res) => {
  var sql = "select * from student"
  // const params = [(parseInt(page_num) - 1) * parseInt(page_size), parseInt(page_size)]
  db.query(sql, (err, data) => {
    if (err) {
      return res.send('错误:' + err.message)
    }
    res.send(data)
    
  })
}),
router.post('/xslb/edit', (req, res) => {
  // var sql = 'update user set campus = ?, class = ?, phone = ?, dom = ?, dom_number = ?, new_password = ? where id=1'
  const tel = req.body.data.tel;
  const campus = req.body.data.campus;
  const classs = req.body.data.class;
  const lynumber = req.body.data.lynumber;
  const dom = req.body.data.dom;
  const fdy = req.body.data.fdy;
  const fdytel = req.body.data.fdytel;
  const family = req.body.data.family;
  const familytel = req.body.data.familytel;
  const id = req.body.data.id;
  var sql = 'update student set tel = ?, campus = ?, class = ?, lynumber = ?, dom = ?, fdy = ?,fdytel = ?,family = ?,familytel = ? where id = ? ';
  const sqlall = [tel, campus, classs, lynumber, dom, fdy, fdytel, family, familytel, id];
  db.query(sql, sqlall,(err, data) => {
    if (err) {
      return res.send(err)
    }
    res.send(data)
  })
}),
router.post("/xslb/add", (req, res) => {
  const name = req.body.data.name;
  const uname = req.body.data.uname;
  const sex = req.body.data.sex;
  const tel = req.body.data.tel;
  const dom = req.body.data.dom;
  const campus = req.body.data.campus;
  const lynumber = req.body.data.lynumber;
  const classss = req.body.data.class;
  const fdy = req.body.data.fdy;
  const fdytel = req.body.data.fdytel;
  const family = req.body.data.family;
  const familytel = req.body.data.familytel;
  const data = [name,uname,sex, tel,campus,classss,lynumber,dom,fdy,fdytel,family,familytel];
  var sql = "insert into student (name, uname, sex, tel, campus, class, lynumber, dom, fdy, fdytel, family,familytel ) values(?,?,?,?,?,?,?,?,?,?,?,?)"
  db.query(sql,data,(err, data) => {
    if (err) {
      return res.send(err)
    }
    res.send(data)
  })
}),
router.post("/xslb/del", (req, res) => {
  const id = req.body.data.id;
  var sql = "delete from student where id = ?"
  db.query(sql,id, (err, data) => {
    if (err) {
      return res.send('错误:' + err.message)
    }
    res.send(data)
    
  })
}),
router.post("/xslb/search", (req, res) => {
  const uname = req.body.data.uname;
  const name = req.body.data.name;
  const dom = req.body.data.dom;
  const campus = req.body.data.campus;
  const lynumber =req.body.data.lynumber
  const page_num = req.body.data.pagenum //当前的num
  const page_size = req.body.data.pagesize //当前页的数量
  var sql = "select * from student where name like ? && uname like ? && dom like ? && campus like ?&&lynumber like ? limit ?,?"
  const params = ['%'+name+'%','%'+uname+'%','%'+dom+'%','%'+campus+'%','%'+lynumber+'%',(parseInt(page_num) - 1) * parseInt(page_size), parseInt(page_size)]
  db.query(sql,params, (err, data) => {
    if (err) {
      return res.send('错误:' + err.message)
    }
    res.send(data)
    
  })
}),
router.post("/shbx/add", (req, res) => {
  const name = req.body.data.name;
  const tel = req.body.data.tel;
  const lyNumber = req.body.data.lyNumber;
  const sushe = req.body.data.sushe;
  const date = req.body.data.data;
  const time = req.body.data.time;
  const detail = req.body.data.detail;
  const data = [name, tel, lyNumber, sushe, date, time,detail];
  var sql = "insert into bxlb (name,tel,lynumber,dom,date,time,content) values(?,?,?,?,?,?,?)"
  db.query(sql,data,(err, data) => {
    if (err) {
      return res.send('error')
    }
    res.send(data)
  })
}),
router.post("/shbx/search", (req, res) => {
  const page_num = req.body.data.pagenum //当前的num
  const page_size = req.body.data.pagesize //当前页的数量
  const params = [(parseInt(page_num) - 1) * parseInt(page_size), parseInt(page_size)]
    var sql = "select * from bxlb limit ?,?"
    db.query(sql, params,(err, data) => {
      if (err) {
        return res.send('错误:' + err.message)
      }
      res.send(data)
    })
}),
  
router.get("/shbx/searchAll", (req, res) => {
  // const page_num = req.body.data.pagenum //当前的num
  // const page_size = req.body.data.pagesize //当前页的数量
  // const params = [(parseInt(page_num) - 1) * parseInt(page_size), parseInt(page_size)]
    var sql = "select * from bxlb"
    db.query(sql,(err, data) => {
      if (err) {
        return res.send('错误:' + err.message)
      }
      res.send(data)
    })
}),
router.post("/shbx/del", (req, res) => {
  const id = req.body.data.id;
  var sql = "delete from bxlb where id = ?"
  db.query(sql,id, (err, data) => {
    if (err) {
      return res.send('错误:' + err.message)
    }
    res.send(data)
    
  })
}),
router.post("/dfcx/search", (req, res) => {
  var lyNumber = req.body.data.lyNumber;
  var sushe = req.body.data.sushe;
  var sql = "select * from money where lynumber = ?&&dom=?"
  var sqlall = [lyNumber, sushe];
  db.query(sql,sqlall,(err, data) => {
    if (err) {
      return res.send('错误:' + err.message)
    }
    res.send(data)
  })
}),
router.post("/ykt/search", (req, res) => {
  var stu_number = req.body.data.studentNumber;
  var password = req.body.data.pass;
  var sql = "select * from yikatong where stu_number = ?&&password=?"
  var sqlall = [stu_number, password];
  db.query(sql,sqlall,(err, data) => {
    if (err) {
      return res.send('错误:' + err.message)
    }
    res.send(data)
  })
}),
router.post("/sspf", (req, res) => {
  // const query = req.body.queryInfo.query;
  const pagenum = req.body.data.pagenum;
  const pagesize = req.body.data.pagesize;
  const params = [(parseInt(pagenum) - 1) * parseInt(pagesize), parseInt(pagesize)]
  var sql = "select * from sspf limit ?,?";
  db.query(sql, params, (err, data) => {
    if (err) {
      return res.send('错误1:' + err.message)
    }
    res.send(data);
    // req.send(data.ws);
  });
}),
router.get("/sspf/searchAll", (req, res) => {
  // const page_num = req.body.data.pagenum //当前的num
  // const page_size = req.body.data.pagesize //当前页的数量
  // const params = [(parseInt(page_num) - 1) * parseInt(page_size), parseInt(page_size)]
    var sql = "select * from sspf"
    db.query(sql,(err, data) => {
      if (err) {
        return res.send('错误:' + err.message)
      }
      res.send(data)
    })
}),
router.post("/sspf/search", (req, res) => {
  var lynumber = req.body.data.lynumber;
  var sushe = req.body.data.sushe;
  var xueyuan = req.body.data.xueyuan;
  var banji = req.body.data.banji;
  const page_num = req.body.data.pagenum //当前的num
  const page_size = req.body.data.pagesize //当前页的数量
  var sql = "select * from sspf where lynumber like ? && dom like ? && campus like ? && class like ? limit ?,?"
  var sqlall = ['%'+lynumber+'%', '%'+sushe+'%','%'+xueyuan+'%','%'+banji+'%',(parseInt(page_num) - 1) * parseInt(page_size), parseInt(page_size)];
  db.query(sql,sqlall,(err, data) => {
    if (err) {
      return res.send('错误:' + err.message)
    }
    res.send(data)
  })
}),
router.post("/lgdf/search", (req, res) => {
  var lynumber = req.body.data.lynumber;
  var sushe = req.body.data.sushe;
  const page_num = req.body.data.pagenum //当前的num
  const page_size = req.body.data.pagesize //当前页的数量
  var sql = "select * from sspf where lynumber like ? && dom like ? limit ?,?"
  var sqlall = ['%'+lynumber+'%', '%'+sushe+'%',(parseInt(page_num) - 1) * parseInt(page_size), parseInt(page_size)];
  db.query(sql,sqlall,(err, data) => {
    if (err) {
      return res.send('错误:' + err.message)
    }
    res.send(data)
  })
}),
router.get("/sspf/ly", (req, res) => {
  // const page_num = req.body.data.pagenum //当前的num
  // const page_size = req.body.data.pagesize //当前页的数量
  // const params = [(parseInt(page_num) - 1) * parseInt(page_size), parseInt(page_size)]
    var sql = "select lynumber from lygl"
    db.query(sql,(err, data) => {
      if (err) {
        return res.send('错误:' + err.message)
      }
      res.send(data)
    })
}),
router.post('/lgdf/add', (req, res) => {
  // var sql = 'update user set campus = ?, class = ?, phone = ?, dom = ?, dom_number = ?, new_password = ? where id=1'
  var time = req.body.data.time;
  var ws = req.body.data.ws;
  var jl = req.body.data.jl;
  var wh = req.body.data.wh;
  var lynumber = req.body.data.lynumber;
  var dom = req.body.data.dom;
  var zf = req.body.data.zf;
  var sql = 'update lgdf set time = ?, ws = ?, jl = ?, wh = ? ,zf = ? where lynumber = ?&& dom = ?';
  const sqlall = [time, ws,jl, wh,zf,lynumber,dom];
  db.query(sql, sqlall,(err, data) => {
    if (err) {
      return res.send(err)
    }
    res.send(data)
  })
}),
router.post("/lygl/search", (req, res) => {
  var lynumber = req.body.data.lynumber;
  const page_num = req.body.data.pagenum //当前的num
  const page_size = req.body.data.pagesize //当前页的数量
  var sql = "select * from lygl where lynumber like ? limit ?,?"
  var sqlall = ['%'+lynumber+'%',(parseInt(page_num) - 1) * parseInt(page_size), parseInt(page_size)];
  db.query(sql,sqlall,(err, data) => {
    if (err) {
      return res.send('错误:' + err.message)
    }
    res.send(data)
  })
}),
router.post("/newly/add", (req, res) => {
  const tel = req.body.data.tel;
  const lyNumber = req.body.data.lynumber;
  const leader = req.body.data.leader;
  const sex = req.body.data.sex;
  const data = [lyNumber, leader, sex, tel];
  var sql = "insert into lygl (lynumber,leader,sex,tel) values(?,?,?,?)"
  db.query(sql,data,(err, data) => {
    if (err) {
      return res.send('error')
    }
    res.send(data)
  })
}),
router.post("/domList/add", (req, res) => {
  const sushe = req.body.data.sushe;
  const ssz = req.body.data.ssz;
  const data = [sushe, ssz];
  var sql = "insert into ssgl (sushe,ssz) values(?,?)"
  db.query(sql,data,(err, data) => {
    if (err) {
      return res.send('error')
    }
    res.send(data)
  })
}),
router.post("/domList/update", (req, res) => {
  const sushe = req.body.data.sushe;
  const number = req.body.data.number;
  const data = [number,sushe];
  var sql = "update ssgl set number = ? where sushe = ?"
  db.query(sql,data,(err, data) => {
    if (err) {
      return res.send('error')
    }
    res.send(data)
  })
}),
router.post("/domList/del", (req, res) => {
  const id = req.body.data.id;
  var sql = "delete from ssgl where id = ?"
  db.query(sql,id, (err, data) => {
    if (err) {
      return res.send('错误:' + err.message)
    }
    res.send(data)
    
  })
}),
router.post("/dormList/search", (req, res) => {
  var lynumber = req.body.data.sushe;
  const page_num = req.body.data.pagenum //当前的num
  const page_size = req.body.data.pagesize //当前页的数量
  var sql = "select * from ssgl where sushe like ? limit ?,?"
  var sqlall = ['%'+lynumber+'%',(parseInt(page_num) - 1) * parseInt(page_size), parseInt(page_size)];
  db.query(sql,sqlall,(err, data) => {
    if (err) {
      return res.send('error')
    }
    res.send(data)
  })
}),
module.exports = router