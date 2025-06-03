'use client'
import './archive.scss'
import { useRef } from 'react';
import Link from 'next/link'
import { useSignals} from '@preact/signals-react/runtime';
import {
    isOpenFilters,
    modelFilters,
    dateFilters,
    filtersValues,
    model,
    date,
    search,
    items
} from '@/signals/filtersSignals';
import { Signal } from '@preact/signals-react';
import searchItems from '../../services/search.service';
import Select from '../select/select';

export default function Archive ({ wichPage }: {wichPage: string}) { 
    useSignals();    
    const listRef= useRef<HTMLLIElement[]>([]);    

    function openFilters( filterState: Signal<boolean> ) {
        filterState.value = !filterState.value;                
    }

    function searchbarFilter( search: Signal<string>, event: React.ChangeEvent<HTMLInputElement> ) {
        search.value = event.target.value.toUpperCase();
        searchItems(listRef.current, search.value);  
    }
    
    return (
        <section>
            <div id='chat-list'>
                <h3 className='gradient'>Conversations archivés</h3>
                <div id='filters'>
                    <h4 onClick={()=>{openFilters(isOpenFilters)}} className={`${isOpenFilters.value ? "open-filters-button" : ""}`}>Filtres</h4>
                    <div id='filters-container' className={`${isOpenFilters.value ? "open-filters" : "close-filters"}`}>
                        <input onInput={(event)=>{searchbarFilter(search, event as React.ChangeEvent<HTMLInputElement>)}} type="text" placeholder='Rechercher une discussion'/>
                        <div id='history-select-container'>
                            <Select name='model' filter={ model } filterName='model' filterList={ modelFilters } itemsList={ listRef }/>
                            <Select name='date' filter={ date } filterName='date' filterList={ dateFilters } itemsList={ listRef }/>                          
                        </div>
                    </div>
                </div>

                <ul>
                    {                            
                        items.value.map( ( item, index ) =>
                        <li ref={ (element: HTMLLIElement) => listRef.current[index] = element } key={ index } className='chat-list-item selected' data-model={item.model} data-date={item.date.toUpperCase()} data-search={item.title.toUpperCase() + ", " + item.model}>
                            <Link href="/history">
                                { item.title }
                                <span><span className='model-name'>{ item.model.toLowerCase() }</span>- {item.date.toLowerCase()} - 12 messages - 12 crédits utilisés</span>
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
