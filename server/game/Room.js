class Room{
	constructor(id, user, roomData){
		this.roomId = id
		this.words = []
		this.users = [user]
		this.name = roomData.name

		this.counter = 0
	}
	addUser(user){
		this.users.push(user)
	}
	removeUser(id){
		let newUsers = this.users.filter((user) => {
			return (roomId != user.id)
		})
		this.users = newUsers
	}

	pushWord(words){
		this.words.push(words)
		return this.words
	}
	getCounter(){
		return this.counter
	}
	incrementCounter(){
		return this.counter = (this.counter + 1) % this.users.length 
	}
}

module.exports = {
	Room
}
