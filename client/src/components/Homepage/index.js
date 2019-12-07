import React from "react"
import StoryBox from './StoryBox'
class Homepage extends React.Component{
	constructor(props){
		super(props)
		this.state = {

		}
	}

	render(){
		return(
			<div className="homepage">
				<h3> Homepage </h3>
				<StoryBox />
			</div>
		)
	}
}

export default Homepage