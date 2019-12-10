module.exports = {
	createRoom(req, res, state){
		let {id, user, roomData} = req.body
		let room = state.createRoom(id, user, roomData)
		if(room){
			return res.send({room})
		}
		return res.status(500).send({error: "could not create room"})
	},
	deleteRoom(req, res, state){
		let {id} = req.body
		let result = state.removeRoom(id)
		if(result){
			res.send({delete: result})
			return result
		}
		return res.status(404).send({error: "Room not found"})
		
	},
	joinRoom(req, res, state){
		let {user, roomId, roomData} = req.body
		let room = state.connectUserToRoom(user, roomId, roomData)
		console.log({room})
		if(room != -1){
			res.send({room})
			return room
		}
		return res.status(500).send({error: "could not join room"})
	},
	checkActiveGame(req, res, state){
		let {userId} = req.body
		let activeRoom = clientCheck(userId)
		res.send({activeRoom})
	}
}
