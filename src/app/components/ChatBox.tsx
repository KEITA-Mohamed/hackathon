'use client';

import React, { Fragment, useState } from 'react';

export default function ChatBox() {
    const [userQuestionInput, setUserInput] = useState('');
    const [response, setResponse] = useState('');
    const [loading, setLoading] = useState(false);
    const [promptLeft, setPromptLeft] = useState(100);
    const aiModelsAPI = ['mistral', 'gemini', '03', '04', 'deepseek'];


// utilisée pour créer des objectid en front [pour dev]
    function generateObjectIdLike(): string {
        const timestamp = Math.floor(Date.now() / 1000).toString(16);
        const random = 'xxxxxxxxxxxxxxxx'.replace(/[x]/g, () =>
            Math.floor(Math.random() * 16).toString(16),
        );
        return timestamp + random;
    }


    const [aiChoice, setAiChoice] = useState<string>(aiModelsAPI[0]);
    const [currentConvId] = useState(() => generateObjectIdLike());
    const userId = generateObjectIdLike();


    const handleClicSendUserInput = async () => {
        if (!userQuestionInput.trim()) return;

        setLoading(true);
        setResponse('');
        setUserInput('');

        const res = await fetch(`/api/models/${aiChoice}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                prompt: userQuestionInput,
                model: aiChoice.toUpperCase(),
                userId: userId,
                fullConvId: currentConvId,
            }),
        });

        const data = await res.json();
        setResponse(data.response);
        setPromptLeft(promptLeft - 1);
        setLoading(false);
    };

    return (
        <Fragment>
            <div className="fixed top-4 left-1">
                <select
                    className="block appearance-none w-full bg-gray-100 border border-gray-300 hover:border-gray-400 px-3 py-2 pr-8 rounded leading-tight focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent text-gray-700"
                    value={aiChoice}
                    onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setAiChoice(e.target.value)}
                >
                    {aiModelsAPI.map((model) => (
                        <option key={model} value={model}>
                            {model}
                        </option>
                    ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-600">
                    <svg className="fill-current h-4 w-4" viewBox="0 0 20 20">
                        <path d="M5.293 7.293l4.292 4.292 4.292-4.292 1.414 1.414L9.999 14.414l-5.707-5.707z" />
                    </svg>
                </div>
            </div>

            <div className="fixed top-4 right-4">
                <input
                    type="text"
                    value={`${promptLeft} / 100`}
                    readOnly
                    tabIndex={-1}
                    className="w-28 text-center px-3 py-1 border border-gray-300 rounded-md bg-white text-sm text-gray-700 shadow-md pointer-events-none"
                />
            </div>

            {/* Main Chat Container */}
            <div className="min-h-screen w-full bg-gradient-to-br from-gray-500 to-gray-800  flex items-center justify-center px-4">
                <div className="w-full max-w-xl bg-white rounded-3xl shadow-xl p-6 flex flex-col gap-6">
                    {/* Response box */}
                    {response && (
                        <div className="flex items-start gap-3">
                            <div className="bg-gray-100 text-gray-800 px-4 py-2 rounded-xl shadow-sm ">{response}</div>
                        </div>
                    )}

                    {loading && <div className="text-sm text-gray-500 animate-pulse">Réponse en cours...</div>}

                    {/* User input */}
                    <div className="flex gap-2">
            <textarea
                placeholder="Pose ta question..."
                value={userQuestionInput}
                onChange={(e) => setUserInput(e.target.value)}
                onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleClicSendUserInput();
                    }
                }}
                className="flex-1 resize-none px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm text-gray-800"
                rows={2}
            />
                        <button
                            onClick={handleClicSendUserInput}
                            disabled={loading || !userQuestionInput.trim()}
                            className={`w-24 px-4 py-2 rounded-xl text-white font-semibold text-sm transition 
              ${
                                loading || !userQuestionInput.trim()
                                    ? 'bg-gray-400 cursor-not-allowed'
                                    : 'bg-blue-500 hover:bg-blue-600'
                            }`}
                        >
                            {loading ? '...' : 'Envoyer'}
                        </button>
                    </div>
                </div>
            </div>
        </Fragment>
    );
}
