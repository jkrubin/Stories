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
				<h3> Homepage </h3>
				{this.context.isAuth?
					<StoryBox />
					:
					<div>
						<h1> login to continue </h1>
					</div>
				}
			</div>
		)
	}
}
Homepage.contextType = AuthContext

export default Homepage