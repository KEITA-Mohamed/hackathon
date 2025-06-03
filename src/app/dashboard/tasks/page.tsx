import './style.scss'
import DashboardHeader from "@/components/dashboard-header/DashboardHeader";
import TaskList from "@/components/task-list/TaskList";

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
                </div>                
            </div>
        </div>
    )
}