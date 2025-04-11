'use client'
import './input.scss'
import {useState, useEffect} from 'react';

export default function Input(props: { userQuestion: Function, iaAnswer: Function }) {
    const [userInput, setUserInput] = useState("");
    const [response, setResponse] = useState("");
    const [loading, setLoading] = useState(false);
    const [promptLeft, setPromptLeft] = useState(100);
    const aiModelsAPI = ["mistral", "gemini", "03", "04", "deepseek"];
    const [aiChoiceNumb, setAiChoiceNumb] = useState<number>(0);
    const [currentModel, setCurrentModel] = useState("mistral");


    useEffect(() => {
    }, []);

    const handleClicSendUserInput = async () => {
        if (!userInput.trim()) return;
        setLoading(true);
        setResponse("");
        setUserInput("");
        sendMessage('UserName', userInput.trim(), true);

        const res = await fetch(`/api/models/${currentModel}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({prompt: userInput}),
        });
        console.log(res)
        const data = await res.json();
        setResponse(data.response);
        setPromptLeft(promptLeft - 1);
        setLoading(false);
        sendMessage(currentModel, data.response, false);
    };


    function changeModel(wichModel: string, index: number) {
        setCurrentModel(wichModel)
        setAiChoiceNumb(index)
    }

    function sendMessage(name: string, text: string, user: boolean) {
        const data = {
            name: name,
            text: text,
            user: user
        }
        user ? props.userQuestion(data) : props.iaAnswer(data);
    }

    return (
        <div id='prompt-container'>
            {/* {response && (
                <div className="flex items-start gap-3">
                    <div className="bg-gray-100 text-gray-800 px-4 py-2 rounded-xl shadow-sm ">{response}</div>
                </div>
            )} */}

            {/* {loading && <div className="text-sm text-gray-500 animate-pulse">Réponse en cours...</div>} */}
            <div id='select-container'>
                {
                    aiModelsAPI.map((model) => {
                        return (
                            <button key={model} onClick={() => changeModel(model, 0)}
                                    className={`model-btn ${currentModel === model ? 'active-model' : ''}`}>{model}</button>
                        )
                    })
                }
            </div>
            <div id='input-container'>
                <input
                    placeholder="Sélectionnez un modèle 👆, puis entrer votre prompt ici."
                    type="text"
                    value={userInput}
                    onChange={(e) => setUserInput(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                            e.preventDefault();
                            handleClicSendUserInput();
                        }
                    }}
                />
                <button
                    onClick={handleClicSendUserInput}
                    disabled={loading || !userInput.trim()}
                    className={`${loading || !userInput.trim() ? "bg-gray-400 cursor-not-allowed" : "bg-blue-500 hover:bg-blue-600"}`}
                >
                    {loading ? "..." : <img src="./send.svg" alt=""/>}
                </button>
            </div>
        </div>
    )
}
