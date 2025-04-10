<<<<<<< HEAD
import ChatBox from '../components/ChatBox'; // adapte le chemin selon où est ton composant

export default function ChatPage() {
    return <ChatBox />;
}
=======
import './style.scss'
import Archive from '../../components/archive/archive'
import Messages from '../../components/messages/messages'
import Input from '../../components/input/input'
import UserInfo from '../../components/user-info/user-info'
import Settings from '../../components/settings/settings'
import Background from '../../components/background/background'

export default function Chat () {
    return (
        <div id="main-container">
            <Background />
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
>>>>>>> develop
