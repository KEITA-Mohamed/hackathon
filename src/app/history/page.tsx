import './style.scss'
import Archive from '../../components/archive/archive'
import Message from '../../components/message/message'
import Settings from '../../components/settings/settings'

export default function History () {
    return (
        <div id="main-container">
            <Archive wichPage='history'/>
            
            <section id='chat-container'>                
                <div id='chat-header'>
                    <Settings />
                </div>

                <div id='messages-container'>
                    <Message key={0} name={"UserNAme"} text={'lorem'} user={true} />            
                </div>
            </section>
        </div>
    )
}
