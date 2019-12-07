let Room = require('./Room.js')

class Gamestate{
	constructor(){
		this.rooms = {}
	}

	createRoom(id){
		this.rooms[id] = new Room(id)
	}

	printRooms(){
		let roomArr = this.rooms
		console.log({roomArr})
	}
}

module.exports = {
	Gamestate
}