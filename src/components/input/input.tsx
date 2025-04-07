'use client'
import './input.scss'
import { useState } from 'react';
export default function Input () {
    const [model, setModel] = useState("");

    function changeModel(wichModel: string) {
        setModel(wichModel)        
    }

    return (
        <div id='prompt-container'>
            <div id='select-container'>
                <button onClick={() => changeModel('mistral')} className={`model-btn ${model === 'mistral' ? 'active-model' : ''}`}>Mistral</button>
                <button onClick={() => changeModel('01')} className={`model-btn ${model === '01' ? 'active-model' : ''}`}>01</button>
                <button onClick={() => changeModel('04')} className={`model-btn ${model === '04' ? 'active-model' : ''}`}>04</button>
                <button onClick={() => changeModel('V4')} className={`model-btn ${model === 'V4' ? 'active-model' : ''}`}>V0</button>
            </div>
            <div id='input-container'>
                <input placeholder="Sélectionnez un modèle 👆, puis entrer votre prompt ici." type="text" />
            </div>
        </div>
    )
}