import { Signal } from "@preact/signals-react";
export default function filterItems(elmnt: HTMLElement, field: string, count: number, filters: Signal[], filtersName: string[], last_filter: string, last_filter_value: Signal<string>) {						
    if (count < filters.length) {	        
        if(filters[count].value !== "..." && filters[count].value == elmnt.dataset[filtersName[count]].toUpperCase()){						
            elmnt.classList.add('selected');	                    
            next();								
        }  
                          
        if(filters[count].value !== "..." && filters[count].value !== elmnt.dataset[field].toUpperCase()) {
            elmnt.classList.remove('selected');	
            if (filtersName[count] === last_filter) {					
                if(elmnt.dataset[last_filter] == last_filter_value.value.toUpperCase()){
                    elmnt.classList.add('selected');
                }
                else{
                    elmnt.classList.remove('selected');	
                }
            }
            return;						
        }
                        
        if(filters[count].value === '...'){	 
            elmnt.classList.add('selected');	                                       
            next();					
        }	
        return count;
    }
    
    function next() {
        if (filtersName[count] === last_filter) {					
            return;
        }
        else{
            count++;
            filterItems(elmnt, field, count, filters, filtersName, last_filter, last_filter_value);
        }
    }
}