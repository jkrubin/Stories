import React from "react"
import StoryBox from './StoryBox'
import { AuthContext } from "../../Auth/AuthContext"

class Homepage extends React.Component{
	constructor(props, context){
		super(props, context)
		this.state = {

		}
	}

	render(){
		return(
			<div className="homepage">
				<div className = "content">
					{this.context.isAuth?
						<StoryBox />
						:
						<div className = "login-splash">
							<div>
								<h1> log in above to continue </h1>
							</div>
						</div>
					}
				</div>
			</div>
		)
	}
}
Homepage.contextType = AuthContext

export default Homepage