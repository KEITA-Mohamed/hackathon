import Background from '../components/background/background'
import DashbordHome from "@/app/dashboard/page";
import ChatBox from "@/app/components/ChatBox";

export default function Home() {
    return (
        <div id="main-container">
            <Background />
            <h1><a id="home-title" href="/login"><span>Prompt</span><br />Validator</a></h1>
            <ChatBox/>
            <DashbordHome />
        </div>
    );
}
