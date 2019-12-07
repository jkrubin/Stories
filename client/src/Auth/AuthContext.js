import React from "react"
import { api } from "../config/config"
export const AuthContext = React.createContext()

class AuthProvider extends React.Component{
	constructor(){
		super()
		this.state = {
			isAuth: false,
			auth: {
				user:{
					id: 0
				}
			}
		}
		this.login = this.login.bind(this)
		this.logout = this.logout.bind(this)
		this.register = this.register.bind(this)
		this.updateUser = this.updateUser.bind(this)
	}

	async login(data){
		
		return fetch(api + '/login', {
			method: "POST",
			headers:{
				"Content-Type": "application/json"
			},
			body: JSON.stringify(data)
		})
		.then(res => res.json())
		.then((data) => {
			const auth = data
			if(auth.error){
				console.log({auth})
				return auth
			}else if(auth.user){
				this.setState({
					isAuth: true,
					auth: auth
				})
				return true
			}
		})
		.catch(error => console.log(error))	
	}
	
	async register(data){
		return fetch(api + '/register', {
			method: "POST",
			body: data
		})
		.then(res => res.json())
		.then((data) => {
			const auth = data
			if(auth.error){
				console.log({auth})
				return auth
			}else if(auth.user){
				this.setState({
					isAuth: true,
					auth: auth
				})
				return true
			}
		})
		.catch(error => console.log(error))			
	}

	async updateUser(data){
		return fetch(api + '/updateUser', {
				method: "POST",
				headers: {
					'x-access-token': this.state.auth.token
				},
				body: data
			})
			.then(res => res.json())
			.then((data) => {
				const auth = data
				if(auth.error){
					console.log({auth})
					return auth
				}else if(auth.user){
					this.setState(prevState => ({
						auth: {
							...prevState.auth,
							user: auth.user
						}
					}))
					return true
				}
			})
			.catch(error => console.log(error))	
	}
	logout(){
		this.setState({
			isAuth: false,
			auth: {
				user:{
					id: 0
				}
			}
		})
	}

	render(){
		return(
			<AuthContext.Provider 
				value ={ { 
					isAuth: this.state.isAuth,
					auth: this.state.auth,
					login: this.login,
					logout: this.logout,
					register: this.register,
					updateUser: this.updateUser
				} }
			>
			{this.props.children}
			</AuthContext.Provider>
		)
	}
}

const AuthConsumer = AuthContext.Consumer

export { AuthProvider, AuthConsumer}