import React, { useState } from 'react';
import './AddNewRole.css'
import { X } from 'react-feather';

function AddNewRole(props) {
  const [showAddNewRole, setShowAddNewRole] = useState(false);
  const [inputValue, setInputValue] = useState('');

  return (
    <div className='addNewRole'>
      {showAddNewRole
        ?
        <form className='addNewRoleForm' onSubmit={(e) => {
          e.preventDefault();
          if (props.onSubmit) props.onSubmit(inputValue);
          setShowAddNewRole(false);
          setInputValue(" "); 
        }}>
          <input value={inputValue} type="text" placeholder={props.placeholder} autoFocus={true} onChange={(e) => { setInputValue(e.target.value); }} />
          <div className='addNewRoleFormFooter'>
            <button type='submit'>{props.buttonText || 'Add'}</button>
            <X onClick={() => setShowAddNewRole(false)} />
          </div>
        </form>
        :
        <p className='addNewRoleButton' style={{ cursor: "pointer" }} onClick={() => setShowAddNewRole(true)}>Add Role</p>
      }
    </div>
  )
}

export default AddNewRole