import './messages.scss'
export default function History () {
    return (
        <div id='messages-container'>
            <div className='message-container user-message'>
                <div className='message'>                    
                    <p className='message-from'>userName</p>
                    <p className='message-text'>Lorem ipsum, dolor sit amet consectetur adipisicing elit. Aspernatur itaque perferendis modi incidunt amet. Molestiae blanditiis unde voluptates eius voluptas dicta ex quia, beatae, quos ea, inventore culpa perspiciatis autem!</p>
                    <p className='message-infos'>
                        <span>22 / 01 / 2025</span>
                        <span>14:07</span>
                    </p>
                </div>
            </div>

            <div className='message-container ia-message'>
                <div className='message'>
                    <p className='message-from'>Modele</p>
                    <p className='message-text'>Lorem ipsum, dolor sit amet consectetur adipisicing elit. Aspernatur itaque perferendis modi incidunt amet. Molestiae blanditiis unde voluptates eius voluptas dicta ex quia, beatae, quos ea, inventore culpa perspiciatis autem!</p>
                    <p className='message-infos'>
                        <span>22 / 01 / 2025</span>
                        <span>14:07</span>
                    </p>
                </div>
            </div>
        </div>
    )
}