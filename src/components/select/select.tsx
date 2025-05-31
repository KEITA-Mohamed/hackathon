
'use client';
import './select.scss';
import Image from 'next/image';
import { useSignals} from '@preact/signals-react/runtime';
import {
    Filters,
    model,  
    date
} from '@/signals/filtersSignals';
import { Signal } from '@preact/signals-react';
import filterItems from '../../services/filter.service';
import { MutableRefObject, useState } from 'react';

export default function Select (props: {name: string, filter: Signal<string>, filterName: string, filterList: Signal<Filters[]>, itemsList: MutableRefObject<HTMLLIElement[]>}) {
    useSignals();   
    const [isOpen, setIsOpen] = useState(false);

    function selectFilter( select: Signal<string>, field: string, value: string ) {
        if (value === select.value) {            
            select.value = '...';
            filterChatList(props.itemsList.current, field);  
        }
        else{            
            select.value = value;
            filterChatList(props.itemsList.current, field);  
        }
    }

    function filterChatList(list: HTMLLIElement[], field: string) {                   
        list.forEach(li => {                                
            const count: number = 0;	
            const filters = [model, date];
            const filtersName = ["model", "date"];
            const last_filter_value = filters[filters.length - 1];  
            const last_filter = filtersName[filtersName.length - 1];  
            filterItems(li, field, count, filters, filtersName, last_filter, last_filter_value);
        });        
    }

    return (
        <div className='select'>
            <h5>{ props.name }</h5>
            <p onClick={()=>{ setIsOpen(!isOpen) }}>{ props.filter.value.toLowerCase() } <Image width={25} height={25} className={`${isOpen ? "rotate" : ""}`} src="./drop_down.svg" alt="" /></p>
            <ul className={`${isOpen ? "open" : "close"}`}>
                {                        
                    props.filterList.value.map(element => <li className={`${props.filter.value == element.value ? "active" : ""}`} onClick={()=>{selectFilter(props.filter, props.filterName, element.value)}} key={element.name}>{ element.name }</li> )
                }                    
            </ul>
        </div>
    )
}