const AuthenticationController = require('../controllers/AuthenticationController')
const AuthenticationControllerPolicy = require('../policies/AuthenticationControllerPolicy')
const GameController = require('../game/GameController')
module.exports = (app, io, state) => {

	app.get('/route', (req, res) => res.send('routes'))

	//Sockets

	io.on('connection',(socket) => {
		let id = socket.handshake.query['userId']
		state.addClient(id)
		console.log(`userId -  ${id}  - connected`)
		
		socket.on('disconnect', () => {
			console.log(`userId -  ${id}  - disconnected`)
			state.removeClient(id)
		})
		socket.on('newMessage', (msg) => {
			let roomData = state.submitWord(msg)
			//state.printRooms()
			let resObj = {...msg, turn: roomData.counter, users: roomData.users}
			io.emit('newMessage' + msg.roomId, resObj)
		})
		socket.on('challenge', (msg) => {
			let res = state.challenge(msg.userId)
			io.emit('newMessage' + msg.roomId, res)
		})
		socket.on('startGame', (msg) => {
			let {id, roomId, prompt} = msg
			let res = state.startGame(id, roomId, prompt)
			io.emit('newMessage' + msg.roomId, res)
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
		app.get('/returnClients', (req, res) =>{
			let pools = state.getClientPools()
			res.send({pools})
		})
		app.post('/joinRoom',
			(req, res)=>{
				let {user, roomId} = req.body
				room = GameController.joinRoom(req, res, state)
				if(!room){
					console.log(room)
					return
				}
				io.emit('newMessage' + roomId, {users: room.users})

			})
		app.post('/deleteRoom',
			AuthenticationController.matchUserToken,
			(req, res) => {
				let roomId = GameController.deleteRoom(req, res, state)
				io.emit('newMessage' + roomId, {delete: roomId})
			})
		app.post('/checkActiveGame', 
			(req, res) =>{
				room = GameController.checkActiveGame(req, res, state)

			})
}
