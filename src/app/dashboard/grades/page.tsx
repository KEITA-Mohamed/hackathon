import './style.scss'
import DashboardHeader from "@/components/dashboard-header/DashboardHeader";
import GradesList from "@/components/grades-list/GradesList";

export default function Dashboard () { 
    return (
        <div id="main-container">
            <DashboardHeader />
            <div id='grades-lists-container'>
                <div className='grades-list'>
                    <header>
                        <h1>Tâche 1</h1>
                    </header>
                    <GradesList />
                </div>

                <div className='grades-list'>
                    <header>
                        <h1>Tâche 2</h1>
                    </header>
                    <GradesList />
                </div>
            </div>
        </div>
    )
}