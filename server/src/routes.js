const AuthenticationController = require('../controllers/AuthenticationController')
const AuthenticationControllerPolicy = require('../policies/AuthenticationControllerPolicy')
module.exports = (app, io) => {

	app.get('/route', (req, res) => res.send('routes'))

	//Sockets

	io.on('connection',(socket) => {
		console.log('connection')
		socket.on('disconnect', () => {console.log('disconnect')})
		socket.on('newMessage', (msg) => {
			console.log(msg)
			io.emit('newMessage' + msg.eventId, msg)
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
}