export function dismissModal(modal: HTMLDivElement | null) {
    if (modal) modal.style.opacity = '0';  
    setTimeout(()=>{
        if (modal) modal.style.display = 'none'; 
        if (modal) modal.style.zIndex = '-1';                       
    }, 300)
}

export function openModal(modal: HTMLDivElement | null) {        
    if (modal) {
        modal.style.zIndex = '10000000';
        modal.style.display = 'flex';  
        setTimeout(()=>{
            if (modal) modal.style.opacity = '1';
        }, 0) 
    }
}