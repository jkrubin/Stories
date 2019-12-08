let Room = require('./Room.js').Room

class Gamestate{
	constructor(){
		this.rooms = {init: "hello"}
	}

	createRoom(id){
		this.rooms[id] = new Room(id)
	}

	printRooms(){
		let roomArr = this.rooms
		console.log(`printing ${roomArr.length} rooms`)
		console.log({roomArr})
	}
	getRooms(){
		return this.rooms
	}
}

module.exports = {
	Gamestate
}
