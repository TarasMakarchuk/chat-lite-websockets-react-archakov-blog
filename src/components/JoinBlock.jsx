import React from 'react';
// import socket from '../socket';
import axios from "axios";

const JoinBlock = ({onLogin}) => {
  const [roomId, setRoomId] = React.useState('');
  const [userName, setUserName] = React.useState('');
  const [isLoading, setLoading] = React.useState(false);

  const onEnter = async () => {
    if (!roomId || !userName) {
      return alert('Enter data');
    }
    setLoading(true);

    const userData = {
      roomId,
      userName
    }

    await axios.post('/rooms', userData)
     .then(() => onLogin(userData))
     .catch(e => console.error(e));
  }

  return (
          <div className='join-block' style={{marginTop: '150px', marginLeft: 'auto', marginRight: 'auto'}}>
            <input
                    type="text"
                    placeholder='Room ID'
                    style={{fontSize: '36px', display: 'block', marginTop: '20px', padding: '10px'}}
                    value={roomId}
                    onChange={event => setRoomId(event.target.value)}
            />
            <input
                    type="text"
                    placeholder='Your name'
                    style={{fontSize: '36px', display: 'block', marginTop: '20px', padding: '10px'}}
                    value={userName}
                    onChange={event => setUserName(event.target.value)}

            />
            <button
                    style={{width: '435px', height: '100px', background: 'green', fontSize: '36px', marginTop: '50px'}}
                    onClick={onEnter}
                    disabled={isLoading}
            >
              {isLoading ? 'Enter...' : 'Sign in'}
            </button>

          </div>
  );
}

export default JoinBlock;