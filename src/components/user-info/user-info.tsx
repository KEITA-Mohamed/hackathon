
import './user-info.scss'
export default function UserInfo ({ wichPage }: { wichPage: string }) {
    return (
        <div id='user-info-container'>
            <p id='user-name-container'>
                <span id='user-name-title'>Utilisateur</span><span id='user-name'>userName</span>
            </p>

                <p id='credit-container'>
                    <span id='credit-title'>Crédits restants</span><span id='credit-counter'>100</span>
                </p>
        </div>
    )
}