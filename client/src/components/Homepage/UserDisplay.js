import React from 'react'
export default function(props){
	let user = props.user
	let colors = ["rgb(52, 64, 235)", "rgb(235, 62, 56)", "rgb(235, 154, 56)", "rgb(235, 235, 56)", "rgb(25, 145, 16)", "rgb(68, 194, 164)", "rgb(163, 74, 212)"]
	let livesDisplay = []
	for(let i = 0; i < user.life; i++){
		let heartDiv = (
			<div className="heart-container">
				<img 
					src = {require('../../assets/heart-full.png')} 
					style = {{height:'12px', width:'auto'}}
					alt = "Full Life"
				/>
			</div>
		)
		livesDisplay.push(heartDiv)
	}
	return(
		<div className = {props.active? ("user-box active") : ("user-box")}
		style={{background: colors[props.index]}} >
			<div className="inner-user-box"></div>
			<div className="inner-user-content" >
				<div className="user-name">
					{user.name}
				</div>
				<div className="user-right">
					<div className="user-score">
						<p><span>{"score: " + props.score}</span></p>
					</div>
					<div className="user-life">
						{livesDisplay}
					</div>
				</div>
			</div>
		</div>
	)
}