import React from 'react';
import './FlairsCSS.css';
// import { X } from 'react-feather';

function Flairs(props) {
  const backgroundColor = props?.data?.is_flexible ? "#4CAF50" : "#f44336";
  const color = '#141301';

  return (
    <div className='flair' style={{ backgroundColor, color }}>
      {props?.data?.is_flexible ? "flexible" : "not flexible"}
      {/* {props.close && <X />} */}
    </div>
  );
}

export default Flairs;
