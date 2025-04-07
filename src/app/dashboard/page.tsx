import './style.scss'
import Background from '../../components/background/background'

export default function History () {
    return (
        <div id="main-container">
            <Background />
            <section id='student-list'>
                <h3>Etudiants</h3>
                <ul>
                    <li>
                        <a href="/history">
                            Nom de l&apos;étudiants
                            <span>
                                3 conversations - 12 crédits restants 
                            </span>
                        </a>
                    </li>
                </ul>
            </section>
        </div>
    )
}