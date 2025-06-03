import './style.scss'

export default function HackatonList () {  
    return (
        <section id='hackaton-list'>
            <ul>
                <li>
                    Nom du hackaton : <span>Un super nom</span>                      
                </li> 
                <li>
                    Date de début : <span>02/07/2025</span>                      
                </li>  
                <li>
                    Date de fin : <span>06/07/2025</span>                      
                </li>  
                <li>
                    Nombres d'étudiants inscrits : <span>45</span>                      
                </li>                
            </ul>
        </section>                
    )
}