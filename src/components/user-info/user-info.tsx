import './user-info.scss';
// import { useEffect, useState } from 'react';

export default function UserInfo() {
    // const [leftCreditValue, setLeftCreditValue] = useState<number | null>(null);

    // useEffect(() => {
    //     async function fetchCredit( modelName : string) {
    //         try {
    //             const res = await fetch(`/api/getTotalTokenByModel?model=${modelName}`);
    //             const data = await res.json();
    //             if (res.ok) {
    //                 setLeftCreditValue(data.total);
    //             } else {
    //                 console.error('Erreur:', data.error);
    //             }
    //         } catch (error) {
    //             console.error('Erreur réseau:', error);
    //         }
    //     }

    //     fetchCredit(modelName);
    // }, [leftCreditValue]);


    return (
        <div id='user-info-container'>
            <p id='user-name-container'>
                <span id='user-name-title'>Utilisateur</span>
                <span id='user-name'>userName</span>
            </p>

            <p id='credit-container'>
                <span id='credit-title'>Crédits restants</span>
                <span id='credit-counter'>
                    0
                </span>
            </p>
        </div>
    );
}
