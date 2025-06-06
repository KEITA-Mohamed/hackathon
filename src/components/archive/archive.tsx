'use client'
import './archive.scss'
import { useRef } from 'react';
import Link from 'next/link'
import { useSignals} from '@preact/signals-react/runtime';
import {
    isOpenFilters,
    modelFilters,
    dateFilters,
    model,
    date,
    search,
    convs,
    currentChat
} from '@/signals/filtersSignals';
import { currentModel } from '@/signals/chatSignals';
import { Signal } from '@preact/signals-react';
import searchItems from '../../services/search.service';
import Select from '../select/select';
import getTime from '../../services/getTime.service';

export default function Archive () { 
    useSignals();    
    const listRef= useRef<HTMLLIElement[]>([]);   
    const [currentDate, currentTime] = getTime();
 
    function openFilters( filterState: Signal<boolean> ) {
        filterState.value = !filterState.value;                
    }

    function searchbarFilter( search: Signal<string>, event: React.ChangeEvent<HTMLInputElement> ) {
        search.value = event.target.value.toUpperCase();
        searchItems(listRef.current, search.value);  
    }
    
    function addConv() {
        convs.value = [...convs.value, {title: "Nouveau chat", model: currentModel.value, date: currentDate}]
    }

    return (
        <section>
            <div id='chat-list'>
                <h3 className='gradient'>Chat</h3>
                <div id='filters'>
                    <h4 onClick={()=>{openFilters(isOpenFilters)}} className={`${isOpenFilters.value ? "open-filters-button" : ""}`}>Rechercher un chat</h4>
                    <div id='filters-container' className={`${isOpenFilters.value ? "open-filters" : "close-filters"}`}>
                        <input onInput={(event)=>{searchbarFilter(search, event as React.ChangeEvent<HTMLInputElement>)}} type="text" placeholder='...'/>
                        <div id='history-select-container'>
                            <Select name='Model' filter={ model } filterName='model' filterList={ modelFilters } itemsList={ listRef }/>
                            <Select name='Date' filter={ date } filterName='date' filterList={ dateFilters } itemsList={ listRef }/>                          
                        </div>
                    </div>
                </div>

                <ul>
                    {                            
                        convs.value.map( ( conv, index ) =>
                        <li onClick={()=>{currentChat.value = index}} ref={ (element: HTMLLIElement) => listRef.current[index] = element } key={ index } className={`chat-list-item selected ${currentChat.value === index ? "active" : ""}`} data-model={conv.model} data-date={conv.date.toUpperCase()} data-search={conv.title.toUpperCase() + ", " + conv.model}>
                            <Link href="/chat">
                                { conv.title }
                                <span className='chat-info'><span className='model-name'>Model &#62; { conv.model.toLowerCase() }</span> - Date &#62; {conv.date.toLowerCase()}</span>
                            </Link>
                        </li>)  
                        
                    }                    
                </ul>
                <button id='current-chat'onClick={addConv}>
                    <Link href="/chat">
                        Nouveau chat
                    </Link>
                </button>
            </div>
        </section>
    )
}
