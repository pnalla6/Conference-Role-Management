import React, { useState } from 'react';
import './AddNewTask.css';
import { X } from 'react-feather'

function AddNewTask(props) {
    const [showAddNewTask, setShowAddNewTask] = useState(false);
    return (
        <div className='addNewTask'>

            {showAddNewTask
                ?
                <form className='addTaskForm' onSubmit={(e) => { e.preventDefault(); if (props.onSubmit) props.onSubmit(); }}>
                    <input type="text" placeholder={props.placeholder} autoFocus={true} />
                    <div className='addTaskFormFooter'>
                        <button type='submit'>{props.buttonText || 'Add'}</button>
                        <X onClick={() => setShowAddNewTask(false)} />
                    </div>
                </form>
                :
                <p className='addTaskButton' style={{cursor:"pointer"}} onClick={() => setShowAddNewTask(true)}>Add Task</p>
            }
        </div>
    )
}

export default AddNewTask