class Room{
	constructor(id, user, roomData){
		this.id = id
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
			return (id != user.id)
		})
		this.users = newUsers
	}

	addWords(words){
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
