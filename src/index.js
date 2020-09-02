const express = require('express')
const app = express()
app.use('/', express.static('web'))
app.listen(3000, '192.168.1.101')