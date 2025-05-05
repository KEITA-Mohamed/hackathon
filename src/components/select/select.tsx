
'use client'
import './select.scss'
import { useState } from 'react';
import Image from 'next/image'

export default function Select () {
    const [isOpenModel, setIsOpenModel] = useState<boolean>(false);
    const [modelValue, setModelValue] = useState<string>('...');
    function toggleModelState() {
        setIsOpenModel(!isOpenModel);
        console.log(modelValue);    
    } 

    return (
        <div className='select' id='select-model'>
            <h4>Select model</h4>
            <p onClick={toggleModelState}>{ modelValue.toLowerCase() } <Image width={25} height={25} className={`${isOpenModel ? "rotate" : ""}`} src="./drop_down.svg" alt="" /></p>
            <ul className={`${isOpenModel ? "open" : ""}`}                    >
                <li className={`${modelValue == "MISTRAL" ? "active" : ""}`} onClick={()=>{setModelValue('MISTRAL')}}>Mistral</li>
                <li className={`${modelValue == "GEMINI" ? "active" : ""}`} onClick={()=>{setModelValue('GEMINI')}}>Gemini</li>
                <li className={`${modelValue == "O3" ? "active" : ""}`} onClick={()=>{setModelValue('O3')}}>O3</li>
                <li className={`${modelValue == "O4" ? "active" : ""}`} onClick={()=>{setModelValue('O4')}}>O4</li>
                <li className={`${modelValue == "DEEPSEEK" ? "active" : ""}`} onClick={()=>{setModelValue('DEEPSEEK')}}>Deepseek</li>
            </ul>
        </div>
    )
}