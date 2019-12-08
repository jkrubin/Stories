let Room = require('./Room.js').Room

class Gamestate{
	constructor(){
		this.rooms = {}
		this.clientRoomMap= {}
		this.clientPool = {}
	}

	addClient(id){
		let room = this.clientRoomMap[id]
		if(room && this.rooms[room]){
			//client is reconnecting to active room
			this.clientPool[id] = room
		}else{
			//client is not in any rooms
			this.clientPool[id] = false
		}
	}
	removeClient(id){
		delete clientPool[id]
	}
	createRoom(id, user){
		if(!id){
			return -1
		}
		if(this.isRoomExists(id)){
			return -1
		}
		if(this.rooms[id] = new Room(id, user)){
			//Set active and total client pool to room id
			this.clientPool[id] = id
			this.clientRoomMap[id] = id
			setTimeout(() =>{
				delete this.rooms[id]
			}, 3600000)
			return this.rooms[id]
		}
		return false
	}
	isRoomExists(id){
		return(this.rooms.hasOwnProperty(id))
	}
	removeRoom(id){
		let userArr = this.rooms[id].users
		for(let i =0; i < userArr.length; i++){
			let userId = userArr[i].id
			delete this.clientRoomMap[userId]
			if(this.clientPool[userId]){
				this.clientPool[userId] = false
			}
		}
		if(delete this.rooms[id]){
			return true
		}
		return false

	}
	connectUserToRoom(user, roomId){
		if(this.isRoomExists(roomId)){
			this.rooms[roomId].addUser(user)
			this.clientPool[user.id] = roomId
			this.clientRoomMap[user.id] = roomId
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
	getClientPools(){
		return ({clientPool, clientRoomMap})
	}
}

module.exports = {
	Gamestate
}
