class Room{
	constructor(id, user, roomData){
		let bankUser = this.addUserWords(user)
		bankUser.life = 3
		this.roomId = id
		this.words = []
		this.users = [bankUser]
		this.name = roomData.name
		this.counter = 0
	}
	addUser(user){
		let bankUser = this.addUserWords(user)
		bankUser.life = 3
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
	challenge(userId){
		let lastPlayed = this.words[this.words.length - 1]
		let userInd = false
		for(let i = 0; i < this.users.length; i++){
			if(this.users[i].id === userId){
				userInd = i
			}
		}
		if(userInd === false){
			return {error:{userId, message:"user not found"}}
		}
		if(this.users[userInd].life === 0){
			return {error: {userId, message:"you cannot challenge any more"}}
		}
		if(lastPlayed.userId === userId){
			return {error: {userId, message:"Cannot challenge your own word"}}
		}
		if(lastPlayed.challenge === true){
			return {error: {userId, message:"This has already been challenged"}}
		}
		if(lastPlayed.score > 0){ //Challenge won
			lastPlayed.challenge = true
			return {challenge:{state: true, userId}, words: this.words, users:this.users}
		}else{ //Challenge lost
			this.users[userInd].life--
			return {challenge:{state: false, userId}, users:this.users}

		}

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
		let score = 0
		console.log(msgArr)
		for(let i = 0; i < msgArr.length; i++){
			console.log({inp: msgArr[i]})
			console.log(this.users[userIndex].bank)
			if(msgArr[i] in this.users[userIndex].bank){
				if(!this.users[userIndex].bank[msgArr[i]]){
					this.users[userIndex].bank[msgArr[i]] = true
					// this.users[userIndex].score++
					score++
				}	
				msgArr[i] = {score: true, message: msgArr[i]}
			}else{
				msgArr[i] = {score: false, message: msgArr[i]}
			}
		}
		msg.challenge = false
		msg.score = score
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
