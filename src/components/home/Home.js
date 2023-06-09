import React, { useState, useEffect } from 'react';
import './HomeCSS.css'
import BoardView from '../boards/BoardView';
import AddNewRole from '../roles/AddNewRole';
// import myData from './assets/data.json';
import TimelineComponent from '../timeline/Timeline';
import NavBar from './NavBar';
import { useParams } from 'react-router-dom';
import { useAuth } from '../user/AuthProvider';
import { ref, onValue, push, set, get, remove, child, query, orderByChild, equalTo, update } from 'firebase/database';
import { crmdatabase } from '../../Firebase';

function Home() {
  const { conferenceId } = useParams();
  const { currentUser } = useAuth();
  const [ConferenceData, setConferenceData] = useState();
  const [allTasksList, setAllTasksList] = useState(null);
  const [dataChanged, setDataChanged] = useState(false);
  // const conferenceId = ConferenceData.id;
  const filename = 'conf_export.json';


  // fetch user conferences if he is logged in
  useEffect(() => {
    const db = crmdatabase;
    const conferenceRef = ref(db, `conferences/${currentUser.uid}/conferences/${conferenceId}`);
    onValue(conferenceRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        setConferenceData(data);
      }
    });
  }, [dataChanged]);


  // Add a new Task to a Role 
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
      task_dependency: taskData?.taskDependency,
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
        `conferences/${currentUser.uid}/conferences/${conferenceId}/roles/${role_id}/tasks`
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
        `conferences/${currentUser.uid}/conferences/${conferenceId}`
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


  // Edit the Task in a Role
  const editTaskInRole = async (role_id, task_id, taskData) => {
    // validate taskData
    if (!taskData || !taskData.taskType || !taskData.taskDescription || !taskData.taskNotes || !taskData.softDeadline || !taskData.hardDeadline) {
      console.error("Invalid task data:", taskData);
      return;
    }

    const databaseRef = ref(crmdatabase, `conferences/${currentUser.uid}/conferences/${conferenceId}/roles/${role_id}/tasks/${task_id}`);

    try {
      const taskSnapshot = await get(databaseRef);
      if (!taskSnapshot.exists()) {
        console.warn(`Task with ID '${task_id}' does not exist`);
        return;
      }

      const existingTaskObj = taskSnapshot.val();

      const updatedTaskObj = {
        task_type: taskData.taskType,
        is_flexible: taskData.isFlexible,
        task_dependency: taskData.taskDependency || [], // default to empty array
        task_description: taskData.taskDescription,
        task_notes: taskData.taskNotes,
        deadlines: {
          soft: taskData.softDeadline,
          hard: taskData.hardDeadline,
        },
      };


      await update(databaseRef, updatedTaskObj);

      // Update conference data
      const conferenceRef = ref(crmdatabase, `conferences/${currentUser.uid}/conferences/${conferenceId}`);
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
              [task_id]: {
                ...existingTaskObj,
                ...updatedTaskObj,
                task_id,
              },
            },
          },
        },
      };

      await set(conferenceRef, updatedData);
    } catch (error) {
      console.error(error);
    }
  };




  // Delete a Task from Role
  const deleteTaskFromRole = async (taskId, roleId) => {
    try {
      const roleRef = ref(
        crmdatabase,
        `conferences/${currentUser.uid}/conferences/${conferenceId}/roles/${roleId}`
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
        ref(crmdatabase, `conferences/${currentUser.uid}/conferences/${conferenceId}`),
        updatedData
      );
    } catch (error) {
      console.error(error);
    }
  };


  // Mark a Task as Done
  const markTaskAsDone = async (taskId, role_id) => {
    if (typeof taskId !== 'string') {
      throw new Error('taskId must be a string');
    }

    try {
      const roleRef = ref(
        crmdatabase,
        `conferences/${currentUser.uid}/conferences/${conferenceId}/roles/${role_id}`
      );
      const taskRef = child(roleRef, `tasks/${taskId}`);
      const taskSnapshot = await get(taskRef);
      const taskData = taskSnapshot.val();
      const isDone = taskData?.is_done || false;
      const oppositeIsDone = !isDone;

      await update(taskRef, {
        is_done: oppositeIsDone,
      });

      // Update the conference data
      const conferenceRef = ref(crmdatabase, `conferences/${currentUser.uid}/conferences/${conferenceId}`);
      const conferenceSnapshot = await get(conferenceRef);
      const conferenceData = conferenceSnapshot.val();

      const roleData = conferenceData.roles[role_id];
      const updatedTaskData = {
        ...roleData.tasks,
        [taskId]: {
          ...taskData,
          is_done: oppositeIsDone,
        },
      };
      const updatedRoleData = {
        ...roleData,
        tasks: updatedTaskData,
      };
      const updatedConferenceData = {
        ...conferenceData,
        roles: {
          ...conferenceData.roles,
          [role_id]: updatedRoleData,
        },
      };

      await set(conferenceRef, updatedConferenceData);

      return updatedConferenceData;
    } catch (error) {
      console.error(error);
    }
  };




  // Add a new Role to a Conference Board
  const addNewRole = async (roleType, rolePersonName) => {
    const colorPalettes = ['#479EF5', '#479EF5', '#479EF5', '#479EF5', '#479EF5', '#479EF5', '#479EF5'];
    const backgroundColor = colorPalettes[Math.floor(Math.random() * colorPalettes.length)];

    const rolesRef = ref(crmdatabase, `conferences/${currentUser.uid}/conferences/${conferenceId}/roles`);

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
        colorCode: backgroundColor
      };

      // Add new role object to roles node
      const newRoleRef = push(rolesRef);
      const role_id = newRoleRef.key;
      await set(newRoleRef, { ...newRole, role_id });

      const conferenceRef = ref(crmdatabase, `conferences/${currentUser.uid}/conferences/${conferenceId}`);
      onValue(conferenceRef, (snapshot) => {
        const conferenceData = snapshot.val();

        if (conferenceData) {
          setDataChanged(!dataChanged);
          setConferenceData(conferenceData);
        }
      });
    } catch (error) {
      console.error(error);
    }
  };


  const editRole = async (role_id) => {
    try {
      // console.log(role_id);
    } catch (error) { console.error(error); }
  }

  // Delete a Role from Conference Board
  const deleteRole = async (role_id) => {
    try {
      const rolesRef = ref(crmdatabase, `conferences/${currentUser.uid}/conferences/${conferenceId}/roles`);
      const roleRef = child(rolesRef, role_id);
      await remove(roleRef);
      const snapshot = await get(rolesRef);
      const conferenceData = snapshot.exists() ? snapshot.val() : {};
      console.log(conferenceData);
      if (conferenceData) {
        setDataChanged(!dataChanged);
        setConferenceData(conferenceData);
      }
    } catch (error) {
      console.error(error);
    }
  };



  // DragEvent Functions
  const [sourceRoleDrag, setSourceRoleDrag] = useState();
  const [targetRoleDrag, setTargetRoleDrag] = useState();

  const handleDragEnter = (role_id, task_id) => {
    setTargetRoleDrag({ role_id, task_id });
  };

  const handleDragEnd = (role_id, task_id) => {
    const sourceRoleId = role_id;
    const sourceTaskId = task_id;
    const targetRoleId = targetRoleDrag.role_id;

    console.log(sourceRoleId, sourceTaskId, targetRoleId);

    // Get a reference to the Firebase Realtime Database location of the task being dragged
    const sourceTaskRef = ref(
      crmdatabase,
      `conferences/${currentUser.uid}/conferences/${conferenceId}/roles/${sourceRoleId}/tasks/${sourceTaskId}`
    );

    // Read the current value of the task being dragged
    get(sourceTaskRef)
      .then((sourceSnapshot) => {
        const sourceTask = sourceSnapshot.val();

        // Update the database with the new role_id value for the task being dragged
        const updates = {};
        updates[
          `conferences/${currentUser.uid}/conferences/${conferenceId}/roles/${targetRoleId}/tasks/${sourceTaskId}`
        ] = sourceTask;

        // Remove the task from the source role
        remove(sourceTaskRef);

        // Update the database with the new task and role
        return update(ref(crmdatabase), updates)
          .then(() => {
            console.log('Database updated successfully.');
          })
          .catch((error) => {
            console.error('Error updating the database:', error);
          });

      })
      .catch((error) => {
        console.error(error);
      });
  };

  // Get all Tasks
  const getAllTasks = async () => {
    const rolesRef = ref(
      crmdatabase,
      `conferences/${currentUser.uid}/conferences/${conferenceId}/roles`
    );

    try {
      const rolesSnapshot = await get(rolesRef);
      const roles = rolesSnapshot.val();

      const tasks = [];

      Object.keys(roles).forEach((roleId) => {
        const role = roles[roleId];

        if (role.tasks) {
          const roleTasks = Object.values(role.tasks);
          roleTasks.forEach((task) => {
            task.role_id = roleId;
          });
          tasks.push(...roleTasks);
        }
      });

      setAllTasksList(tasks);
      return tasks;
    } catch (error) {
      console.error(error);
    }
  };

  


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
          conferenceName={ConferenceData?.conference_name}
          handleSaveToPC={handleSaveToPC} />
      </header>
      <div className="boardContainer">
        <TimelineComponent conferenceDates={ConferenceData} getAllTasks={getAllTasks} />
        <div className="boardOuter">
          {ConferenceData?.roles ? (
            Object.keys(ConferenceData?.roles).map((role_id) => (
              <BoardView
                key={role_id}
                role_id={role_id}
                data={ConferenceData?.roles[role_id]}
                editRole={editRole}
                deleteRole={deleteRole}
                addNewTask={addNewTaskToRole}
                editTaskInRole={editTaskInRole}
                deleteTask={deleteTaskFromRole}
                markTaskAsDone={markTaskAsDone}
                handleDragEnter={handleDragEnter}
                handleDragEnd={handleDragEnd}
                getAllTasks={getAllTasks}
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