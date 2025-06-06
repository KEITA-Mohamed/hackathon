"use client"
import './DashboardHeader.scss';
import Link from "next/link"
import { useUser } from "@/hooks/useUser";
import { currentTab } from "@/signals/dashboardSignals";

export default function Dashboard() {
    const {isAdmin, isTeacher} = useUser();

    return (
        <div id='dashboard-header'>
            <div id='dashboard-user-infos'>
                <div className='dashboard-user-container' id='name-container'>
                    <span>
                        Utilisateur
                    </span>
                    <span>
                        Prénom Nom
                    </span>
                </div>

                <div className='dashboard-user-container' id='role-container'>
                    <span>
                        Rôle
                    </span>
                    <span>
                    {
                        isAdmin ? (
                            <h2>Admin</h2>
                        ) : isTeacher ? (
                            <h2>Prof</h2>
                        ) : null 
                    }  
                    </span>
                </div>
            </div>              
            <div id='dahsboard-nav'>                
                <Link onClick={ () => { currentTab.value = "Hackaton" }} href="/dashboard" className={`${currentTab.value === 'Hackaton' ? "active" : ""}`}>
                    Hackaton
                </Link>
                <Link onClick={ () => { currentTab.value = "Évaluations" }} href="/dashboard/grades" className={`${currentTab.value === 'Évaluations' ? "active" : ""}`}>
                    Évaluations
                </Link>
                <Link onClick={ () => { currentTab.value = "Tâches" }} href="/dashboard/tasks" className={`${currentTab.value === 'Tâches' ? "active" : ""}`}>
                    Tâches
                </Link>
                <Link onClick={ () => { currentTab.value = "Membres" }} href="/dashboard/members" className={`${currentTab.value === 'Membres' ? "active" : ""}`}>
                    Membres
                </Link>
            </div>
        </div>
    );
}
