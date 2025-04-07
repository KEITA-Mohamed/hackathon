import './form.scss'
export default function Form ({ connexionMethod }: { connexionMethod: string }) {     
    return (
        <div id="main-container">
            <div id='connexion-method-container'>
                <button className={`connexion-method ${connexionMethod === 'login' ? 'active-btn' : ''}`}>
                    <a href="/login">Login</a>
                </button>

                <button className={`connexion-method ${connexionMethod === 'signup' ? 'active-btn' : ''}`}>
                    <a href="/signup">Signup</a>
                </button>
            </div>

            <div id="login-container">
                <div className='login-containers'>
                    {/* <p>Mail&thinsp;:</p> */}
                    <input type="text" placeholder='Mail'/>
                </div>

                <div className='login-containers'>
                    {/* <p>Mot de passe&thinsp;: </p> */}
                    <input type="text" placeholder='Mot de passe'/>
                </div>

                {connexionMethod === 'signup' &&
                    <div className='login-containers'>
                        <p>Valider le mot de passe&thinsp;: </p><input type="text" />
                    </div>
                }
            </div>

            <button>
                <a href="/chat">Connexion</a>
            </button>
        </div>
    )
}