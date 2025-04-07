import './style.scss'
import Archive from '../../components/archive/archive'
import Messages from '../../components/messages/messages'
import Input from '../../components/input/input'
import UserInfo from '../../components/user-info/user-info'
import Settings from '../../components/settings/settings'
import Background from '../../components/background/background'
import ChatBox from '../../components/chatbox/ChatBox'

export default function Chat () {
    return (
        <div id="main-container">
            <Background />
            <ChatBox />    
            <Archive wichPage='chat' />            
            <section id='chat-container'>
                <div id='chat-header'>
                    <UserInfo wichPage="chat"/>
                    <Settings />
                </div>
                <Messages /> 
                <Input />               
            </section>
        </div>
    )
}