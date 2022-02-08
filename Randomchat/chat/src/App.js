import React, {useState, useEffect} from 'react';
import logo from './logo.svg';
import './App.css';
import io from 'socket.io-client';

const socket = io.connect('http://localhost:4000')

function App() {

  const [state, setState] = useState({message:''})
  const [chat,setChat] =useState([])
  const [isbtnClicked,setClick] = useState(false)

  useEffect(()=>{
    socket.on('message',({name,message})=>{
      console.log(message)
      setChat([...chat,{name, message}])
    })

    socket.on('update_toID', (ID) =>{
      console.log('is it right?')
      socket.emit('updateID', ID)
    })
  },[chat])

  const rendermyChat = ()=>{
    return chat.map( ({name,message}, index)=> (
      <li key={index}> {name} : {message} </li>
    ))
  }

  const onMessageSubmit = (e) =>{

    e.preventDefault()
    const {message}= state
    socket.emit('message', {message})
    setState({message : ''})
    const name = '나'
    setChat([...chat,{name, message}])
  }

  const onChange = (e) =>{
    console.log(e.target.value)
    setState({message : e.target.value})
    
  }

  const renderBtn = ()=>{
    if(isbtnClicked === true){
      return (
        <form action="" id="sendForm" onSubmit={onMessageSubmit}>
          <input autoComplete="off" onChange={onChange} value={state.message}/><button>전송</button>
        </form>
      )
    }
    else{
      return(
        <button id="findBtn" onClick={match_Btn_click}>매칭 상대 찾기</button>
      )
    }
  }

  const match_Btn_click = (e)=>{
    socket.emit('findMatch')
    setClick(true)
  }

  

  return (
    <div className="App">
      <header className="App-header">
        <div id="titlebar" >
          <a id="title" href="localhost:3000" >
            <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSN5v82ItwB6nsdJENubF-SxHe7XTL1hg7p0A&usqp=CAU" width="319" height="79"/>
          </a>

        </div>
        <div id="chatdiv">
          <ul id="chatLog">
            {rendermyChat()}
          </ul>
            {renderBtn()}
        </div>
      </header>
    </div>
  );
}

export default App;
