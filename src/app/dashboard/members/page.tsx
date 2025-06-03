import './style.scss'
import DashboardHeader from "@/components/dashboard-header/DashboardHeader";
import MembersList from "@/components/members-list/MembersList";

export default function Dashboard () { 
    return (
        <div id="main-container">
            <DashboardHeader />
            <div id='member-lists-container'>
                <div className='member-list'>
                    <header>
                        <h1>Admin</h1>
                    </header>
                    <MembersList />
                </div>

                <div className='member-list'>
                    <header>
                        <h1>Professeurs</h1>
                    </header>
                    <MembersList />
                </div>

                <div className='member-list'>
                    <header>
                        <h1>Jurys</h1>
                    </header>
                    <MembersList />
                </div>

                <div className='member-list'>
                    <header>
                        <h1>Étudiants</h1>
                    </header>
                    <MembersList />
                </div>
            </div>           
        </div>
    )
}