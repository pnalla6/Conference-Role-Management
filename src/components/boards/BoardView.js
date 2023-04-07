import React, { useState } from 'react';
import './BoardViewCSS.css';
import { MoreHorizontal } from 'react-feather';
import CardView from '../cards/CardView';
import AddNewTask from '../tasks/AddNewTask';
import Dropdown from '../dropdown/Dropdown';

function BoardView(props) {
    const [showDropdown, setShowDropdown] = useState(false);

    // Sort tasks based on their deadline
    const sortedTasks = [...props?.data?.tasks].sort((task1, task2) => {
        if (task1.deadlines.hard > task2.deadlines.hard) {
            return -1;
        }
        if (task1.deadlines.hard < task2.deadlines.hard) {
            return 1;
        }
        return 0;
    });

    return (
        <div className='board'>
            <div className='top'>
                <p className='roleTitle'>{props.data?.role_type}</p>
                <div className='board_top_more' onClick={(e) => { e.stopPropagation(); setShowDropdown(true); }}>
                    <MoreHorizontal />
                    {showDropdown && (
                        <Dropdown onClose={() => { setShowDropdown(false) }}>
                            <div className="board_dropdown">
                                <p onClick={(e) => { props.deleteRole(props?.data?.role_id); setShowDropdown(false); }}>Delete Role</p>
                            </div>
                        </Dropdown>
                    )}
                </div>
            </div>
            <div className='cards'>
                {sortedTasks.map((task) => (
                    <CardView
                        key={task.task_id}
                        task_id={task.task_id}
                        roleID={props?.data?.role_id}
                        data={task}
                        deleteTask={props.deleteTask}
                        handleDragEnter={props.handleDragEnter}
                        handleDragEnd={props.handleDragEnd} />
                ))}
                <AddNewTask
                    role_id={props.role_id}
                    addNewTaskToRole={props.addNewTask}
                // onSubmit={(newTaskTitle) => { props.addNewTask(newTaskTitle, props?.data?.role_id) }} 
                />
            </div>
        </div>
    )
}

export default BoardView