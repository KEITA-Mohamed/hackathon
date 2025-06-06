import './style.scss'
import Link from 'next/link'

export default function GradesList () {  
    return (
        <section id='grades-list'>
            <ul>
                <li>
                    <Link href="/chat">
                        Notes                        
                    </Link>
                </li>

                <li>
                    <Link href="/chat">
                        Notes                        
                    </Link>
                </li>

                <li>
                    <Link href="/chat">
                        Notes                        
                    </Link>
                </li>
            </ul>
        </section>                
    )
}