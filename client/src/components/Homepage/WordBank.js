import React from 'react'
export default function(props){
	let words = props.bank
	let bankDisplay = Object.keys(words).map((word, i) =>{
		return(
			<div className = {(words[word] === true) ? ("bank-word complete") : ("bank-word")} key = {i}>
				{word}
			</div>
		)
	})

	return(
		<div className = "bank-container">
			<div className = "bank-list">
				{bankDisplay}
			</div>
		</div>
	)
}