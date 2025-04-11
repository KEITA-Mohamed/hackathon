import './style.scss'
import Dashboard from "@/components/dashboard/Dashboard";
import Link from 'next/link'

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
                        <Link href="/history">
                            Nom de l&apos;étudiants
                            <span>
                                3 conversations - 12 crédits restants 
                            </span>
                        </Link>
                    </li>

                    <li>
                        <Link href="/history">
                            Nom de l&apos;étudiants
                            <span>
                                3 conversations - 12 crédits restants 
                            </span>
                        </Link>
                    </li>

                    <li>
                        <Link href="/history">
                            Nom de l&apos;étudiants
                            <span>
                                3 conversations - 12 crédits restants 
                            </span>
                        </Link>
                    </li>
                </ul>
            </section>
        </div>
    )
}