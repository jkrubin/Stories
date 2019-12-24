import React from 'react'

export default function(props){
	let roomsDisplay = props.rooms.map((room, index) => {
		let joinable = room.roomId !== props.roomId
		return(
			<div className="room-row" key = {index}>
				<div className="name-col col">
					{room.name}
				</div>
				<div className="user-col col">
					{room.users.length}
				</div>
				<div className="join-col col">
					<button 
					className = "button" 
					onClick={()=>{props.joinRoom(room.roomId)}}
					disabled = {!joinable} > 
						Join 
					</button>
				</div>
				<div className = "delete-col col">
					{props.userId === room.roomId &&
						<button 
							className = "button" 
							onClick={()=>{props.deleteRoom(room.roomId)}} > 
								(X) 
						</button>
					}
				</div>
			</div>
		)
	})

	return(
		<div className="rooms-list">
			<div className="room-row room-header">
				<div className = "name-col col">Room name</div>
				<div className = "user-col col">player count</div>
				<div className = "join-col col">join</div>
				<div className = "delete-col col">delete</div>
			</div>
			{roomsDisplay}
		</div>
	)
}