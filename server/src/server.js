const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const morgan = require('morgan')
const {sequelize} = require('../models')

const app = express()
app.use(morgan('combined'))
app.use(bodyParser.json())
app.use(cors())


let http = require('http').Server(app)
var io = require('socket.io')(http)

require('./routes')(app, io)
app.get('/', (req, res) => res.send('Hello World!'))

sequelize
  .authenticate()
  .then(() => {
    console.log('Connection has been established successfully.');
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });

sequelize.sync()
	.then(() => {
		http.listen(8082, () => console.log('API with sockets listening on port 8082!'))
	})  
