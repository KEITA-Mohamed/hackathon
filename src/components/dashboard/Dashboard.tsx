"use client"
import './Dashboard.scss';
import Link from "next/link"
import {useUser} from "@/hooks/useUser";

export default function Dashboard() {

    const {isAdmin, isTeacher} = useUser();

    return (
        <div id='dashboard-header'>
            <Link rel="stylesheet" href="/chat">Chat</Link>
            {
                isAdmin ? (
                    <h2>Admin</h2>
                ) : isTeacher ? (
                    <h2>Prof</h2>
                ) : null 
            }
            <Link href="/invite" className="text-foreground hover:text-primary transition-colors">
                Invité un membre
            </Link>
        </div>
    );
}
