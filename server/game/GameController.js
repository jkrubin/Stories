module.exports = {
	createRoom(req, res, state){
		let {id, user} = req.body
		let room = state.createRoom(id, user)
		if(room){
			return res.send({room})
		}
		return res.status(500).send({error: "could not create room"})
	},
	joinRoom(req, res, state){
		let {user, roomId} = req.body
		let room = state.connectUserToRoom(user, roomId)
		if(room != -1){
			res.send({room})
			return room
		}
		return res.status(500).send({error: "could not join room"})
	}
}
