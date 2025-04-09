import './style.scss'
import Dashboard from "@/components/dashboard/Dashboard";

export default function History () {
    return (
        <div id="main-container">
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
            <Dashboard />
        </div>
    )
}