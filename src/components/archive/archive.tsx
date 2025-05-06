'use client'
import './archive.scss'
import { Dispatch, MutableRefObject, SetStateAction, useRef, useState } from 'react';
import Link from 'next/link'
import Image from 'next/image'

export default function Archive ({ wichPage }: {wichPage: string}) { 
    const [isOpenFilters, setIsOpenFilters] = useState<boolean>(false);
    const [isOpenModel, setIsOpenModel] = useState<boolean>(false);
    const [isOpenDate, setIsOpenDate] = useState<boolean>(false);
    const [modelValue, setModelValue] = useState<string>('...');
    const [dateValue, setDateValue] = useState<string>('...');
    const [searchValue, setSearchValue] = useState<string>('...');
    const [ items, setItems] = useState([{title: "Maison", model: 'MISTRAL'}, {title: "Chaussure", model: 'GEMINI'}, {title: "Fourchette", model: 'O3'}]);
    const listRef= useRef<HTMLLIElement[]>([]); 

    function openSelect(
        setSelectState: Dispatch<SetStateAction<boolean>>, 
        selectState: boolean, 
        closeSelect: Dispatch<SetStateAction<boolean>>
    ) {
        setSelectState(!selectState);
        closeSelect(false);
    }

    function openFilters(
        setFiltersState: Dispatch<SetStateAction<boolean>>, 
        filterState: boolean, 
    ) {
        setFiltersState(!filterState);        
    }

    function searchbarFilter(event: React.ChangeEvent<HTMLInputElement>) {
        setSearchValue(event.target.value);
        const searchValue = event.target.value.toUpperCase();
        filterChatList(listRef.current, searchValue);  
    }

    function selectFilter(setState: Dispatch<SetStateAction<string>>, state: string, value: string) {
        if (value === state) {            
            setState('...')
            filterChatList(listRef.current, '');  
        }
        else{
            setState(value);
            filterChatList(listRef.current, value);  
        }
    }
    
    function filterChatList(list: HTMLLIElement[], value: string) {
        list.forEach(li => {
            if (li.textContent?.toUpperCase().includes(value)) {                
                li.classList.add('selected');          
            }
            else{
                li.classList.remove('selected');
            }
        });  
    }

    return (
        <section>
            <div id='chat-list'>
                <h3 className='gradient'>Conversations archivés</h3>
                <div id='filters'>
                    <h4 onClick={()=>{openFilters(setIsOpenFilters, isOpenFilters)}} className={`${isOpenFilters ? "open-filters-button" : ""}`}>Filtres</h4>
                    <div id='filters-container' className={`${isOpenFilters ? "open-filters" : "close-filters"}`}>
                        <input onInput={searchbarFilter} type="text" placeholder='Rechercher une discussion'/>
                        <div id='history-select-container'>
                            <div className='select' id='select-model'>
                                <h5>Select model</h5>
                                <p onClick={()=>{openSelect(setIsOpenModel, isOpenModel, setIsOpenDate)}}>{ modelValue.toLowerCase() } <Image width={25} height={25} className={`${isOpenModel ? "rotate" : ""}`} src="./drop_down.svg" alt="" /></p>
                                <ul className={`${isOpenModel ? "open" : "close"}`}                    >
                                    <li className={`${modelValue == "MISTRAL" ? "active" : ""}`} onClick={()=>{selectFilter(setModelValue, modelValue, 'MISTRAL')}}>Mistral</li>
                                    <li className={`${modelValue == "GEMINI" ? "active" : ""}`} onClick={()=>{selectFilter(setModelValue, modelValue, 'GEMINI')}}>Gemini</li>
                                    <li className={`${modelValue == "O3" ? "active" : ""}`} onClick={()=>{selectFilter(setModelValue, modelValue, 'O3')}}>O3</li>
                                    <li className={`${modelValue == "O4" ? "active" : ""}`} onClick={()=>{selectFilter(setModelValue, modelValue, 'O4')}}>O4</li>
                                    <li className={`${modelValue == "DEEPSEEK" ? "active" : ""}`} onClick={()=>{selectFilter(setModelValue, modelValue, 'DEEPSEEK')}}>Deepseek</li>
                                </ul>
                            </div>

                            <div className='select' id='select-date'>
                                <h5>Select date</h5>
                                <p onClick={()=>{openSelect(setIsOpenDate, isOpenDate, setIsOpenModel)}}>{ dateValue.toLowerCase() } <Image width={25} height={25} className={`${isOpenDate ? "rotate" : ""}`} src="./drop_down.svg" alt="" /></p>
                                <ul className={`${isOpenDate ? "open" : "close"}`}                    >
                                    <li className={`${dateValue == "LUNDI" ? "active" : ""}`} onClick={()=>{selectFilter(setDateValue, dateValue, 'LUNDI')}}>Lundi</li>
                                    <li className={`${dateValue == "MARDI" ? "active" : ""}`} onClick={()=>{selectFilter(setDateValue, dateValue, 'MARDI')}}>Mardi</li>
                                    <li className={`${dateValue == "MERCREDI" ? "active" : ""}`} onClick={()=>{selectFilter(setDateValue, dateValue, 'MERCREDI')}}>Mercredi</li>
                                    <li className={`${dateValue == "JEUDI" ? "active" : ""}`} onClick={()=>{selectFilter(setDateValue, dateValue, 'JEUDI')}}>Jeudi</li>
                                    <li className={`${dateValue == "VENDREDI" ? "active" : ""}`} onClick={()=>{selectFilter(setDateValue, dateValue, 'VENDREDI')}}>Vendredi</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>

                <ul>
                    {                            
                        items.map( ( item, index ) =>
                        <li ref={ (element: HTMLLIElement) => listRef.current[index] = element } key={ index } className='chat-list-item selected'>
                            <Link href="/history">
                                { item.title }
                                <span><span className='model-name'>{ item.model.toLowerCase() }</span> - 12 messages - 12 crédits utilisés</span>
                            </Link>
                        </li>)  
                        
                    }
                    {/* <li id='1' className='chat-list-item'>
                        <Link href="/history">
                            Conversation du 07/01/25
                            <span>12 messages - 12 crédits utilisés</span>
                        </Link>
                    </li>
                    <li id='2' className='chat-list-item'>
                        <Link href="/history">                        
                            Conversation du 08/01/25
                            <span>19 messages - 19 crédits utilisés</span>
                        </Link>
                    </li> */}
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