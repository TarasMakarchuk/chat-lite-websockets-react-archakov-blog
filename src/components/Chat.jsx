import React from 'react';
import socket from "../socket";

const Chat = ({users, messages, userName, roomId, onAddMessage}) => {
	const [messageValue, setMessageValue] = React.useState('');
	const messagesRef = React.useRef(null);

	const onSendMessage = () => {
		socket.emit('ROOM_NEW_MESSAGE', {
			roomId,
			userName,
			text: messageValue,
		});
		onAddMessage({
			userName,
			text: messageValue,
		});
		setMessageValue('');
	};

	React.useEffect(() => {
		messagesRef.current.scrollTo(0, 99999);
	}, [messages]);

	return (
		<div className='chat'>
			<div className='chat-users'>
				{ <h1><b>Room: {roomId}</b></h1> }
				<hr/>
				<b>Online: {users.length}</b>
				<ul>
					{users.map((name, index) => (
						<li key={name + index}>{name}</li>
					))}
					<li>Test user</li>
				</ul>
			</div>

			<div className='chat-messages'>
				<div ref={messagesRef} className='messages'>
					{messages.map(message => (
						<div className='message' key={message.text}>
							<p>{message.text}</p>
							<div>
								<span>{message.userName}</span>
							</div>
						</div>
					))}


				</div>
				<form>
                  <textarea
	                  value={messageValue}
	                  onChange={(e) => setMessageValue(e.target.value)}
	                  className='form-control'
	                  rows='3'
                  />
					<button
						type='button' className='btn btn-primary'
						onClick={onSendMessage}
					>
						Send
					</button>
				</form>
			</div>

		</div>
	);
}

export default Chat;