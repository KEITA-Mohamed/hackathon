import './style.scss'
import DashboardHeader from "@/components/dashboard-header/DashboardHeader";
import TaskList from "@/components/task-list/TaskList";
import Link from 'next/link';

export default function Dashboard () { 
    return (
        <div id="main-container">
            <DashboardHeader />
            <div id='task-lists-container'>
                <div className='task-list'>
                    <header>
                        <h1>Tâches</h1>
                    </header>
                    <TaskList />
                    <button>
                        <Link href="/task">
                            Ajouter une tâche                        
                        </Link>                
                    </button>
                </div>                
            </div>
        </div>
    )
}