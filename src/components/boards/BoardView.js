import React, { useState, useRef, useEffect } from 'react';
import './BoardViewCSS.css';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import CardView from '../cards/CardView';
import AddNewTask from '../tasks/AddNewTask';

function BoardView(props) {
    const [roleType, setRoleType] = useState(props.data?.role_type);
    const roleTitleRef = useRef(null);
    const backgroundColor = props?.data?.colorCode;


    const sortedTasks = Object.values(props?.data?.tasks || {}).sort((task1, task2) => {
        if (task1?.deadlines?.hard < task2?.deadlines?.hard) {
            return -1;
        }
        if (task1?.deadlines?.hard > task2?.deadlines?.hard) {
            return 1;
        }
        return 0;
    });

    const handleRoleTypeChange = (event) => {
        setRoleType(event.target.innerText);
    };

    useEffect(() => {
        props.editRole(props?.data?.role_id);
    }, [roleType]);


    const handleEditIconClick = () => {
        roleTitleRef.current.focus();
    };

    return (
        <div className='board' style={{
            borderTop: `5px solid ${backgroundColor}`,
            borderLeft: `5px solid ${backgroundColor}`
        }}>
            <div className='top' style={{ backgroundColor: backgroundColor }}  >
                <p className='roleTitle'
                    ref={roleTitleRef}
                    contentEditable
                    suppressContentEditableWarning={true}
                    onInput={handleRoleTypeChange}>
                    {props.data?.role_type}
                </p>
                <div className='board_top_more'>
                    <EditIcon className='board_top_more_edit' fontSize='xtrasmall' onClick={handleEditIconClick} />
                    <DeleteIcon className='board_top_more_delete' fontSize='xtrasmall'
                        onClick={(e) => { props.deleteRole(props?.data?.role_id); }} />
                </div>
            </div>
            <div className='cards'>
                {sortedTasks.map((task) => (
                    <CardView
                        key={task.task_id}
                        task_id={task.task_id}
                        roleID={props?.data?.role_id}
                        data={task}
                        editTaskInRole={props.editTaskInRole}
                        deleteTask={props.deleteTask}
                        markTaskAsDone={props.markTaskAsDone}
                        handleDragEnter={props.handleDragEnter}
                        handleDragEnd={props.handleDragEnd}
                        getAllTasks={props.getAllTasks}
                    />
                ))}


                <AddNewTask
                    getAllTasks={props.getAllTasks}
                    role_id={props.role_id}
                    addNewTaskToRole={props.addNewTask}
                // onSubmit={(newTaskTitle) => { props.addNewTask(newTaskTitle, props?.data?.role_id) }} 
                />
            </div>
        </div>
    )
}

export default BoardView