'use client'
import './style.scss'
import { ReactNode, useState, useRef, useEffect } from 'react';
import Archive from '../../components/archive/archive'
import Message from '../../components/message/message'
import Input from '../../components/input/input'
import UserInfo from '../../components/user-info/user-info'
import Settings from '../../components/settings/settings'
import Background from '../../components/background/background'
import { useUser } from "@/hooks/useUser";

export default function Chat () {
    const scrollContainer = useRef(null);
    const [messagesList, setMessagesList]: [ReactNode[], React.Dispatch<React.SetStateAction<any>>] = useState([]);
    const { user } = useUser();
    let userId: string;

    let messagesContainer: HTMLElement;
    useEffect(()=>{
        messagesContainer = scrollContainer.current!;  
        userId = user?.id!;
    })

    function getMessage(data: {name: string, text: string, user: boolean}) {
        setMessagesList((prevState: ReactNode[]) => [...prevState, <Message key={prevState.length} name={data.name} text={data.text} user={data.user} />]);        
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
                <div id='messages-container' ref={scrollContainer}>
                    { messagesList }
                </div>
                <Input userQuestion={getMessage} iaAnswer={getMessage} />
            </section>
        </div>
    )
}