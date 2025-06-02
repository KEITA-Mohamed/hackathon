import './style.scss'
import DashboardHeader from "@/components/dashboard-header/DashboardHeader";
import MembersList from "@/components/members-list/MembersList";

export default function Dashboard () { 
    return (
        <div id="main-container">
            <DashboardHeader />
            <header>
                <h1>Teacher
                </h1>
            </header>
            <MembersList></MembersList>
        </div>
    )
}