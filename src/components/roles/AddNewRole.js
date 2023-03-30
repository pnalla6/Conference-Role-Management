import React, { useState } from 'react';
import './AddNewRole.css'
import { X } from 'react-feather';

function AddNewRole(props) {
  const [showAddNewRole, setShowAddNewRole] = useState(false);
  const [roleType, setRoleType] = useState('');
  const [rolePersonName, setRolePersonName] = useState('');

  return (
    <div className='addNewRole'>
      {showAddNewRole
        ?
        <form className='addNewRoleForm' onSubmit={(e) => {
          e.preventDefault();
          if (props.onSubmit) props.onSubmit(roleType, rolePersonName);
          setShowAddNewRole(false);
          setRoleType(" ");
          setRolePersonName(" ");
        }}>
          <input value={roleType} type="text" placeholder="Enter Role Type" autoFocus={true} onChange={(e) => { setRoleType(e.target.value); }} />
          <input value={rolePersonName} type="text" placeholder="Enter Name" onChange={(e) => { setRolePersonName(e.target.value); }} />
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