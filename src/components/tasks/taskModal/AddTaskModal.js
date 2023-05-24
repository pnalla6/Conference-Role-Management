import React from 'react';
import './AddTaskModal.css';

function AddTaskModal(props) {
    return (
        <div className='TaskModal' onClick={() => (props.onClose() ? props.onClose() : '')}>
            <div className='TaskModal_content' onClick={(e) => { e.stopPropagation() }}>
                {props.children}
            </div>

        </div>
    )
}

export default AddTaskModal