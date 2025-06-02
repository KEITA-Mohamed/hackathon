import './style.scss'
import Link from 'next/link'

export default function MembersList () {  
    return (
        <section id='student-list'>
            <ul>
                <li>
                    <Link href="/history">
                        Membres                        
                    </Link>
                </li>

                <li>
                    <Link href="/history">
                        Membres                        
                    </Link>
                </li>

                <li>
                    <Link href="/history">
                        Membres                        
                    </Link>
                </li>
            </ul>
        </section>                
    )
}