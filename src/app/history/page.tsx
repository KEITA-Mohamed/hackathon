import './style.scss'
import Archive from '../../components/archive/archive'
import Messages from '../../components/messages/messages'
import UserInfo from '../../components/user-info/user-info'
import Settings from '../../components/settings/settings'
import Background from '../../components/background/background'

export default function History () {
    return (
        <div id="main-container">
            <Background />
            <Archive wichPage='history'/>
            
            <section id='chat-container'>
                
                <div id='chat-header'>
                    <UserInfo wichPage="history"/>    
                    <Settings />            
                </div>

                <Messages /> 
            </section>
        </div>
    )
}