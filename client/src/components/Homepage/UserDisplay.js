import React from 'react'
export default function(props){
	let user = props.user
	let colors = ["rgb(52, 64, 235)", "rgb(235, 62, 56)", "rgb(235, 154, 56)", "rgb(235, 235, 56)", "rgb(25, 145, 16)", "rgb(68, 194, 164)", "rgb(163, 74, 212)"]

	return(
		<div className = {props.active? ("user-box active") : ("user-box")}
		style={{background: colors[props.index]}} >
			<div className="inner-user-box"></div>
			<div className="inner-user-content" >
				{user.name}
			</div>
		</div>
	)
}