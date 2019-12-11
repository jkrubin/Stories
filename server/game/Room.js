class Room{
	constructor(id, user, roomData){
		let bankUser = this.addUserWords(user)
		this.roomId = id
		this.words = []
		this.users = [bankUser]
		this.name = roomData.name
		this.counter = 0
	}
	addUser(user){
		let bankUser = this.addUserWords(user)
		this.users.push(bankUser)
	}
	addUserWords(user){
		user.bank = {snow: false, tree: false}
		user.score = 0
		return user
	}
	removeUser(id){
		let newUsers = this.users.filter((user) => {
			return (roomId != user.id)
		})
		this.users = newUsers
	}

	pushWord(msg){
		let pre = this.words
		let userIndex = false
		for(let i = 0; i < this.users.length; i++){
			if(msg.userId === this.users[i].id){
				userIndex = i
			}
		}
		console.log({userIndex})
		let msgArr = msg.message.split(" ")
		console.log(msgArr)
		for(let i = 0; i < msgArr.length; i++){
			console.log({inp: msgArr[i]})
			console.log(this.users[userIndex].bank)
			if(msgArr[i] in this.users[userIndex].bank){
				if(!this.users[userIndex].bank[msgArr[i]]){
					this.users[userIndex].bank[msgArr[i]] = true
					this.users[userIndex].score++
				}	
				msgArr[i] = {score: true, message: msgArr[i]}
			}else{
				msgArr[i] = {score: false, message: msgArr[i]}
			}
		}
		msg.msgArr = msgArr
		this.words.push(msg)
		this.incrementCounter()
		return this
	}
	getCounter(){
		return this.counter
	}
	incrementCounter(){
		this.counter = (this.counter + 1) % this.users.length 
		return this.counter
	}
}

module.exports = {
	Room
}
