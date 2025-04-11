'use client'
import './style.scss'
import { ReactNode, useState } from 'react';
import Archive from '../../components/archive/archive'
import Message from '../../components/message/message'
import Input from '../../components/input/input'
import UserInfo from '../../components/user-info/user-info'
import Settings from '../../components/settings/settings'
import Background from '../../components/background/background'

export default function Chat () {
    let messagesContainer: any = document.querySelector('#messages-container');
    const [messagesList, setMessagesList]: [ReactNode[], React.Dispatch<React.SetStateAction<any>>] = useState([]);
    const [counter, setCounter]: [number, React.Dispatch<React.SetStateAction<any>>] = useState(0);

    function getMessage(data: {name: string, text: string, user: boolean}) {
        setCounter(counter + 1);        
        setMessagesList((prevState: ReactNode[]) => ([...prevState, <Message name={data.name} text={data.text} user={data.user} />]));        
        setTimeout(()=>{
            messagesContainer.scrollTo({top: messagesContainer.scrollHeight, left: 0, behavior: "smooth"});      
        })
    }

    return (
        <div id="main-container">
            <Background />
            <Archive wichPage='chat' />            
            <section id='chat-container'>
                <div id='chat-header'>
                    <UserInfo wichPage="chat"/>
                    <Settings />
                </div>
                <div id='messages-container'>
                    { messagesList }
                </div>
                <Input userQuestion={getMessage} iaAnswer={getMessage} />
            </section>
        </div>
    )
}