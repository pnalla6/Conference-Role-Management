// import React, { useState } from 'react';
// import { Check, Clock } from 'react-feather';
// import './CardViewCSS.css';
// import NewCardModal from './newCardModal/NewCardModal';
// import EditCardModal from './newCardModal/EditCardModal';
// import EditIcon from '@mui/icons-material/Edit';
// import DeleteIcon from '@mui/icons-material/Delete';
// import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';



// function CardView(props) {
//     const [showCardModal, setShowCardModal] = useState(false);
//     const [showEditCardModal, setShowEditCardModal] = useState(false);
//     const [isChecked, setIsChecked] = useState(props.data.is_done);

//     const handleCheckClick = () => {
//         setIsChecked(!isChecked);
//         props.markTaskAsDone(props.task_id, props.roleID);
//     };

//     const handleEditCard = () => {
//         setShowEditCardModal(true);
//     };


//     const handleCardClick = () => {
//         const clickedCard = document.getElementById(props.data.task_id);
//         const clickedCardHasTaskActiveClass = clickedCard.classList.contains("task-active");
//         const dependencies = new Set(props.data.task_dependency);

//         if (!clickedCardHasTaskActiveClass) {
//           clickedCard.classList.add("task-active");
//         } else {
//           clickedCard.classList.remove("task-active");
//         }

//         const cards = document.getElementsByClassName("card");

//         for (let i = 0; i < cards.length; i++) {
//           const card = cards[i];
//           const isDependency = dependencies.has(card.id);

//           if (isDependency) {
//             if (clickedCardHasTaskActiveClass) {
//               card.classList.remove("task-dependency-active");
//             } else {
//               card.classList.add("task-dependency-active");
//             }
//           } else {
//             if (card !== clickedCard) {
//               card.classList.toggle("task-inactive");
//             }
//             card.classList.remove("task-dependency-active");
//             card.classList.remove("task-dependency");
//           }
//         }
//       };




//     return (
//         <>
//         <canvas id="connection-lines" width="100%" height="100%" hidden></canvas>

//             {showCardModal && <NewCardModal onClose={() => { setShowCardModal(false) }} />}
//             {showEditCardModal && <EditCardModal getAllTasks={props.getAllTasks} editTaskInRole={props.editTaskInRole} cardData={{ ...props.data, roleId: props.roleID }} onClose={() => { setShowEditCardModal(false) }} />}
//             <div id={props.task_id} className="card"
//                 draggable
//                 onDragEnter={() => props.handleDragEnter(props?.roleID, props?.data?.task_id)}
//                 onDragEnd={() => props.handleDragEnd(props?.roleID, props?.data?.task_id)}
//                 onClick={() => { handleCardClick(); }}
//             >
//                 <div className='card_top'>
//                     <div className='card_top_label'>
//                     </div>
//                     <div className='card_top_more'>
//                         <EditIcon className='card_top_more_edit' fontSize='xtrasmall' onClick={(e) => { e.stopPropagation(); handleEditCard(); }} />
//                         <DeleteIcon className='card_top_more_delete' fontSize='xtrasmall' onClick={(e) => { e.stopPropagation(); props.deleteTask(props.task_id, props.roleID) }} />
//                     </div>
//                 </div>

//                 <div className='card_title'>
//                     <h4>{props?.data?.task_type}</h4>
//                     <p style={{ display: 'table-caption', wordWrap: 'break-word', maxWidth: '200px', fontWeight: 'lighter' }}>{props?.data?.task_description}</p>
//                 </div>
//                 <div className='card_footer'>
//                     <p style={{ fontSize: '0.85rem' }}><Clock style={props?.data?.is_flexible ? { stroke: 'darkgreen', fill: 'transparent' } : { fill: 'transparent' }} />
//                         {props?.data.deadlines?.hard}</p>
//                     <p>
//                         {
//                             isChecked ? <Check
//                                 className={isChecked ? 'checked' : ''}
//                                 onClick={handleCheckClick}
//                             /> : <CheckBoxOutlineBlankIcon onClick={handleCheckClick} />
//                         }
//                     </p>
//                 </div>
//             </div>
//         </>
//     )
// }

// export default CardView










import React, { useState,useEffect } from 'react';
import { Check, Clock } from 'react-feather';
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
    const [isCardActive, setIsCardActive] = useState(false);
    const [taskDependency, setTaskDependency] = useState([]);

    const handleCheckClick = () => {
        setIsChecked(!isChecked);
        props.markTaskAsDone(props.task_id, props.roleID);
    };

    const handleEditCard = () => {
        setShowEditCardModal(true);
    };


    const handleCardClick = () => {
        setIsCardActive(!isCardActive);
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
                if (clickedCardHasTaskActiveClass) {
                    card.classList.remove("task-dependency-active");
                } else {
                    card.classList.add("task-dependency-active");
                }
            } else {
                if (card !== clickedCard) {
                    card.classList.toggle("task-inactive");
                }
                card.classList.remove("task-dependency-active");
                card.classList.remove("task-dependency");
            }
        }

    };



    return (
        <>
            <canvas id="connection-lines" width="100%" height="100%" hidden></canvas>

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
                    </div>
                    <div className='card_top_more'>
                        <EditIcon className='card_top_more_edit' fontSize='xtrasmall' onClick={(e) => { e.stopPropagation(); handleEditCard(); }} />
                        <DeleteIcon className='card_top_more_delete' fontSize='xtrasmall' onClick={(e) => { e.stopPropagation(); props.deleteTask(props.task_id, props.roleID) }} />
                    </div>
                </div>

                <div className='card_title'>
                    <h4>{props?.data?.task_type}</h4>
                    <p style={{ display: 'table-caption', wordWrap: 'break-word', maxWidth: '200px', fontWeight: 'lighter' }}>{props?.data?.task_description}</p>
                </div>
                <div className='card_footer'>
                    <p style={{ fontSize: '0.85rem' }}><Clock style={props?.data?.is_flexible ? { stroke: 'darkgreen', fill: 'transparent' } : { fill: 'transparent' }} />
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
                {isCardActive && (
                    <div className="card-overlay" style={{ fontSize: '0.6rem' }}>
                        <code style={{ color: '#f73d93' }}>Dependent on {props?.data?.task_type}</code>
                    </div>
                )}
            </div>
        </>
    )
}

export default CardView
