import './style.scss'
import Archive from '../../components/archive/archive'
import Message from '../../components/message/message'
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

                <Message key={0} name={"UserNAme"} text={'lorem'} user={true} />            
            </section>
        </div>
    )
}
