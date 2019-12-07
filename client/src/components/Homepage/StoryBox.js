import React from "react"
import openSocket from 'socket.io-client'
import { AuthContext } from "../../Auth/AuthContext"
import { api } from "../../config/config"

class StoryBox extends React.Component{
	constructor(props, context){
		super(props, context)

		this.state = {
			input: '',
			story: [],
			room: 1,
		}
		this.socket = openSocket(api)
		this.handleChange = this.handleChange.bind(this)
		this.handleSubmit = this.handleSubmit.bind(this)
	}

	componentWillMount(){
		this.socket.on('newMessage' + this.state.room, (msg) => {
			console.log('connect')
			this.setState((prevState) => {
				prevState.story.push(msg)
				return prevState
			})
		})
	}
	handleChange(event){
		let {name, value} = event.target
		this.setState({[name]:value})
	}
	handleSubmit(){
		let message = {
			userId: this.context.auth.user.id, 
			eventId: this.state.room,
			message: this.state.input,
		}
		this.socket.emit('newMessage', message)
		this.setState({input: ''})
	}
	render(){
		let storyDisplay = this.state.story.map((msg) => {
			return (<span>{msg.message}</span>)
		})		
		return(
			<div className = "story-box">
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