import React from "react"
import openSocket from 'socket.io-client'
import { AuthContext } from "../../Auth/AuthContext"
import { api } from "../../config/config"
import UserDisplay from "./UserDisplay"
import WordBank from "./WordBank"
import RoomsDisplay from "./RoomsDisplay"
import Alert from "../Alert"
import './style.css'

class StoryBox extends React.Component{
	constructor(props, context){
		super(props, context)

		this.state = {
			alert: false,
			showAlert: false,
			input: '',
			promptInput: '',
			nameInput: '',
			turn:0,
			prompt: false,
			roomId: -1,
			words: [],
			users: [],
			userScroll: 0,
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
		this.toggleAlert = this.toggleAlert.bind(this)

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
	componentDidUpdate(){
		let activeUserElement = document.getElementsByClassName('user-box active')[0]
		if(activeUserElement !== undefined){
			activeUserElement.scrollIntoView()
		}
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
	toggleAlert(state){
		if(state == undefined){
			this.setState((prevState) => {
				return {showAlert: !prevState.showAlert}
			})
		}else{
			this.setState({showAlert: state})
		}
	}
	socketListen(room){
		this.socket.on('newMessage' + room, (msg) => {
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
		if('counter' in msg){
			this.setState({counter: msg.counter}, 
				() => {
					//document.getElementById('user-scroll').scrollLeft = (this.state.counter) * 50
				}
			)			
		}
		if('prompt' in msg){
			this.setState({prompt: msg.prompt})
		}
		if('words' in msg){
			this.setState({words: msg.words})
		}
		if(msg.challenge){
			console.log(msg.challenge)
			let userInd = false
			for(let i = 0; i < this.state.users.length; i++){
				if(this.state.users[i].id === msg.challenge.userId){
					userInd = i
				}
			}
			this.setState({showAlert: true, alert: `${this.state.users[userInd].name} challenged and ${(msg.challenge.state ? "succeeded" : `failed. they have ${msg.users[userInd].life} lives left`)}`})
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

		//Get index for user
		let userInd = false
		for(let i = 0; i < this.state.users.length; i++){
			if(this.context.auth.user.id === this.state.users[i].id){
				userInd = i
			}
		}

		//Create Story Display
		let storyDisplay
		let userScores = {}
		let lastPlayed = false
		for(let i = 0; i < this.state.users.length; i++){
			userScores[this.state.users[i].id] = 0
		}
		if(this.state.turn === -1){
			storyDisplay = (<div> Waiting for prompt...</div>)
		}else{
			storyDisplay = this.state.words.map((msg, index) => {
				//Get the user who posted the message and update their score
				let userMsgInd = 0
				for(let i = 0; i < this.state.users.length; i++){
					if(this.state.users[i].id === msg.userId){
						userMsgInd = i
					}
				}
				if((index !== this.state.words.length - 1) && (msg.challenge !== true)){
					userScores[msg.userId] += msg.score
				}

				//Get each word in message for score highlighting
				const message = msg.msgArr.map((word) =>{
					if(word.score && (index !== this.state.words.length - 1)){

						return (<span className='scored' style={{backgroundColor: this.state.colors[userMsgInd]}}>{word.message.concat(' ')} </span>)
					}
					return (word.message.concat(' '))
				})
				let spanClass = ''
				if(msg.challenge === true){
					spanClass = "challenge-true"
				}
				let disp = (<span style={{backgroundColor: this.state.colors[userMsgInd]}} key={index}>{message} </span>)
				if(index === this.state.words.length - 1){
					lastPlayed = disp
				}
				return disp
			})
		}
		//Users Display
		let myScore = 0
		let usersDisplay = this.state.users.map((user, index)=>{
			let score = userScores[user.id]
			return (<UserDisplay user={user} index={index} active={(this.state.counter === index)} key={user.id} score={score} />)
		})

		//Bottom panel
		let panelDisplay = ''
		switch(this.state.bottomPanel){
			case 1: //DISPLAY ROOMS
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
			case 2: //DISPLAY WORD BANK
				panelDisplay = <WordBank bank = {this.state.users[userInd].bank} />
				break
			default: //NO DISPLAY
				panelDisplay = (<div> no display </div>)
		}

		//Check is my turn?
		let isMyTurn = false
		if(this.state.roomId > 0 && (this.state.counter >= 0)){
			isMyTurn = this.state.users[this.state.counter].id === this.context.auth.user.id
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
						<div className = "user-container" id="user-scroll">
							<div className = "user-pre">
								You are playing with:
							</div>
							{usersDisplay}
						</div>
						<div className="toolbar">
							<div className="prompt toolbar-item">
								<p>Prompt: {this.state.prompt} </p>
							</div>
							<div className="toolbar-item review">
								<p> last played: </p>
								<p> {lastPlayed? lastPlayed : "waiting for play..."} </p>
							</div>
							<div className="toolbar-item challenge-container">
								<div className="challenge-button" onClick={this.handleChallenge}>
									<p> challenge</p>
								</div>
							</div>
						</div>
						<div className="story-display">
							<Alert message={this.state.alert} toggle={this.toggleAlert} show={this.state.showAlert} />
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
										<button className="button-submit button" onClick={this.handleSubmit} disabled = {!isMyTurn}>Submit</button>
									</div>
								</div>
							}
						</div>
					</div>
				}
				<div className = "bottom-container">
					<div className = "bottom-bar">
						<button className={"button " + (this.state.bottomPanel === 1 ? "active" : "")} onClick= {()=>{this.toggleBottomPanel(1)}}> Join Rooms... </button>
						<button className={"button " + (this.state.bottomPanel === 2 ? "active" : "")} onClick= {()=>{this.toggleBottomPanel(2)}} disabled = {!(this.state.roomId > 0)}> Word Bank </button>
						<button className="button" onClick= {()=>{this.toggleBottomPanel(false)}} disabled = {!this.state.bottomPanel}> (X) </button>
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
