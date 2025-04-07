import './style.scss'
import Form from '../../components/form/form'
import Background from '../../components/background/background'

export default function Login () {
    return (
        <div id="main-container">
            <Background />
            <Form connexionMethod={"signup"}/>
        </div>
    )
}