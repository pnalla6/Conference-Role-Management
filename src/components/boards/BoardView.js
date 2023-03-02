import React, { useState } from 'react';
import './BoardViewCSS.css';
import { MoreHorizontal } from 'react-feather';
import CardView from '../cards/CardView';
import AddNewTask from '../tasks/AddNewTask';
import Dropdown from '../dropdown/Dropdown';

function BoardView(props) {
    const [showDropdown, setShowDropdown] = useState(false);
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
                {props?.data?.tasks?.map((task) => (
                    <CardView
                        roleID={props?.data?.role_id}
                        data={task}
                        deleteTask={props.deleteTask} />
                ))}
                <AddNewTask
                    onSubmit={(newTask) => { AddNewTask(newTask, props?.data?.role_id) }} />
            </div>
        </div>
    )
}

export default BoardView