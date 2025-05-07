'use client'
import './archive.scss'
import { useRef } from 'react';
import Link from 'next/link'
import Image from 'next/image'
import { useSignals} from '@preact/signals-react/runtime';
import {
    isOpenFilters,
    isOpenModel,
    isOpenDate,
    model,
    date,
    search,
    items
} from '@/signals/filtersSignals';
import { Signal } from '@preact/signals-react';

export default function Archive ({ wichPage }: {wichPage: string}) { 
    useSignals();    
    const listRef= useRef<HTMLLIElement[]>([]); 

    function openFilters( filterState: Signal<boolean> ) {
        filterState.value = !filterState.value;                
    }

    function openSelect( selectState: Signal<boolean>, closeSelect: Signal<boolean> ) {
        selectState.value = !selectState.value;
        closeSelect.value = false;
    }

    function searchbarFilter( search: Signal<string>, event: React.ChangeEvent<HTMLInputElement> ) {
        search.value = event.target.value.toUpperCase();
        searchChatList(listRef.current, search.value);  
    }

    function closeSelects (modelSelect: Signal<boolean>, dateSelect: Signal<boolean>,) {
        modelSelect.value =  dateSelect.value = false;
    }

    function selectFilter( select: Signal<string>, field: string, value: string ) {
        if (value === select.value) {            
            select.value = '...';
            filterChatList(listRef.current, field, '');  
        }
        else{
            select.value = value;
            filterChatList(listRef.current, field, select.value);  
        }
    }

    function searchChatList(list: HTMLLIElement[], value: string) {    
        console.log(value);
              
        list.forEach(li => {  
            if (li.classList.contains('selected')) {                
                if (li.dataset['search']?.includes(value)) {                                
                    li.classList.add('selected');          
                }
                else{
                    li.classList.remove('selected');
                }
    
                if(value === ''){
                    li.classList.add('selected');          
                }                
            }   
        });  
    }
    
    function filterChatList(list: HTMLLIElement[], field: string, value: string) {          
        list.forEach(li => {     
            
            if (li.dataset[field]?.includes(value)) {                                
                li.classList.add('selected');          
            }
            else{
                li.classList.remove('selected');
            }

            if(value === ''){
                li.classList.add('selected');          
            }                
        });  
    }

    return (
        <section>
            <div id='chat-list'>
                <h3 className='gradient'>Conversations archivés</h3>
                <div id='filters'>
                    <h4 onClick={()=>{openFilters(isOpenFilters)}} className={`${isOpenFilters.value ? "open-filters-button" : ""}`}>Filtres</h4>
                    <div id='filters-container' className={`${isOpenFilters.value ? "open-filters" : "close-filters"}`}>
                        <input onClick={()=>{closeSelects(isOpenModel, isOpenDate)}} onInput={(event)=>{searchbarFilter(search, event as React.ChangeEvent<HTMLInputElement>)}} type="text" placeholder='Rechercher une discussion'/>
                        <div id='history-select-container'>
                            <div className='select' id='select-model'>
                                <h5>Select model</h5>
                                <p onClick={()=>{openSelect(isOpenModel, isOpenDate)}}>{ model.value.toLowerCase() } <Image width={25} height={25} className={`${isOpenModel.value ? "rotate" : ""}`} src="./drop_down.svg" alt="" /></p>
                                <ul className={`${isOpenModel.value ? "open" : "close"}`}                    >
                                    <li className={`${model.value == "MISTRAL" ? "active" : ""}`} onClick={()=>{selectFilter(model, 'model', 'MISTRAL')}}>Mistral</li>
                                    <li className={`${model.value == "GEMINI" ? "active" : ""}`} onClick={()=>{selectFilter(model, 'model', 'GEMINI')}}>Gemini</li>
                                    <li className={`${model.value == "O3" ? "active" : ""}`} onClick={()=>{selectFilter(model, 'model', 'O3')}}>O3</li>
                                    <li className={`${model.value == "O4" ? "active" : ""}`} onClick={()=>{selectFilter(model, 'model', 'O4')}}>O4</li>
                                    <li className={`${model.value == "DEEPSEEK" ? "active" : ""}`} onClick={()=>{selectFilter(model, 'model', 'DEEPSEEK')}}>Deepseek</li>
                                </ul>
                            </div>

                            <div className='select' id='select-date'>
                                <h5>Select date</h5>
                                <p onClick={()=>{openSelect(isOpenDate, isOpenModel)}}>{ date.value.toLowerCase() } <Image width={25} height={25} className={`${isOpenDate.value ? "rotate" : ""}`} src="./drop_down.svg" alt="" /></p>
                                <ul className={`${isOpenDate.value ? "open" : "close"}`}                    >
                                    <li className={`${date.value == "LUNDI" ? "active" : ""}`} onClick={()=>{selectFilter(date, 'date', 'LUNDI')}}>Lundi</li>
                                    <li className={`${date.value == "MARDI" ? "active" : ""}`} onClick={()=>{selectFilter(date, 'date', 'MARDI')}}>Mardi</li>
                                    <li className={`${date.value == "MERCREDI" ? "active" : ""}`} onClick={()=>{selectFilter(date, 'date', 'MERCREDI')}}>Mercredi</li>
                                    <li className={`${date.value == "JEUDI" ? "active" : ""}`} onClick={()=>{selectFilter(date, 'date', 'JEUDI')}}>Jeudi</li>
                                    <li className={`${date.value == "VENDREDI" ? "active" : ""}`} onClick={()=>{selectFilter(date, 'date', 'VENDREDI')}}>Vendredi</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>

                <ul>
                    {                            
                        items.value.map( ( item, index ) =>
                        <li ref={ (element: HTMLLIElement) => listRef.current[index] = element } key={ index } className='chat-list-item selected' data-model={item.model} data-date={item.date.toUpperCase()} data-search={item.title.toUpperCase() + ", " + item.model}>
                            <Link href="/history">
                                { item.title }
                                <span><span className='model-name'>{ item.model.toLowerCase() }</span>- {item.date} - 12 messages - 12 crédits utilisés</span>
                            </Link>
                        </li>)  
                        
                    }                    
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
