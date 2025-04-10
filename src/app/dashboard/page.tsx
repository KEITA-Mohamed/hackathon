import './style.scss'
import Dashboard from "@/components/dashboard/Dashboard";

export default function History () {
    return (
        <div id="main-container">
            <Dashboard />
            <header>
                <h1>Inscription
                </h1>
            </header>

            <section id='student-list'>
                <ul>
                    <li>
                        <a href="/history">
                            Nom de l&apos;étudiants
                            <span>
                                3 conversations - 12 crédits restants 
                            </span>
                        </a>
                    </li>

                    <li>
                        <a href="/history">
                            Nom de l&apos;étudiants
                            <span>
                                3 conversations - 12 crédits restants 
                            </span>
                        </a>
                    </li>

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