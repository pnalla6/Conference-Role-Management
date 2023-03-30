import React, { useRef } from 'react';
import { Type, List, Calendar, AlertOctagon, AlertTriangle, X } from 'react-feather';
import AddTaskModal from '../../tasks/taskModal/AddTaskModal';
import './NewCardModal.css';

function NewCardModal(props) {
    const taskTitleRef = useRef();
    const taskTypeRef = useRef();
    const taskDescriptionRef = useRef();
    const taskNotesRef = useRef();
    const isFlexibleRef = useRef();
    const hardDeadlineRef = useRef();
    const softDeadlineRef = useRef();

    const handleSaveClick = () => {
        const taskTitle = taskTitleRef.current.value;
        const taskType = taskTypeRef.current.value;
        const taskDescription = taskDescriptionRef.current.value;
        const taskNotes = taskNotesRef.current.value;
        const isFlexible = isFlexibleRef.current.value;
        const hardDeadline = hardDeadlineRef.current.value;
        const softDeadline = softDeadlineRef.current.value;
        const taskCreatedDdate = new Date().toISOString();

        const taskObj = {
            taskTitle,
            taskType,
            taskDescription,
            taskNotes,
            isFlexible,
            hardDeadline,
            softDeadline,
            taskCreatedDdate
        }

        props.addNewTaskToRole(props.role_id, taskObj);
        // console.log('addnewTask', props.role_id);
    };

    return (
        <AddTaskModal onClose={() => { props.onClose() }}>
            <div className='task_top_More'  onClick={(e) => { props.onClose() }}><X /></div>
            <div className='taskInfo'>
                <div className='taskInfo_box'>
                    <div className='taskInfo_box_title'>
                        <Type />
                        <p>Title</p>
                    </div>
                    <div className='taskInfo_box_body'>
                        <input placeholder={'Task Title Here'} ref={taskTitleRef} />
                    </div>
                </div>

                <div className='taskInfo_box'>
                    <div className='taskInfo_box_title'>
                        <Type />
                        <p>Task Type</p>
                    </div>
                    <div className='taskInfo_box_body'>
                        <input placeholder={'Enter Task Type'} ref={taskTypeRef} />
                    </div>
                </div>

                <div className='taskInfo_box'>
                    <div className='taskInfo_box_title'>
                        <List />
                        <p>Description</p>
                    </div>
                    <div className='taskInfo_box_body'>
                        <input placeholder={'Task Description Here'} ref={taskDescriptionRef} />
                    </div>
                </div>

                <div className='taskInfo_box'>
                    <div className='taskInfo_box_title'>
                        <Calendar />
                        <p>Notes</p>
                    </div>
                    <input placeholder={'Task Notes'} ref={taskNotesRef} />
                </div>

                <div className='taskInfo_box'>
                    <div className='taskInfo_box_title'>
                        <Calendar />
                        <p>Flexible</p>
                    </div>
                    <select name="is_flexible" id="is_flexible" ref={isFlexibleRef}>
                        <option value="" selected disabled hidden>Select an option</option>
                        <option value="true">Yes</option>
                        <option value="false">No</option>
                    </select>
                </div>

                <div className='taskInfo_box'>
                    <div className='taskInfo_box_title'>
                        <AlertTriangle />
                        <p>Hard Deadline</p>
                    </div>
                    <div className='taskInfo_box_body'>
                        <input type='date' ref={hardDeadlineRef} />
                    </div>
                </div>
                <div className='taskInfo_box'>
                    <div className='taskInfo_box_title'>
                        <AlertOctagon />
                        <p>Soft Deadline</p>
                    </div>
                    <div className='taskInfo_box_body'>
                        <input type='date' ref={softDeadlineRef} />
                    </div>
                </div>
                <div className='taskInfo_box_btn'>
                    <button onClick={() => { handleSaveClick(); }}>Save</button>
                </div>
            </div>
        </AddTaskModal>
    )
}

export default NewCardModal