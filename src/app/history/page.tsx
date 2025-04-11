import './style.scss'
import Archive from '../../components/archive/archive'
import Messages from '../../components/user-message/UserMessage'
import UserInfo from '../../components/user-info/user-info'
import Settings from '../../components/settings/settings'

export default function History () {
    return (
        <div id="main-container">
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