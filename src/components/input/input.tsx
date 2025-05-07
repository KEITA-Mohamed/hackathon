'use client';
import './input.scss';
import { useSignals } from '@preact/signals-react/runtime';
import {
    currentModel,
    userInput,
    response,
    loading,
    promptLeft,
} from '@/signals/chatSignals';

export default function Input(props: { userQuestion: Function; iaAnswer: Function }) {
    useSignals();

    const handleClicSendUserInput = async () => {
        if (!userInput.value.trim()) return;

        loading.value = true;
        response.value = '';
        const question = userInput.value.trim();
        userInput.value = '';

        sendMessage('UserName', question, true);

        const res = await fetch(`/api/models/${currentModel.value}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ prompt: question }),
        });

        const data = await res.json();
        response.value = data.response;
        promptLeft.value -= 1;
        loading.value = false;
        sendMessage(currentModel.value, data.response, false);
    };

    function sendMessage(name: string, text: string, user: boolean) {
        const data = { name, text, user };
        user ? props.userQuestion(data) : props.iaAnswer(data);
    }

    return (
        <div id="prompt-container">
            <div id="select-container">
                {['mistral', 'gemini', '03', '04', 'deepseek'].map((model) => (
                    <button
                        key={model}
                        onClick={() => (currentModel.value = model)}
                        className={`model-btn ${currentModel.value === model ? 'active-model' : ''}`}
                    >
                        {model}
                    </button>
                ))}
            </div>
            <div id="input-container">
                <input
                    placeholder="Sélectionnez un modèle 👆, puis entrer votre prompt ici."
                    type="text"
                    value={userInput.value}
                    onChange={(e) => (userInput.value = e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault();
                            handleClicSendUserInput();
                        }
                    }}
                />
                <button
                    onClick={handleClicSendUserInput}
                    disabled={loading.value || !userInput.value.trim()}
                    className={`${
                        loading.value || !userInput.value.trim()
                            ? 'bg-gray-400 cursor-not-allowed'
                            : 'bg-blue-500 hover:bg-blue-600'
                    }`}
                >
                    {loading.value ? '...' : <img src="./send.svg" alt="" />}
                </button>
            </div>
        </div>
    );
}
