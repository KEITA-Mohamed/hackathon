'use client'
import './style.scss'
import {ReactNode, useState, useRef} from 'react';
import Archive from '../../components/archive/archive'
import Message from '../../components/message/message'
import Input from '../../components/input/input'
import UserInfo from '../../components/user-info/user-info'
import Settings from '../../components/settings/settings'
import Background from '../../components/background/background'
// import { useUser } from "@/hooks/useUser";

export default function Chat() {
    const scrollContainer = useRef<HTMLDivElement>(null);
    const [messagesList, setMessagesList] = useState<Array<ReactNode>>([]);
    // const { user } = useUser();

    function getMessage(data: { name: string, text: string, user: boolean }) : void {
        setMessagesList((prevState: ReactNode[]) => [...prevState,
            <Message key={prevState.length} name={data.name} text={data.text} user={data.user}/>]);
        setTimeout(() => {
            scrollContainer.current!.scrollTo({top: scrollContainer.current!.scrollHeight, left: 0, behavior: "smooth"});
        }, 100)        
    }

    return (
        <div id="main-container">
            <Background/>
            <Archive wichPage='chat'/>
            <section id='chat-container'>
                <div id='chat-header'>
                    <UserInfo wichPage="chat"/>
                    <Settings/>
                </div>
                <div id='messages-container' ref={scrollContainer}>
                    {messagesList}
                </div>
                <Input userQuestion={getMessage} iaAnswer={getMessage}/>
            </section>
        </div>


    )
}
