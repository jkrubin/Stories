let Room = require('./Room.js')

class Gamestate{
	constructor(){
		this.rooms = {}
	}

	createRoom(id){
		this.rooms[id] = new Room(id)
	}

	printRooms(){
		console.log({this.rooms})
	}
}

module.exports = {
	Gamestate
}