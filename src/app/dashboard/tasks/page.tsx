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

            {/* <div className='modal'>
                <div className='modal-background'></div>
                <div className='modal-content'>
                    <header>
                        <h1>Test</h1>
                    </header>

                    <form action="">
                        <div className='content-container'>
                            <div className='field-container'>
    
                            </div>
                        </div>

                        <footer>
                            <button>
                                Valider
                            </button>
                        </footer>
                    </form>
                </div>
            </div> */}
        </div>
    )
}