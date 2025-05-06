'use client'
import './archive.scss'
import { useState } from 'react';
import Link from 'next/link'
import Image from 'next/image'

export default function Archive ({ wichPage }: {wichPage: string}) { 
    const [isOpenFilters, setIsOpenFilters] = useState<boolean>();
    const [isOpenModel, setIsOpenModel] = useState<boolean>();
    const [isOpenDate, setIsOpenDate] = useState<boolean>();
    const [modelValue, setModelValue] = useState<string>('...');
    const [dateValue, setDateValue] = useState<string>('...');
    const [searchValue, setSearchValue] = useState<string>('...');

    function toggleModelState() {
        setIsOpenModel(!isOpenModel);
    } 
    
    function toggleDateState() {
        setIsOpenDate(!isOpenDate);
    } 

    function openFilters() {
        setIsOpenFilters(!isOpenFilters);        
    }

    function getSearchValue(event: React.ChangeEvent<HTMLInputElement>) {
        setSearchValue(event.target.value);
    }

    return (
        <section>
            <div id='chat-list'>
                <h3 className='gradient'>Conversations archivés</h3>
                <div id='filters'>
                    <h4 onClick={openFilters} className={`${isOpenFilters ? "open-filters-button" : ""}`}>Filtres</h4>
                    <div id='filters-container' className={`${isOpenFilters ? "open-filters" : "close-filters"}`}>
                        <input onInput={getSearchValue} type="text" placeholder='Rechercher une discussion'/>
                        <div id='history-select-container'>
                            <div className='select' id='select-model'>
                                <h5>Select model</h5>
                                <p onClick={toggleModelState}>{ modelValue.toLowerCase() } <Image width={25} height={25} className={`${isOpenModel ? "rotate" : ""}`} src="./drop_down.svg" alt="" /></p>
                                <ul className={`${isOpenModel ? "open" : "close"}`}                    >
                                    <li className={`${modelValue == "MISTRAL" ? "active" : ""}`} onClick={()=>{setModelValue('MISTRAL')}}>Mistral</li>
                                    <li className={`${modelValue == "GEMINI" ? "active" : ""}`} onClick={()=>{setModelValue('GEMINI')}}>Gemini</li>
                                    <li className={`${modelValue == "O3" ? "active" : ""}`} onClick={()=>{setModelValue('O3')}}>O3</li>
                                    <li className={`${modelValue == "O4" ? "active" : ""}`} onClick={()=>{setModelValue('O4')}}>O4</li>
                                    <li className={`${modelValue == "DEEPSEEK" ? "active" : ""}`} onClick={()=>{setModelValue('DEEPSEEK')}}>Deepseek</li>
                                </ul>
                            </div>

                            <div className='select' id='select-date'>
                                <h5>Select date</h5>
                                <p onClick={toggleDateState}>{ dateValue.toLowerCase() } <Image width={25} height={25} className={`${isOpenDate ? "rotate" : ""}`} src="./drop_down.svg" alt="" /></p>
                                <ul className={`${isOpenDate ? "open" : "close"}`}                    >
                                    <li className={`${dateValue == "LUNDI" ? "active" : ""}`} onClick={()=>{setDateValue('LUNDI')}}>Lundi</li>
                                    <li className={`${dateValue == "MARDI" ? "active" : ""}`} onClick={()=>{setDateValue('MARDI')}}>Mardi</li>
                                    <li className={`${dateValue == "MERCREDI" ? "active" : ""}`} onClick={()=>{setDateValue('MERCREDI')}}>Mercredi</li>
                                    <li className={`${dateValue == "JEUDI" ? "active" : ""}`} onClick={()=>{setDateValue('JEUDI')}}>Jeudi</li>
                                    <li className={`${dateValue == "VENDREDI" ? "active" : ""}`} onClick={()=>{setDateValue('VENDREDI')}}>Vendredi</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>

                <ul>
                    <li id='1'>
                        <Link href="/history">
                            Conversation du 07/01/25
                            <span>12 messages - 12 crédits utilisés</span>
                        </Link>
                    </li>
                    <li id='2'>
                        <Link href="/history">                        
                            Conversation du 08/01/25
                            <span>19 messages - 19 crédits utilisés</span>
                        </Link>
                    </li>
                </ul>
            </div>

            { wichPage === "history" &&
                <button id='current-chat'>
                    <Link href="/chat">
                        Chat actuel
                        <span>8 messages</span>
                    </Link>
                </button>
            }
        </section>
    )
}
