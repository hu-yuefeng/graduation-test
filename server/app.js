let express = require('express')
let app = express()
let cors = require('cors')
let bodyParser = require('body-parser')
let user = require('./API/user')
let selectUser = require('./API/selectUser')
let updateUser = require('./API/user')
let Newly = require('./API/user')
let newlyAll = require('./API/user')
let newlyShow = require('./API/selectUser')

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors())
app.use(user)
app.use(selectUser)
app.use(updateUser)
app.use(Newly)
app.use(newlyAll)
app.use(newlyShow)

app.listen(80, () => {
  console.log('服务器启动成功');
})