"use client";

import { useState, useEffect } from "react";


interface User {
    id: string;
    name: string;
    email: string;
    role: string;
}

export function useUser() {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function fetchUser() {
            try {
                setLoading(true);
                const response = await fetch("/api/users/currentUser");

                if (!response.ok) {
                    throw new Error(response.statusText || "Erreur lors de la récupération de l'utilisateur");
                }

                const userData = await response.json();
                setUser(userData);
                setError(null);
            } catch (err) {
                setUser(null);
                setError("Erreur lors de la récupération de l'utilisateur");
                console.error("Erreur:", err);
            } finally {
                setLoading(false);
            }
        }

        fetchUser();
    }, []);

    return {
        user,
        loading,
        error,
        isAdmin: user?.role === "ADMIN",
        isTeacher: user?.role === "TEACHER",
        isStudent: user?.role === "STUDENT"
    };
}