import React from 'react'
export default function(props){
	let user = props.user
	return(
		<div className = {props.active? ("user-box active") : ("user-box")}>
			<div className="inner-user-box"></div>
			<div className="inner-user-content">
				{user.name}
			</div>
		</div>
	)
}