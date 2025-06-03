import './style.scss'
import DashboardHeader from "@/components/dashboard-header/DashboardHeader";
import HackatonList from "@/components/hackaton-list/HackatonList";

export default function Dashboard () { 
    return (
        <div id="main-container">
            <DashboardHeader />

            <div id='grades-lists-container'>
                <div className='grades-list'>
                    <header>
                        <h1>Infos</h1>
                    </header>
                    <HackatonList />
                </div>
            </div>
        </div>
    )
}