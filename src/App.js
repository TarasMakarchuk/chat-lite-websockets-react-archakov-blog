import React from 'react';
import JoinBlock from "./components/JoinBlock";
import Chat from "./components/Chat";
import reducer from './reducer';
import socket from "./socket";
import axios from 'axios';

function App() {
	const [state, dispatch] = React.useReducer(reducer, {
		joined: false,
		roomId: null,
		userName: null,
		users: [],
		messages: []
	});

	const onLogin = async (userData) => {
		dispatch({
			type: 'JOINED',
			payload: userData
		});
		socket.emit('ROOM_JOIN', userData);
		const { data } = await axios.get(`/rooms/${userData.roomId}`);
		dispatch({
			type: 'SET_DATA',
			payload: data,
		});
	};

	const setUsers = users => {
		dispatch({
			type: 'SET_USERS',
			payload: users,
		});
	};

	const addMessage = (message) => {
		dispatch({
			type: 'NEW_MESSAGE',
			payload: message,
		})
	};

	React.useEffect(() => {
		socket.on('ROOM_SET_USERS', setUsers);
		socket.on('ROOM_NEW_MESSAGE', addMessage);
	}, []);


	window.socket = socket;

	console.log(state);

	return (
		<div className="wrapper" style={{display: 'flex', flexDirection: 'column', justifyContent: 'center'}}>
			{!state.joined ? <JoinBlock onLogin={onLogin}/> : <Chat {...state} onAddMessage={addMessage}/>}
		</div>
	);
}

export default App;
