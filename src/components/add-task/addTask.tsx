"use client"

import './addTask.scss';
import type React from "react"
import { useState } from "react"
// import { useState } from "react"

export default function AddTask() {  
    const [formData, setFormData] = useState({
        taskName: "",
        taskDecription: "",
    })  
    const [errors, setErrors] = useState<Record<string, string>>({})

    
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target
        setFormData((prev) => ({ ...prev, [name]: value }))
        console.log(formData);
        

        if (errors[name]) {
            setErrors((prev) => ({ ...prev, [name]: "" }))
        }
    }

    return (
        <div className='form-container'>
            <div className='field-container'>
                <h2>Nom de la tâche</h2>
                <input
                    id="task-name"
                    name="taskName"
                    placeholder="Entrez le nom de la tâche" 
                    onChange={handleChange}  
                    value={formData.taskName}
                    aria-invalid={!!errors.taskName}
                    aria-describedby={errors.taskName ? "taskName-error" : undefined}                     
                />
                {errors.taskName && (
                    <p id="taskName-error">
                        {errors.taskName}
                    </p>
                )}
            </div>

            <div className='field-container'>
                <h2>Description</h2>
                <textarea
                    id="task-description"
                    name="taskDecription"
                    placeholder="Description de la tâche" 
                    rows="8"
                    onChange={handleChange} 
                    value={formData.taskDecription}
                    aria-invalid={!!errors.taskDecription}
                    aria-describedby={errors.taskDecription ? "taskDescription-error" : undefined}                                                              
                />
                {errors.taskDescription && (
                    <p id="taskDescription-error">
                        {errors.taskDescription}
                    </p>
                )}
            </div>                        
        </div>
    )
}
