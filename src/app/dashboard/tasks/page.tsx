'use client';

import './style.scss'
import DashboardHeader from "@/components/dashboard-header/DashboardHeader";
import TaskList from "@/components/task-list/TaskList";
import Modal from "@/components/modal/modal";
import { useSignals } from '@preact/signals-react/runtime';
// For modal ------------------------------------
import { isOpen, confirm } from '@/signals/modalSignals';
import { effect } from "@preact/signals-react";
// ----------------------------------------------

export default function Dashboard () { 
    useSignals();
    // For modal ------------------------------------
    function openModal() {        
        isOpen.value = true;
    }
    
    effect(()=>{
        console.log('page', confirm.value);   
    })
    // ----------------------------------------------

    return (
        <div id="main-container">
            <DashboardHeader />
            <div id='task-lists-container'>
                <div className='task-list'>
                    <header>
                        <h1>Tâches</h1>
                    </header>
                    <TaskList />
                    <button onClick={ openModal }>                        
                        <p>
                            Ajouter une tache
                        </p>
                    </button>
                </div>                
            </div>   
            <Modal>
                <div className='field-container'>Children content</div>
            </Modal>         
        </div>
    )
}