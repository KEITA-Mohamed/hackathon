import './style.scss'
import Form from '../../components/form/form'
import Background from '../../components/background/background'
import SigninForm from "@/components/sigin-form/SiginForm";

export default function Login () {
    return (
        <div id="main-container">
            <Background />
            <Form connexionMethod="login"/>
            <SigninForm />
        </div>
    )
}