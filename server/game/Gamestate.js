let Room = require('./Room.js').Room

class Gamestate{
	constructor(){
		this.rooms = {}
		this.clientRoomMap= {}
		this.clientPool = {}
		this.seedList = ["blue","spy",]
	}

	addClient(id){
		let room = this.clientRoomMap[id]
		if(room && this.rooms[room]){
			//client is reconnecting to active room
			this.clientPool[id] = room
			this.rooms[room].connect(id)
		}else{
			//client is not in any rooms
			this.clientPool[id] = false
		}
	}
	removeClient(id){
		delete this.clientPool[id]
		let room = this.clientRoomMap[id]
		if(room && this.rooms[room]){
			this.rooms[room].disconnect(id)
		}
	}
	async startGame(id, roomId, prompt, seed){
		return new Promise((resolve, reject) => {
			if(id !== roomId){
				resolve({error: {message: "you do not own this room"}})
			}
			if(this.isRoomExists(id)){
				this.rooms[id].setPrompt(prompt)
				if(seed == undefined){
					seed = 
				}
				this.rooms[id].createBanks('jja', seed)
					.then((data) => {
						console.log({...data})
						resolve ({...data})
					})
			}else{
				resolve({error: {userId: id, message: "you do not own this room"}})
			}
		})
	}
	clientCheck(id){
		let room = this.clientPool[id]
		if(room){
			return this.rooms[room]
		}
		room = this.clientRoomMap[id]
		if(room){
			return this.rooms[room]
		}
		return false
	}
	createRoom(id, user, roomData){
		if(!id){
			return -1
		}
		if(this.isRoomExists(id)){
			return this.rooms[id]
		}
		if(this.rooms[id] = new Room(id, user, roomData)){
			//Set active and total client pool to room id
			this.clientPool[id] = id
			this.clientRoomMap[id] = id
			setTimeout(() =>{
				this.removeRoom(id)
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
			return id
		}
		return false

	}
	connectUserToRoom(user, roomId){
		if(this.clientRoomMap[user.id] == roomId){
			if(this.clientPool[user.id]){
				this.clientPool[user.id] = roomId
			}
			return this.rooms[roomId]
		}
		if(this.isRoomExists(roomId)){
			this.rooms[roomId].addUser(user)
			this.clientPool[user.id] = roomId
			this.clientRoomMap[user.id] = roomId
			console.log(this.rooms[roomId])
			return this.rooms[roomId]
		}
		return -1
	}
	submitWord(msg){
		let id = msg.roomId
		if(this.rooms[id]){
			let roomData = this.rooms[id].pushWord(msg)
			console.log(roomData)
			return roomData
		}
		return false
	}
	challenge(userId){
		let room = this.clientCheck(userId)
		if(room){
			return room.challenge(userId)
		}
		return false
	}
	printRooms(){
		let roomArr = this.rooms
		console.log(`printing ${roomArr.length} rooms`)
		console.log(JSON.stringify(roomArr, null, 4))
		return true
	}
	getRooms(){
		return this.rooms
	}
	getClientPools(){
		return ({clientPool: this.clientPool, ClientRoomMap: this.clientRoomMap})
	}
}

module.exports = {
	Gamestate
}
