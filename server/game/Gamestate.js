let Room = require('./Room.js').Room

class Gamestate{
	constructor(){
		this.rooms = {}
	}

	createRoom(id){
		if(!id){
			return -1
		}
		if(isRoomExists(id)){
			return -1
		}
		if(this.rooms[id] = new Room(id)){
			return this.rooms[id]
		}
		return false
	}
	isRoomExists(id){
		return(this.rooms[id] == true)
	}
	removeRoom(id){
		if(delete this.rooms[id]){
			return true
		}
		return false

	}
	connectUserToRoom(user, roomId){
		if(isRoomExists(roomId)){
			this.rooms[roomId].addUser(user)
			return this.rooms[roomId]
		}
		return -1
	}

	printRooms(){
		let roomArr = this.rooms
		console.log(`printing ${roomArr.length} rooms`)
		console.log({roomArr})
		return true
	}
	getRooms(){
		return this.rooms
	}
}

module.exports = {
	Gamestate
}
