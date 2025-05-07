'use client';
import './input.scss';
import { useSignals } from '@preact/signals-react/runtime';
import {
    currentModel,
    userInput,
    response,
    loading,
    promptLeft,
    messagesList,
} from '@/signals/chatSignals';
import Message from '@/components/message/message';

export default function Input() {
    useSignals();

    const handleClicSendUserInput = async () => {
        const question = userInput.value.trim();
        if (!question) return;

        loading.value = true;
        response.value = '';
        userInput.value = '';


        messagesList.value = [
            ...messagesList.value,
            <Message key={messagesList.value.length} name="Moi" text={question} user={true} />,
        ];

        try {
            const res = await fetch(`/api/models/${currentModel.value}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ prompt: question }),
            });

            const data = await res.json();

            response.value = data.response;
            promptLeft.value -= 1;

            messagesList.value = [
                ...messagesList.value,
                <Message
                    key={messagesList.value.length}
                    name={currentModel.value}
                    text={data.response}
                    user={false}
                />,
            ];
        } catch (error) {
            console.error('Erreur requête IA :', error);
        } finally {
            loading.value = false;
        }
    };

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
