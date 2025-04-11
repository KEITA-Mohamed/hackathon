import './message.scss'
import getTime from '../../services/getTime.service';

export default function Message (props: { name: string, text: string, user: boolean }) {
    const [currentDate, currentTime] = getTime();
        
    return (
        <div className={`message-container ${ props.user ? "user-message" : "" }`}>
            <div className='message'>                    
                <p className='message-from'>{ props.name }</p>
                <p className='message-text'>
                    { props.text }
                </p>
                <p className='message-infos'>
                    <span>{ currentDate }</span>
                    <span>{ currentTime }</span>
                </p>
            </div>
        </div>
    )
}