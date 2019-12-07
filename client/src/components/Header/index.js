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
		})
	}
	render(){

		return(
			<div className = "header">
				<div className="header-content">
					<h1>Stories With Enemies</h1>
				</div>
				<AuthConsumer>
					{({isAuth, login, logout, auth}) => (
					<div>
						{isAuth? (
							<div className="login-form">
								<div className="account">
									<img src={auth.user.mimeType} height="66" className="pr-image pr-image-top" style={{marginTop: 0}} /> 
									<p className="team-name"> {auth.user.bio} </p>
									<button className="logout" onClick={logout}> Log Out </button>
								</div>
							</div>
						) : (
							<div className="login-form">
								<table>
									<tr>
										<td> <label> email: </label> </td>
										<td> <label> password: </label> </td>
									</tr>
									<tr>
										<td>
											<div className="form-group">
												<input 
												type="text"
												className="email-form form"
												value={this.state.email}
												name="email" 
												onChange = {this.handleChange} />
											</div>
										</td>
										<td>
											<div className="form-group">
												<input 
												type="password"
												className="password-form form"
												value={this.state.password}
												name="password" 
												onChange = {this.handleChange} />
											</div>
										</td>
										<div className="form-submit">
											<button className="button-submit" onClick={this.handleSubmit}>Login</button>
										</div>
									</tr>
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