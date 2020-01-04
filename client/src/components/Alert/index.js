import React from 'react'
import './style.css'

export default function(props){

	return(
		<div className={("alert-container" + (props.show ? "" : " hide"))}>
			<div className="alert-message">
				{props.message}
			</div>
			<div classname="alert-close" onClick={()=>{props.toggle(false)}}>
				X
			</div>
		</div>
	)
}