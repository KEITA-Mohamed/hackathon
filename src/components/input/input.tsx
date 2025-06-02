'use client';
import './input.scss';
import { useSignals } from '@preact/signals-react/runtime';
import Image from 'next/image';
import {
    currentModel,
    userInput,
    response,
    loading,
    promptLeft,
    modelMessages,
    totalsByModelByUser,
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

        const model = currentModel.value;
        const messages = modelMessages.peek()[model] || [];

        modelMessages.value = {
            ...modelMessages.value,
            [model]: [
                ...messages,
                <Message key={Date.now()} name="Moi" text={question} user={true}/>,
            ],
        };

        try {
            const res = await fetch(`/api/models/${model}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                // we need the jwt cookie to id currentuser
                credentials: 'include',
                body: JSON.stringify({ prompt: question }),
            });

            const data = await res.json();

            response.value = data.response;
            promptLeft.value -= 1;

            modelMessages.value = {
                ...modelMessages.value,
                [model]: [
                    ...modelMessages.value[model],
                    <Message
                        key={Date.now()}
                        name={model}
                        text={data.response}
                        user={false}
                    />,
                ],
            };

            await updateTokensFromServer();

        } catch (error) {
            console.error('Erreur requête IA :', error);
        } finally {
            loading.value = false;
        }
    };


    const updateTokensFromServer = async () => {
        try {
            const res = await fetch('/api/token/getTokensByModelByUser', {
                credentials: 'include',
            });

            // if (!res.ok) throw new Error(await res.text());

            const json: Record<string, number> = await res.json();
            totalsByModelByUser.value = json;
        } catch (err) {
            console.error('Erreur lors de la mise à jour des crédits :', err);
        }
    };

    return (
        <div id="prompt-container">
            <div id="select-container">
                {['mistral', 'gemini', 'deepseek'].map((model) => (
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
                    placeholder="Sélectionnez un modèle 👆, puis entrez votre prompt ici."
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
                    {loading.value ? '...' : <Image width={20} height={20} src="./send.svg" alt="" />}
                </button>
            </div>
        </div>
    );
}
