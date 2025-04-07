import './archive.scss'

export default function Archive ({ wichPage }: {wichPage: string}) {     
    return (
        <section>
            <div id='chat-list'>
                <h3 className='gradient'>Conversations archivés</h3>
                <ul>
                    <li id='1'>
                        <a href="/history">
                            Conversation du 07/01/25
                            <span>12 messages - 12 crédits utilisés</span>
                        </a>
                    </li>
                    <li id='2'>
                        <a href="/history">                        
                            Conversation du 08/01/25
                            <span>19 messages - 19 crédits utilisés</span>
                        </a>
                    </li>
                </ul>
            </div>

            { wichPage === "history" &&
                <button id='current-chat'>
                    <a href="/chat">
                        Chat actuel
                        <span>8 messages</span>
                    </a>
                </button>
            }
        </section>
    )
}