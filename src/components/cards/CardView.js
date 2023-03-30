import React, { useState } from 'react';
import { Check, Clock, MoreHorizontal } from 'react-feather';
import Dropdown from '../dropdown/Dropdown';
import Flairs from '../flairs/Flairs';
import './CardViewCSS.css';
import NewCardModal from './newCardModal/NewCardModal';

function CardView(props) {
    const [showDropdown, setShowDropdown] = useState(false);
    const [showCardModal, setShowCardModal] = useState(false);
    return (
        <>
            {showCardModal && <NewCardModal onClose={() => { setShowCardModal(false) }} />}
            <div className='card'
            draggable
            // onDragEnter={}
            // onDragEnd={}
            // onClick={(e) => { e.stopPropagation(); setShowCardModal(true) }}
            >

                <div className='card_top'>
                    <div className='card_top_label'>
                        <Flairs close text="soft" color="lightgreen" data={props?.data} />
                    </div>
                    <div className='card_top_more' onClick={(e) => { e.stopPropagation(); setShowDropdown(true); }}>
                        <MoreHorizontal />
                        {showDropdown && (
                            <Dropdown
                                onClose={() => { setShowDropdown(false) }}
                            >
                                <div className="card_dropdown">
                                    <p onClick={(e) => { e.stopPropagation(); props.deleteTask(props.task_id, props.roleID) }}>Delete Task</p>
                                </div>
                            </Dropdown>
                        )}
                    </div>
                </div>

                <div className='card_title'>
                    <h4>{'id:'}{props?.data?.task_id}{' '}{props?.data?.task_type}</h4>
                    <p style={{ fontWeight: 'lighter' }}>{props?.data?.task_description}</p>
                </div>
                <div className='card_footer'>
                    <p><Clock /> {props?.data.deadlines?.hard}</p>
                    <p><Check /></p>
                </div>
            </div>
        </>
    )
}

export default CardView