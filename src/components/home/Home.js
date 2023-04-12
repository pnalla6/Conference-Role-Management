import React, { useState, useEffect } from 'react';
import './HomeCSS.css'
import axios from 'axios';
import BoardView from '../boards/BoardView';
import AddNewRole from '../roles/AddNewRole';
// import myData from './assets/data.json';
import Timeline from '../timeline/Timeline';
import NavBar from './NavBar';
import { useParams } from 'react-router-dom';
import { useAuth } from '../user/AuthProvider';
import { ref, onValue, push, set, get, remove, child, query, orderByChild, equalTo, update } from 'firebase/database';
import { crmdatabase } from '../../Firebase';
import { v4 as uuid } from 'uuid';

function Home() {
  const { conferenceId } = useParams();
  const { currentUser } = useAuth();
  const [ConferenceData, setConferenceData] = useState([]);
  // const conferenceId = ConferenceData.id;
  const filename = 'conf_export.json';


  useEffect(() => {
    const db = crmdatabase;
    const conferenceRef = ref(db, `users/${currentUser.uid}/conferences/${conferenceId}`);
    onValue(conferenceRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        setConferenceData(data);
      }
    });
  }, [currentUser.uid, conferenceId]);



  const addNewTaskToRole = async (role_id, taskData) => {
    // validate taskData
    if (
      !taskData ||
      !taskData.taskType ||
      !taskData.taskDescription ||
      !taskData.taskNotes ||
      !taskData.softDeadline ||
      !taskData.hardDeadline
    ) {
      console.error("Invalid task data:", taskData);
      return;
    }

    const newTaskObj = {
      task_type: taskData.taskType,
      is_flexible: taskData.isFlexible,
      task_dependency: [],
      task_created_date: new Date().toISOString(),
      task_description: taskData.taskDescription,
      task_notes: taskData.taskNotes,
      deadlines: {
        soft: taskData.softDeadline,
        hard: taskData.hardDeadline,
      },
    };

    try {
      const databaseRef = ref(
        crmdatabase,
        `users/${currentUser.uid}/conferences/${conferenceId}/roles/${role_id}/tasks`
      );

      const roleSnapshot = await get(databaseRef.parent);
      if (!roleSnapshot.exists()) {
        console.warn(`Role with ID '${role_id}' does not exist`);
        return;
      }

      const newTaskRef = push(databaseRef);
      const taskId = newTaskRef.key;
      await set(newTaskRef, { ...newTaskObj, task_id: taskId });

      // Update conference data
      const conferenceRef = ref(
        crmdatabase,
        `users/${currentUser.uid}/conferences/${conferenceId}`
      );
      const snapshot = await get(conferenceRef);
      const conferenceData = snapshot.val();

      const updatedData = {
        ...conferenceData,
        roles: {
          ...conferenceData.roles,
          [role_id]: {
            ...conferenceData.roles[role_id],
            tasks: {
              ...conferenceData.roles[role_id].tasks,
              [taskId]: { ...newTaskObj, task_id: taskId },
            },
          },
        },
      };

      await set(conferenceRef, updatedData);
    } catch (error) {
      console.error(error);
    }
  };




  const deleteTaskFromRole = async (taskId, roleId) => {
    console.table(taskId, roleId, currentUser.uid);
    try {
      const roleRef = ref(
        crmdatabase,
        `users/${currentUser.uid}/conferences/${conferenceId}/roles/${roleId}`
      );

      await remove(child(roleRef, `tasks/${taskId}`));

      const snapshot = await get(child(roleRef, 'tasks'));
      const tasks = snapshot.val() || {};

      const updatedData = {
        ...ConferenceData,
        roles: {
          ...ConferenceData.roles,
          [roleId]: {
            ...ConferenceData.roles[roleId],
            tasks,
          },
        },
      };

      await set(
        ref(crmdatabase, `users/${currentUser.uid}/conferences/${conferenceId}`),
        updatedData
      );
    } catch (error) {
      console.error(error);
    }
  };








  const addNewRole = async (roleType, rolePersonName) => {
    const rolesRef = ref(crmdatabase, `users/${currentUser.uid}/conferences/${conferenceId}/roles`);

    try {
      // Check if roles node exists
      const rolesSnapshot = await get(rolesRef);
      if (!rolesSnapshot.exists()) {
        // Roles node does not exist, create it
        await set(rolesRef, {});
      }

      // Check if role already exists
      const roleQuery = query(rolesRef, orderByChild('role_type'), equalTo(roleType));
      const roleSnapshot = await get(roleQuery);
      if (roleSnapshot.exists()) {
        console.warn(`Role with type '${roleType}' already exists`);
        return;
      }

      const newRole = {
        role_type: roleType,
        names: [rolePersonName],
        contact_info: "",
        tasks: [],
      };

      // Add new role object to roles node
      const newRoleRef = push(rolesRef);
      const role_id = newRoleRef.key;
      await set(newRoleRef, { ...newRole, role_id });

      const conferenceRef = ref(crmdatabase, `users/${currentUser.uid}/conferences/${conferenceId}`);
      onValue(conferenceRef, (snapshot) => {
        const conferenceData = snapshot.val();
        console.log('ll', conferenceData);
        setConferenceData(conferenceData);
      });
    } catch (error) {
      console.error(error);
    }
  };





  const deleteRole = async (role_id) => {
    try {
      const rolesRef = ref(crmdatabase, `users/${currentUser.uid}/conferences/${conferenceId}/roles`);
      const roleRef = child(rolesRef, role_id);
      await remove(roleRef);
      const snapshot = await get(rolesRef);
      const conferenceData = snapshot.exists() ? snapshot.val() : {};
      setConferenceData(conferenceData);
    } catch (error) {
      console.error(error);
    }
  };



  // DragEvent Functions 
  const [sourceRoleDrag, setSourceRoleDrag] = useState();
  const [targetRoleDrag, setTargetRoleDrag] = useState();

  const handleDragEnter = async (role_id, task_id) => {
    setTargetRoleDrag({ role_id, task_id });

  }

  const handleDragEnd = async (role_id, task_id) => {
    setSourceRoleDrag({ role_id, task_id });
    console.log(conferenceId);
    console.log(sourceRoleDrag.role_id, sourceRoleDrag.task_id);

    try {
      const deleteResponse = await axios.post(`http://localhost:5000/conf/dragEnter`,
        {
          conference_id: conferenceId,
          source_role_id: sourceRoleDrag.role_id,
          source_task_id: sourceRoleDrag.task_id,
          target_role_id: targetRoleDrag.role_id,
        }
      );
      setConferenceData(deleteResponse.data.conf_data[0]);
    }
    catch (error) {
      console.error(error);
    }
  }

  // Export Conference Data as json
  const handleSaveToPC = () => {
    const fileData = JSON.stringify(ConferenceData);
    const blob = new Blob([fileData], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.download = `${filename}.json`;
    link.href = url;
    link.click();
  }


  return (
    <div className="App">
      <header className="App_header">
        <NavBar
          handleSaveToPC={handleSaveToPC} />
      </header>
      <div className="boardContainer">
        <Timeline />
        <div className="boardOuter">
          {ConferenceData?.roles ? (
            Object.keys(ConferenceData.roles).map((role_id) => (
              <BoardView
                key={role_id}
                role_id={role_id}
                data={ConferenceData.roles[role_id]}
                deleteRole={deleteRole}
                addNewTask={addNewTaskToRole}
                deleteTask={deleteTaskFromRole}
                handleDragEnter={handleDragEnter}
                handleDragEnd={handleDragEnd}
              />
            ))
          ) : (
            <div>No Roles yet..!</div>
          )}


          <div className='addNewRoles'>
            <AddNewRole onSubmit={(roleType, rolePersonName) => addNewRole(roleType, rolePersonName)} />
          </div>
        </div>
      </div>
    </div>
  )
}

export default Home