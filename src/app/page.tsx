import Background from '../components/background/background'
import DashbordHome from "@/app/dashboard/page";





export default function Home() {
  return (
    <div id="main-container">
      <Background />
      <h1><a id="home-title" href="/login"><span>Prompt</span><br />Validator</a></h1>
      <DashbordHome />
    </div>

  );
}
