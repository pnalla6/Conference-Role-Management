// import React, { useState } from 'react';
// import { Check, Clock, MoreHorizontal } from 'react-feather';
// import Dropdown from '../dropdown/Dropdown';
// import Flairs from '../flairs/Flairs';
// import './CardViewCSS.css';
// import NewCardModal from './newCardModal/NewCardModal';
// import EditCardModal from './newCardModal/EditCardModal';

// function CardView(props) {
//     const [showDropdown, setShowDropdown] = useState(false);
//     const [showCardModal, setShowCardModal] = useState(false);
//     const [showEditCardModal, setShowEditCardModal] = useState(false);
//     const [isChecked, setIsChecked] = useState(props.data.is_done);
//     const [taskDependencies, setTaskDependencies] = useState(props?.data?.task_dependency);


//     const handleCheckClick = () => {
//         setIsChecked(!isChecked);
//         props.markTaskAsDone(props.task_id, props.roleID);
//     };

//     const handleEditCard = () => {
//         // console.log(props);
//         setShowDropdown(false);
//         setShowEditCardModal(true);
//     };

//     const handleCardClick = () => {
//         setTaskDependencies(props?.data?.task_dependency);
//         console.log(taskDependencies);
//     };

//     return (
//         <>
//             {showCardModal && <NewCardModal onClose={() => { setShowCardModal(false) }} />}
//             {showEditCardModal && <EditCardModal getAllTasks={props.getAllTasks} editTaskInRole={props.editTaskInRole} cardData={{ ...props.data, roleId: props.roleID }} onClose={() => { setShowEditCardModal(false) }} />}
//             <div className='card'
//                 draggable
//                 onDragEnter={() => props.handleDragEnter(props?.roleID, props?.data?.task_id)}
//                 onDragEnd={() => props.handleDragEnd(props?.roleID, props?.data?.task_id)}
//                 // onClick={(e) => { e.stopPropagation(); setShowCardModal(true) }}
//                 onClick={handleCardClick}
//             >

//                 <div className='card_top'>
//                     <div className='card_top_label'>
//                         <Flairs close text="soft" color="#caffb9" data={props?.data} />
//                     </div>
//                     <div className='card_top_more' onClick={(e) => { e.stopPropagation(); setShowDropdown(true); }}>
//                         <MoreHorizontal />
//                         {showDropdown && (
//                             <Dropdown
//                                 onClose={() => { setShowDropdown(false) }}
//                             >
//                                 <div className="card_dropdown">
//                                     <p onClick={(e) => { e.stopPropagation(); handleEditCard(); }}>Edit Task</p>
//                                     <p onClick={(e) => { e.stopPropagation(); props.deleteTask(props.task_id, props.roleID) }}>Delete Task</p>
//                                 </div>
//                             </Dropdown>
//                         )}
//                     </div>
//                 </div>

//                 <div className='card_title'>
//                     <h4>{props?.data?.task_type}</h4>
//                     <p style={{ fontWeight: 'lighter' }}>{props?.data?.task_description}</p>
//                 </div>
//                 <div className='card_footer'>
//                     <p style={{ fontSize: '0.85rem' }}><Clock /> {props?.data.deadlines?.hard}</p>
//                     <p>
//                         <Check
//                             className={isChecked ? 'checked' : ''}
//                             onClick={handleCheckClick}
//                         />
//                     </p>
//                 </div>
//             </div>
//         </>
//     )
// }

// export default CardView;







import React, { useState } from 'react';
import { Check, Clock } from 'react-feather';
// import Dropdown from '../dropdown/Dropdown';
// import Flairs from '../flairs/Flairs';
import './CardViewCSS.css';
import NewCardModal from './newCardModal/NewCardModal';
import EditCardModal from './newCardModal/EditCardModal';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';



function CardView(props) {
    const [showCardModal, setShowCardModal] = useState(false);
    const [showEditCardModal, setShowEditCardModal] = useState(false);
    const [isChecked, setIsChecked] = useState(props.data.is_done);

    const handleCheckClick = () => {
        setIsChecked(!isChecked);
        props.markTaskAsDone(props.task_id, props.roleID);
    };

    const handleEditCard = () => {
        setShowEditCardModal(true);
    };


    const handleCardClick = () => {
        const clickedCard = document.getElementById(props.data.task_id);
        const clickedCardHasTaskActiveClass = clickedCard.classList.contains("task-active");
        const dependencies = new Set(props.data.task_dependency);

        if (!clickedCardHasTaskActiveClass) {
            clickedCard.classList.add("task-active");
        } else {
            clickedCard.classList.remove("task-active");
        }

        const cards = document.getElementsByClassName("card");

        for (let i = 0; i < cards.length; i++) {
            const card = cards[i];
            const isDependency = dependencies.has(card.id);

            if (isDependency) {
                card.classList.add("task-dependency");
            } else {
                card.classList.remove("task-dependency");
            }
        }
    };


    return (
        <>
            {showCardModal && <NewCardModal onClose={() => { setShowCardModal(false) }} />}
            {showEditCardModal && <EditCardModal getAllTasks={props.getAllTasks} editTaskInRole={props.editTaskInRole} cardData={{ ...props.data, roleId: props.roleID }} onClose={() => { setShowEditCardModal(false) }} />}
            <div id={props.task_id} className="card"
                draggable
                onDragEnter={() => props.handleDragEnter(props?.roleID, props?.data?.task_id)}
                onDragEnd={() => props.handleDragEnd(props?.roleID, props?.data?.task_id)}
                onClick={() => { handleCardClick(); }}
            >
                <div className='card_top'>
                    <div className='card_top_label'>
                        {/* <Flairs close text="soft" color="#caffb9" data={props?.data} /> */}
                    </div>
                    <div className='card_top_more'>
                        {/* <MoreHorizontal /> */}
                        <EditIcon className='card_top_more_edit' fontSize='xtrasmall' onClick={(e) => { e.stopPropagation(); handleEditCard(); }} />
                        <DeleteIcon className='card_top_more_delete' fontSize='xtrasmall' onClick={(e) => { e.stopPropagation(); props.deleteTask(props.task_id, props.roleID) }} />
                    </div>
                </div>

                <div className='card_title'>
                    <h4>{props?.data?.task_type}</h4>
                    <p style={{ display: 'table-caption', width: 'inherit', fontWeight: 'lighter' }}>{props?.data?.task_description}</p>
                </div>
                <div className='card_footer'>
                    <p style={{ fontSize: '0.85rem' }}><Clock style={props?.data?.is_flexible ? { stroke: '#FF6F00' } : {}} />
                        {props?.data.deadlines?.hard}</p>
                    <p>
                        {
                            isChecked ? <Check
                                className={isChecked ? 'checked' : ''}
                                onClick={handleCheckClick}
                            /> : <CheckBoxOutlineBlankIcon onClick={handleCheckClick} />
                        }
                    </p>
                </div>
            </div>
        </>
    )
}

export default CardView
