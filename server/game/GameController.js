module.exports = {
	createRoom(req, res, state){
		let room = state.createRoom(req.body.id)
		if(room){
			return res.send({room})
		}
		return res.status(500).send({error: "could not create room"})
	},
	joinRoom(req, res, state){
		let {user, roomId} = req.body
		let room = state.connectUserToRoom(user, roomId)
		if(room =! -1){
			return res.send({room})
		}
		return res.status(500).send({error: "could not join room"})
	}
}
