import './style.scss'
import Link from 'next/link'

export default function TaskList () {  
    return (
        <section id='task-list'>
            <ul>
                <li>
                    <Link href="/history">
                        Tâche                        
                    </Link>
                </li>

                <li>
                    <Link href="/history">
                        Tâche                        
                    </Link>
                </li>

                <li>
                    <Link href="/history">
                        Tâche                        
                    </Link>
                </li>
            </ul>
        </section>                
    )
}