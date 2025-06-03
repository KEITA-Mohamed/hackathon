'use client';

import './user-info.scss';
import { useEffect, useState } from 'react';
import { useSignals } from '@preact/signals-react/runtime';
import {
    totalsByModelByUser,
    currentModel,
} from '@/signals/chatSignals';

interface User {
    firstname: string | null;
    lastname: string | null;
}

export default function UserInfo() {
    useSignals();
    const [user, setUser] = useState<User | null>(null);

    // Fetch crédits par modèle
    useEffect(() => {
        let abort = false;
        (async () => {
            try {
                const res = await fetch('/api/token/getTokensByModelByUser', {
                    credentials: 'include',
                });



                const json: Record<string, number> = await res.json();
                if (!abort) {
                    totalsByModelByUser.value = json
                }
            } catch (err) {
                console.error('Impossible de charger les crédits :', err);
            }
        })();

        return () => { abort = true };
    }, []);

    useEffect(() => {
        let abort = false;
        (async () => {
            try {
                const res = await fetch('/api/users/currentUser', {
                    credentials: 'include',
                });

                if (!res.ok) throw new Error("Non authentifié");

                const data = await res.json();
                if (!abort) setUser(data);
            } catch (err) {
                console.error('Impossible de charger l’utilisateur :', err);
            }
        })();

        return () => { abort = true };
    }, []);

    const modelKey = currentModel.value.toLowerCase();
    const modelTotal = totalsByModelByUser.value[modelKey] ?? 0;

    return (
        <div id="user-info-container">
            <p id="user-name-container">
                <span id="user-name-title">Utilisateur</span>
                <span id="user-name">
                    {user ? `${user.firstname ?? ''} ${user.lastname ?? ''}`.trim() : '…'}
                </span>
            </p>

            <p id="credit-container">
                <span id="credit-title">Crédits {currentModel.value} consommés</span>
                <span id="credit-counter">
                    {totalsByModelByUser.value ? modelTotal.toLocaleString() : '…'}
                </span>
            </p>
        </div>
    );
}
