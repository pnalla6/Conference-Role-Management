import React, { useState } from 'react';
import './AddNewTask.css';
import { X } from 'react-feather'
import NewCardModal from '../cards/newCardModal/NewCardModal';

function AddNewTask(props) {
    const [showAddNewTask, setShowAddNewTask] = useState(false);
    // const [newTaskTitle, setNewTaskTitle] = useState('');
    return (
        <div className='addNewTask'>

            {showAddNewTask
                ?
                <NewCardModal 
                role_id = {props.role_id}
                addNewTaskToRole={props.addNewTaskToRole} 
                onClose={() => { setShowAddNewTask(false) }}/>
                // <form className='addTaskForm' onSubmit={(e) => { e.preventDefault(); if (props.onSubmit) props.onSubmit(newTaskTitle); }}>
                //     <input value={newTaskTitle} type="text" placeholder={props.placeholder} autoFocus={true} onChange={(e) => { setNewTaskTitle(e.target.value); }} />
                //     <div className='addTaskFormFooter'>
                //         <button type='submit'>{props.buttonText || 'Add'}</button>
                //         <X onClick={() => setShowAddNewTask(false)} />
                //     </div>
                // </form>
                :
                <p className='addTaskButton' style={{ cursor: "pointer" }} onClick={(e) => { e.stopPropagation(); setShowAddNewTask(true);}}>Add New Task</p>
            }
        </div>
    )
}

export default AddNewTask