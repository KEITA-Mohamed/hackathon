'use client'
import './input.scss'
import { useState, useEffect } from 'react';

export default function Input () {
    const [userInput, setUserInput] = useState("");
    const [response, setResponse] = useState("");
    const [loading, setLoading] = useState(false);
    const [promptLeft, setPromptLeft] = useState(100);
    // const aiModelsAPI = ["mistral", "03", "04", "deepseek"];
    const aiModelsAPI = ["mistral", "03", "04", "deepseek"];
    const [aiChoiceNumb, setAiChoiceNumb] = useState<number>(0);

    useEffect(() => {}, []);

    const handleClicSendUserInput = async () => {
        if (!userInput.trim()) return;
        console.log('la');
        
        setLoading(true);
        setResponse("");
        setUserInput("");
        const res = await fetch(`/api/${aiModelsAPI[`${aiChoiceNumb}`]}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ prompt: userInput }),
        });

        const data = await res.json();
        setResponse(data.response);
        // todo passer en
        setPromptLeft(promptLeft - 1);
        setLoading(false);
    };

    const [model, setModel] = useState("");

    function changeModel(wichModel: string, index: number) {
        setModel(wichModel)  
        setAiChoiceNumb(index)      
    }

    return (
        <div id='prompt-container'>
            {/* Response box */}
            {response && (
                <div className="flex items-start gap-3">
                    <div className="bg-gray-100 text-gray-800 px-4 py-2 rounded-xl shadow-sm ">{response}</div>
                </div>
            )}

            {loading && <div className="text-sm text-gray-500 animate-pulse">Réponse en cours...</div>}
            <div id='select-container'>
                <button onClick={() => changeModel('mistral', 0)} className={`model-btn ${model === 'mistral' ? 'active-model' : ''}`}>Mistral</button>
                <button onClick={() => changeModel('01', 1)} className={`model-btn ${model === '01' ? 'active-model' : ''}`}>01</button>
                <button onClick={() => changeModel('04', 2)} className={`model-btn ${model === '04' ? 'active-model' : ''}`}>04</button>
                <button onClick={() => changeModel('V4', 3)} className={`model-btn ${model === 'V4' ? 'active-model' : ''}`}>V0</button>
            </div>
            <div id='input-container'>
                <input 
                    placeholder="Sélectionnez un modèle 👆, puis entrer votre prompt ici." 
                    type="text"
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
                    {loading ? "..." : <img src="./send.svg" alt="" />}                    
				</button>                
            </div>
        </div>
    )
}