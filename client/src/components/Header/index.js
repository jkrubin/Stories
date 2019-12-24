import React from "react"
import { AuthContext, AuthConsumer } from '../../Auth/AuthContext'
import './style.css'
class Header extends React.Component{
	constructor(props,context){
		super(props,context)
		this.state = {
			email: "",
			password: ""
		}
		this.handleChange = this.handleChange.bind(this)
		this.handleSubmit = this.handleSubmit.bind(this)
	}

	handleChange(event){
		const {name, value} = event.target
		this.setState({[name]: value})
	}
	handleSubmit(){
		const data = {
			email: this.state.email,
			password: this.state.password,
		}
		this.context.login(data)
		.then(res => {
			if(res.error){
				alert("incorrect login")
			}
			this.setState({email: "", password: ""})
			if(!res.error){
				console.log('login')
			}
		}).catch((error) => {
			console.log(error)
		})
	}
	render(){

		return(
			<div className = "header">
				<div className="header-content">
					<img 
						src = {require('../../assets/Stories_Logo.png')} 
						style = {{height:'100px', width:'auto'}}
						alt = "Stories With Enemies"
					/>
				</div>
				<AuthConsumer>
					{({isAuth, login, logout, auth}) => (
					<div className = 'login-area'>
						{isAuth? (
							<div className="login-form">
								<div className="account">
									<p className="team-name"> {auth.user.bio} </p>
									<button className="logout" onClick={logout}> Log Out </button>
								</div>
							</div>
						) : (
							<div className="login-form">
								<table>
									<tbody>
									<tr>
										<td className="form-group">
											<input 
											type="text"
											className="email-form form"
											value={this.state.email}
											name="email" 
											onChange = {this.handleChange}
											placeholder = "email" />
										</td>
									</tr>
									<tr>
										<td className="form-group">
											<input 
											type="password"
											className="password-form form"
											value={this.state.password}
											name="password" 
											onChange = {this.handleChange}
											placeholder = "password" />
										</td>
									</tr>
									<tr>
										<td className="form-submit">
											<button className="button-submit" onClick={this.handleSubmit}>Login</button>
										</td>
									</tr>
									</tbody>
								</table>
							</div>
						)}
					</div>
					)}
				</AuthConsumer>
			</div>
		)
	}
}
Header.contextType = AuthContext
export default Header