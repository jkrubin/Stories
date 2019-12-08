const AuthenticationController = require('../controllers/AuthenticationController')
const AuthenticationControllerPolicy = require('../policies/AuthenticationControllerPolicy')
const GameController = require('../game/GameController')
module.exports = (app, io, state) => {

	app.get('/route', (req, res) => res.send('routes'))

	//Sockets

	io.on('connection',(socket) => {
		console.log({socket})
		socket.on('disconnect', () => {console.log('disconnect')})
		socket.on('newMessage', (msg) => {
			console.log(msg)
			io.emit('newMessage' + msg.roomId, msg)
		})
		socket.on('joinRoom', (req) =>{
			GameController.joinRoom(req)
		})
	})

	//Users edpoint
		//Register User
		app.post('/register',
			AuthenticationControllerPolicy.register,
			AuthenticationController.register)
		//Login User
		app.post('/login',
			AuthenticationController.login)
		//Update User
		app.post('/updateUser',
			AuthenticationController.matchUserToken,
			AuthenticationController.updateUser)
		app.post('/resetPassword',
			AuthenticationController.resetPassword)
		app.post('/createNewPassword',
			AuthenticationController.createNewPassword)
		app.post('/requestEmailVerification',
			AuthenticationController.requestEmailVerification)
		app.get('/verifyEmail/:token',
			AuthenticationController.verifyEmail)

	//rooms
		app.post('/newRoom',
			AuthenticationController.matchUserToken,
			(req, res) => GameController.createRoom(req, res, state) )
		app.get('/returnRooms', (req, res) => {
			let rooms = state.getRooms()
			res.send({rooms})
		})
		app.post('/joinRoom',
			(req, res)=>{
				let {user, roomId} = req.body
				room = GameController.joinRoom(req, res, state)
				io.emit('newMessage' + roomId, {users: room.users})

			})
}
