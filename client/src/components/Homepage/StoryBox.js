import React from "react"
import openSocket from 'socket.io-client'
import { AuthContext } from "../../Auth/AuthContext"
import { api } from "../../config/config"
import UserDisplay from "./UserDisplay"
import './style.css'

class StoryBox extends React.Component{
	constructor(props, context){
		super(props, context)

		this.state = {
			input: '',
			nameInput: '',
			turn:0,
			roomId: -1,
			words: [],
			users: [],
			showRooms: false,
			availableRooms: [],
			bottomPanel: false,
		}
		//Dom manipulation
		this.handleChange = this.handleChange.bind(this)
		this.handleSubmit = this.handleSubmit.bind(this)
		this.toggleRoomsMenu = this.toggleRoomsMenu.bind(this)
		this.toggleBottomPanel = this.toggleBottomPanel.bind(this)

		//Fetch		
		this.createRoom = this.createRoom.bind(this)
		this.getRooms = this.getRooms.bind(this)
		this.joinRoom = this.joinRoom.bind(this)
		this.deleteRoom = this.deleteRoom.bind(this)

		//Socket funcs
		this.socket = openSocket(api, {query: `userId=${context.auth.user.id}`})
		this.socketListen = this.socketListen.bind(this)
		this.handleSocket = this.handleSocket.bind(this)

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
		this.socket.emit('newMessage', message)
		this.setState({input: ''})
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
					this.setState({...room})
					this.socketListen(room.roomId)
				}
			}
		})
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
		if(msg.users){
			this.setState({users: msg.users})
		}
		if(msg.message){
			this.setState((prevState)=>{
				let newWords = prevState.words
				newWords.push(msg)
				return {words: newWords}
			})
		}
		if(msg.hasOwnProperty('turn')){
			this.setState({turn: msg.turn})
		}
		if(msg.delete){
			this.setState({roomId: -1, users: [], words: []})
			this.socket.off('newMessage' + msg.delete)
		}
	}
	render(){
		let storyDisplay = this.state.words.map((msg) => {
			const trimmed = msg.message.trim()
			return (<span>{trimmed} </span>)
		})
		let roomsDisplay = this.state.availableRooms.map((room) => {
			let joinable = room.roomId != this.state.roomId
			return(
				<div className="room-row">
					<td className="name-col col">
						{room.name}
					</td>
					<td className="user-col col">
						{room.users.length}
					</td>
					<td className="join-col col">
						<button 
						className = "button" 
						onClick={()=>{this.joinRoom(room.roomId)}}
						disabled = {!joinable} > 
							Join 
						</button>
					</td>
					<td className = "delete-col col">
						{this.context.auth.user.id === room.roomId &&
							<button 
								className = "button" 
								onClick={()=>{this.deleteRoom(room.roomId)}} > 
									(X) 
							</button>
						}
					</td>
				</div>
			)
		})
		let usersDisplay = this.state.users.map((user, index)=>{
			return (<UserDisplay user={user} active={(this.state.turn === index)}/>)
		})
		let wordsDisplay = (<div> Words Display </div>)
		let panelDisplay = ''
		switch(this.state.bottomPanel){
			case 1:
				panelDisplay = (
					<div className="rooms-list-container">
						<button className="button" onClick={this.getRooms}> Update rooms list </button>
						<div className="rooms-list">
							<div className="room-row room-header">
								<div className = "name-col col">Room name</div>
								<div className = "user-col col">player count</div>
								<div className = "join-col col">join</div>
								<div className = "delete-col col">delete</div>
							</div>
							{roomsDisplay}
						</div>
					</div>
				)
				break
			case 2:
				panelDisplay = wordsDisplay
				break
			default:
				panelDisplay = (<div> no display </div>)
		}
		let lastPlayed = this.state.words.slice(-1)[0]
		if(lastPlayed){
			lastPlayed = lastPlayed.message
		}
		let isMyTurn = false
		if(this.state.roomId > 0){
			isMyTurn = this.state.users[this.state.turn].id === this.context.auth.user.id
		}
		return(
			<div className = "story-box">
				{this.state.roomId === -1 ?
					<div className = "createRoom">
						<h1>Create a Room!</h1>
						<table>
							<tr>
								<input
								type="text"
								className="form"
								value = {this.state.nameInput}
								name="nameInput"
								onChange = {this.handleChange}
								placeholder = "room name" />

								<button className="button" onClick={this.createRoom}> Create Room! </button>
							</tr>
						</table>
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
								<p>Prompt: Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas non lobortis leo. Aliquam dapibus sapien sapien, vel aliquam diam hendrerit ac. </p>
							</div>
							<div className="toolbar-item score">
								<p>Score</p>
								<h1> 3/10 </h1>
							</div>
							<div className="toolbar-item review">
								<p> last played: </p>
								<p> {lastPlayed} </p>
							</div>
							<div className="toolbar-item challenge-container">
								<div className="challenge-button">
									<p> challenge</p>
								</div>
							</div>
						</div>
						<div className="story-display">
							{storyDisplay}
						</div>
						<div className="input-display">
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
					</div>
				}
				<div className = "bottom-container">
					<div className = "bottom-bar">
						<button className="button" onClick= {()=>{this.toggleBottomPanel(1)}}> Panel </button>
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

/*

<button className="button rooms-menu-toggle" onClick={this.toggleRoomsMenu}> Show rooms </button>
<div className="rooms-menu" style={{maxWidth: (this.state.showRooms? "250px" : "0px")}}>
	<div className="rooms-list-container">
		<ul className="rooms-list">
			{roomsDisplay}
		</ul>
		<button className="button" onClick={this.getRooms}> Update rooms list </button>
	</div>
</div>

*/