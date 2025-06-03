export default function searchItems(list: HTMLLIElement[], value: string) {                  
    list.forEach(li => {  
        if (li.classList.contains('selected')) {                
            if (li.dataset['search']?.includes(value)) {                                
                li.classList.remove('hide');          
            }
            else{
                li.classList.add('hide');
            }                                
        }                      
    });  
}