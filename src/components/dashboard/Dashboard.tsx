"use client"
import './Dashboard.scss';
import Link from "next/link"
import {useUser} from "@/hooks/useUser";

export default function Dashboard() {

    const {isAdmin, isTeacher} = useUser();

    return (
        <div id='dashboard-header'>
            {
                isAdmin ? (
                    <h2>Admin</h2>
                ) : isTeacher ? (
                    <h2>Prof</h2>
                ) : null 
            }
            <div id='dahsboard-nav'>
                <Link rel="stylesheet" href="/chat">Chat</Link>
                <Link href="/invite" className="text-foreground hover:text-primary transition-colors">
                    Inviter un membre
                </Link>
                <Link href="/task" className="text-foreground hover:text-primary transition-colors">
                    Ajouter une tache
                </Link>
            </div>
        </div>
    );
}
