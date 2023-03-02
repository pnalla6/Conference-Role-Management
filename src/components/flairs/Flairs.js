import React from 'react';
import './FlairsCSS.css';
import { X } from 'react-feather';

function Flairs(props) {
    // console.log('flair==',props.data);
    return (
        <div className='flair' style={{ backgroundColor: props.color }}>
            {props.data?.is_flexible}
            {props.close && <X />}
        </div>
    )
}

export default Flairs