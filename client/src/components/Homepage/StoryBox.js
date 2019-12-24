import React from "react"
import openSocket from 'socket.io-client'
import { AuthContext } from "../../Auth/AuthContext"
import { api } from "../../config/config"
import UserDisplay from "./UserDisplay"
import WordBank from "./WordBank"
import RoomsDisplay from "./RoomsDisplay"
import './style.css'

class StoryBox extends React.Component{
	constructor(props, context){
		super(props, context)

		this.state = {
			input: '',
			promptInput: '',
			nameInput: '',
			turn:0,
			prompt: false,
			roomId: -1,
			words: [],
			users: [],
			colors: ["rgba(52, 64, 235, .5)", "rgba(235, 62, 56, .5)", "rgba(235, 154, 56, .5)", "rgba(235, 235, 56, .5)", "rgba(25, 145, 16, .5)", "rgba(68, 194, 164, .5)", "rgba(163, 74, 212, .5)"],
			showRooms: false,
			challenge: false,
			availableRooms: [],
			bottomPanel: false,
		}
		//Dom manipulation
		this.handleChange = this.handleChange.bind(this)
		this.toggleRoomsMenu = this.toggleRoomsMenu.bind(this)
		this.toggleBottomPanel = this.toggleBottomPanel.bind(this)

		//Fetch		
		this.createRoom = this.createRoom.bind(this)
		this.getRooms = this.getRooms.bind(this)
		this.joinRoom = this.joinRoom.bind(this)
		this.deleteRoom = this.deleteRoom.bind(this)

		//Socket funcs
		this.handleSubmit = this.handleSubmit.bind(this)
		this.handleChallenge = this.handleChallenge.bind(this)
		this.socket = openSocket(api, {query: `userId=${context.auth.user.id}`})
		this.socketListen = this.socketListen.bind(this)
		this.handleSocket = this.handleSocket.bind(this)
		this.startGame = this.startGame.bind(this)

	}

	componentWillUnmount(){
		this.socket.disconnect()
	}
	handleChange(event){
		let {name, value} = event.target
		this.setState({[name]:value})
	}
	handleSubmit(){
		let message = {
			userId: this.context.auth.user.id, 
			roomId: this.state.roomId,
			message: this.state.input,
		}
		console.log({sent: message})
		this.socket.emit('newMessage', message)
		this.setState({input: ''})
	}
	handleChallenge(){
		let message = {
			userId: this.context.auth.user.id, 
			roomId: this.state.roomId,
		}
		this.socket.emit('challenge', message)
	}
	createRoom(){
		let data = {
			id: this.context.auth.user.id,
			user: {
				id: this.context.auth.user.id,
				name: this.context.auth.user.name
			},
			roomData:{
				name: this.state.nameInput
			}
		}
		fetch(api + '/newRoom', {
			method: "POST",
			headers:{
				"Content-Type": "application/json",
				"x-access-token": this.context.auth.token
			},
			body: JSON.stringify(data)
		})
		.then(res => res.json())
		.then((data) => {
			if(data.error){
				console.log(data.error)
			}else{
				console.log({data})
				let room
				if(room = data.room){
					this.setState({...room})
					this.socketListen(room.roomId)
				}
			}
		})
		.catch((error) => {
			console.log(error)
		})
	}
	deleteRoom(){
		let roomId = this.context.auth.user.id
		let data = {
			id: roomId,
		}
		fetch(api + '/deleteRoom', {
			method: "POST",
			headers:{
				"Content-Type": "application/json",
				"x-access-token": this.context.auth.token
			},
			body: JSON.stringify(data)
		})
		.then(res => res.json())
		.then((data) => {
			if(data.error){
				console.log(data.error)
			}else{
				this.setState({roomId: -1})
			}
		})
		.catch((error) => {
			console.log(error)
		})		
	}
	getRooms(){
		fetch(api + '/returnRooms', {
			method: "GET",
			headers:{
				"Content-Type": "application/json"
			}
		}).then(res => res.json())
		.then((data) => {
			if(data.error){
				console.log(data.error)
			}else{
				let openRooms = []
				for(var key in data.rooms){
					let room = data.rooms[key]
					openRooms.push({
						roomId: room.roomId,
						users: room.users,
						name: room.name
					})
				}
				this.setState({availableRooms: openRooms})
			}
		}).catch((error) => {
			console.log(error)
		})
	}
	joinRoom(id){
		if(!this.context.isAuth){
			return false
		}
		let data = {
			roomId: id,
			user: {
				id: this.context.auth.user.id,
				name: this.context.auth.user.name
			}
		}
		fetch(api + '/joinRoom',{
			method:"POST",
			headers:{
				"Content-Type": "application/json"
			},
			body: JSON.stringify(data)
		}).then(res => res.json())
		.then((data) => {
			if(data.error){
				console.log(data.error)
			}else{
				console.log(data)
				let room
				if(room = data.room){
					console.log({room})
					this.setState({...room})
					this.socketListen(room.roomId)
				}
			}
		})
	}
	startGame(prompt){
		let message = {
			id: this.context.auth.user.id, 
			roomId: this.state.roomId,
			prompt: this.state.promptInput,
		}
		this.socket.emit('startGame', message)
		this.setState({promptInput: ''})		
	}
	toggleRoomsMenu(){
		this.setState((prevState)=>{
			return({showRooms: !prevState.showRooms}) 
		})
	}
	toggleBottomPanel(panel){
		this.setState((prevState)=>{
			if(prevState.bottomPanel === panel){
				return {bottomPanel: false}
			}else{
				return {bottomPanel: panel}
			}
		})
	}
	socketListen(room){
		this.socket.on('newMessage' + room, (msg) => {
			console.log({msg})
			this.handleSocket(msg)
		})
	}
	handleSocket(msg){
		console.log({msg})
		if(msg.users){
			this.setState({users: msg.users})
		}
		if(msg.message){
			this.setState((prevState)=>{
				let newWords = prevState.words
				let {message, userId, msgArr, challenge, score} = msg
				newWords.push({message, userId, msgArr, challenge, score})
				return {words: newWords}
			})
		}
		if('turn' in msg){
			this.setState({turn: msg.turn})
		}
		if('prompt' in msg){
			this.setState({prompt: msg.prompt})
		}
		if('words' in msg){
			this.setState({words: msg.words})
		}
		if(msg.challenge){
			console.log(msg.challenge)
			alert(`User ${msg.challenge.userId} challenged and ${msg.challenge.state}`)
		}
		if('error' in msg){
			if('userId' in msg.error){
				if(this.context.auth.user.id === msg.error.userId){
					alert(msg.error.message)
				}
			}else{
				alert(msg.error.message)
			}
		}
		if(msg.delete){
			this.setState({roomId: -1, users: [], words: []})
			this.socket.off('newMessage' + msg.delete)
		}
	}
	render(){
		let userInd = false
		for(let i = 0; i < this.state.users.length; i++){
			if(this.context.auth.user.id === this.state.users[i].id){
				userInd = i
			}
		}
		let storyDisplay
		if(this.state.turn === -1){
			storyDisplay = (<div> Waiting for prompt...</div>)
		}else{
			storyDisplay = this.state.words.map((msg, index) => {
				let userInd = 0
				for(let i = 0; i < this.state.users.length; i++){
					if(this.state.users[i].id === msg.userId){
						userInd = i
					}
				}
				const message = msg.msgArr.map((word) =>{
					if(word.score && (index !== this.state.words.length - 1)){
						return (<span className='scored' style={{backgroundColor: this.state.colors[userInd]}}>{word.message.concat(' ')} </span>)
					}
					return (word.message.concat(' '))
				})
				return (<span style={{backgroundColor: this.state.colors[userInd]}} key={index}>{message} </span>)
			})
		}
		let myScore = 0
		let usersDisplay = this.state.users.map((user, index)=>{
			if(this.state.turn === index){
				myScore = user.score
			}
			return (<UserDisplay user={user} index={index} active={(this.state.turn === index)} key={user.id} />)
		})
		let panelDisplay = ''
		switch(this.state.bottomPanel){
			case 1:
				panelDisplay = (
					<div className="rooms-list-container">
						<button className="button" onClick={this.getRooms}> Update rooms list </button>
						<RoomsDisplay 
							rooms={this.state.availableRooms} 
							roomId = {this.state.roomId} 
							joinRoom = {this.joinRoom}
							deleteRoom = {this.deleteRoom}
							userId = {this.context.auth.user.id}
						/> 
					</div>
				)
				break
			case 2:
				panelDisplay = <WordBank bank = {this.state.users[userInd].bank} />
				break
			default:
				panelDisplay = (<div> no display </div>)
		}
		let lastPlayed = this.state.words.slice(-1)[0]
		if(lastPlayed){
			lastPlayed = lastPlayed.message
		}
		let isMyTurn = false
		if(this.state.roomId > 0 && (this.state.turn >= 0)){
			isMyTurn = this.state.users[this.state.turn].id === this.context.auth.user.id
		}
		return(
			<div className = "story-box">
				{this.state.roomId === -1 ?
					<div className = "createRoom">
						<h1>Create a Room!</h1>
						<div>
							<input
							type="text"
							className="form"
							value = {this.state.nameInput}
							name="nameInput"
							onChange = {this.handleChange}
							placeholder = "room name" />

							<button className="button" onClick={this.createRoom}> Create Room! </button>
						</div>
						<h2> Or open the panel to find a lobby to enter </h2>
					</div>
					:
					<div className="room-container">
						<div className="room-header title-header">
							<h1>Current Room: {this.state.name}</h1>
						</div>
						<div className = "user-container">
							<div className = "user-pre">
								You are playing with:
							</div>
							{usersDisplay}
						</div>
						<div className="toolbar">
							<div className="prompt toolbar-item">
								<p>Prompt: {this.state.prompt} </p>
							</div>
							<div className="toolbar-item score">
								<p>Score</p>
								<h1> {myScore} </h1>
							</div>
							<div className="toolbar-item review">
								<p> last played: </p>
								<p> {lastPlayed} </p>
							</div>
							<div className="toolbar-item challenge-container">
								<div className="challenge-button" onClick={this.handleChallenge}>
									<p> challenge</p>
								</div>
							</div>
						</div>
						<div className="story-display">
							{storyDisplay}
						</div>
						<div className="input-display">
							{((this.state.turn === -1) && (this.state.roomId === this.context.auth.user.id)) ? 
								<div>
									<div className="form-group">
										<input 
										type="text"
										className="form"
										value={this.state.promptInput}
										name="promptInput" 
										onChange = {this.handleChange}
										placeholder = "Create Prompt"/>
									</div>
									<div className="form-submit">
										<button className="button-submit" onClick={this.startGame}>Start Game with prompt</button>
									</div>		
								</div>						
								:
								<div>
									<div className="form-group">
										<input 
										type="text"
										className="form"
										value={this.state.input}
										name="input" 
										onChange = {this.handleChange} 
										disabled = {!isMyTurn}/>
									</div>
									<div className="form-submit">
										<button className="button-submit" onClick={this.handleSubmit} disabled = {!isMyTurn}>Submit</button>
									</div>
								</div>
							}
						</div>
					</div>
				}
				<div className = "bottom-container">
					<div className = "bottom-bar">
						<button className="button" onClick= {()=>{this.toggleBottomPanel(1)}}> Rooms </button>
						<button className="button" onClick= {()=>{this.toggleBottomPanel(2)}} disabled = {!(this.state.roomId > 0)}> Word Bank </button>
					</div>
					<div className = "bottom-panel" style = {{maxHeight: (this.state.bottomPanel? "300px" : "0px")}}>
						<div className="panel-content"> {panelDisplay} </div>
					</div>
				</div>
			</div>
		)
	}
}

StoryBox.contextType = AuthContext
export default StoryBox
