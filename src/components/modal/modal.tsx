'use client'
import './modal.scss';
import { useRef } from 'react';
import { dismissModal, openModal } from '../../services/modal.service';
import { effect } from "@preact/signals-react";
import { useSignals } from '@preact/signals-react/runtime';
import { isOpen, confirm } from '@/signals/modalSignals';

export default function Modal ({ children }) {
    useSignals();
    const modal = useRef<HTMLDivElement>(null);
    
    effect(()=>{        
        if (isOpen.value === true) {
            openModal(modal.current);
            confirm.value = false;
        }  
    })

    function closeModal(confirmValue: boolean) {
        dismissModal(modal.current);
        isOpen.value = false; 
        confirm.value = confirmValue;
    }

    return (
        <div className='modal' ref={modal}>
            <div className='modal-background' onClick={ () => { closeModal(false) }}></div>
            <div className='modal-content'>
                <header>
                    <h1>Test</h1>
                </header>

                {/* <form action=""> */}
                    <div className='content-container'>
                        {children}
                    </div>

                    <footer>
                        <button onClick={ () => { closeModal(true) }}>
                            Valider
                        </button>
                    </footer>
                {/* </form> */}
            </div>
        </div>    
    );
}