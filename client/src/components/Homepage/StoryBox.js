import React from "react"
import openSocket from 'socket.io-client'
import { AuthContext } from "../../Auth/AuthContext"
import { api } from "../../config/config"
import './style.css'

class StoryBox extends React.Component{
	constructor(props, context){
		super(props, context)

		this.state = {
			input: '',
			story: [],
			room: -1,
			showRooms: false,
			availableRooms: [],
		}
		this.socket = openSocket(api)
		this.handleChange = this.handleChange.bind(this)
		this.handleSubmit = this.handleSubmit.bind(this)

		this.createRoom = this.createRoom.bind(this)
		this.getRooms = this.getRooms.bind(this)
		this.toggleRoomsMenu = this.toggleRoomsMenu.bind(this)
	}

	componentWillUnmount(){
		this.socket.disconnect()
	}
	createRoom(){
		let data = {
			id: this.context.auth.user.id
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
				this.setState({room: data.room.id})
				this.socket.on('newMessage' + data.room.id, (msg) => {
					console.log('connect')
					this.setState((prevState) => {
						prevState.story.push(msg)
						return prevState
					})
				})
				console.log({data})
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
						id: room.id,
						users: room.users
					})
				}
				this.setState({availableRooms: openRooms})
			}
		}).catch((error) => {
			console.log(error)
		})
	}
	toggleRoomsMenu(){
		this.setState((prevState)=>{
			return({showRooms: !prevState.showRooms}) 
		})
	}
	handleChange(event){
		let {name, value} = event.target
		this.setState({[name]:value})
	}
	handleSubmit(){
		let message = {
			userId: this.context.auth.user.id, 
			roomId: this.state.room,
			message: this.state.input,
		}
		this.socket.emit('newMessage', message)
		this.setState({input: ''})
	}
	render(){
		let storyDisplay = this.state.story.map((msg) => {
			return (<span>{msg.message}</span>)
		})	
		let roomsDisplay = this.state.availableRooms.map((room) => {
			return(
				<li className="room-list-item">id: {room.id}, users: {room.users.length}</li>
			)
		})	
		return(
			<div className = "story-box">
				{this.context.isAuth &&
					<div>
						<h3>Create a new Room</h3>
						<button className="button" onClick={this.createRoom}> Create Room! </button>
					</div>
				}
				<button className="button rooms-menu-toggle" onClick={this.toggleRoomsMenu}> Show rooms </button>
				<div className="rooms-menu" style={{maxWidth: (this.state.showRooms? "250px" : "0px")}}>
					<div className="rooms-list-container">
						<ul className="rooms-list">
							{roomsDisplay}
						</ul>
						<button className="button" onClick={this.getRooms}> Update rooms list </button>
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
						onChange = {this.handleChange} />
					</div>
					<div className="form-submit">
						<button className="button-submit" onClick={this.handleSubmit}>Submit</button>
					</div>
				</div>
			</div>
		)
	}
}

StoryBox.contextType = AuthContext
export default StoryBox