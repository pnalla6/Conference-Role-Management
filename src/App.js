import { useState, useEffect } from 'react';
import './App.css';
import BoardView from './components/boards/BoardView';
import AddNewRole from './components/roles/AddNewRole';
// import myData from './assets/data.json';
import Timeline from './components/timeline/Timeline';
import { MoreHorizontal } from 'react-feather'


import axios from 'axios';


function App() {
  const [ConferenceData, setConferenceData] = useState([]);
  const conferenceId = ConferenceData.id;
  const filename = 'conf_export.json';

  useEffect(() => {
    axios({
      method: 'get',
      url: 'http://localhost:5000/conf',
      responseType: 'json'
    })
      .then((response) => {
        console.log(response.data.conf_data);
        setConferenceData(response.data.conf_data[0])
      });

    // return () => {

    // }
  }, []);


  const addNewTaskToRole = async (role_id, taskData) => {

    const newTaskObj = {
      task_id: taskData.taskId,
      task_type: taskData.taskType,
      is_flexible: taskData.isFlexible,
      task_dependency: [],
      task_created_date: taskData.taskCreatedDdate,
      task_description: taskData.taskDescription,
      task_notes: taskData.taskNotes,
      deadlines: {
        soft: taskData.softDeadline,
        hard: taskData.hardDeadline
      }
    };
    try {
      const postResponse = await axios.post(`http://localhost:5000/conf/addNewTask`,
        {
          conference_id: conferenceId,
          role_id: role_id,
          newTask: newTaskObj
        }
      );
      setConferenceData(postResponse.data.conf_data[0]);
    }
    catch (error) {
      console.error(error);
    }
  };

  const deleteTaskFromRole = async (task_id, role_id) => {
    try {
      const deleteResponse = await axios.post(`http://localhost:5000/conf/deleteTask`,
        {
          conference_id: conferenceId,
          role_id: role_id,
          task_id: task_id
        }
      );
      console.log(deleteResponse);
      setConferenceData(deleteResponse.data.conf_data[0]);
    }
    catch (error) {
      console.error(error);
    }

  };

  const addNewRole = async (roleType, rolePersonName) => {
    if (ConferenceData?.roles) {
      const existingRoles = ConferenceData.roles;
      const newRole = {
        role_id: (parseInt(existingRoles[existingRoles.length - 1].role_id) + 1).toString(),
        role_type: roleType,
        names: [rolePersonName],
        contact_info: "",
        tasks: [],
      };
      try {
        const postResponse = await axios.post(`http://localhost:5000/conf/addNewRole`,
          {
            conference_id: conferenceId,
            newRole
          }
        );
        setConferenceData(postResponse.data.conf_data[0]);
      }
      catch (error) {
        console.error(error);
      }
    }
  };

  const deleteRole = async (role_id) => {
    try {
      const deleteResponse = await axios.post(`http://localhost:5000/conf/deleteRole`,
        {
          conference_id: conferenceId,
          role_id
        }
      );
      console.log(deleteResponse);
      setConferenceData(deleteResponse.data.conf_data[0]);
    }
    catch (error) {
      console.error(error);
    }
    // const tempRoles = ConferenceData.filter((index) => index.role_id !== role_id.toString());
    // setConferenceData(tempRoles);
  };


  // DragEvent Functions 
  const [sourceRoleDrag, setSourceRoleDrag] = useState();
  const [targetRoleDrag, setTargetRoleDrag] = useState();

  const handleDragEnter = async (role_id, task_id) => {
    setTargetRoleDrag({ role_id, task_id });

    // try {
    //   const deleteResponse = await axios.post(`http://localhost:5000/conf/dragEnter`,
    //     {
    //       conference_id: conferenceId,
    //       role_id: role_id,
    //       task_id: task_id
    //     }
    //   );
    //   console.log(deleteResponse);
    //   setConferenceData(deleteResponse.data.conf_data[0]);
    // }
    // catch (error) {
    //   console.error(error);
    // }

  }

  const handleDragEnd = async (role_id, task_id) => {
    setSourceRoleDrag({ role_id, task_id });
    console.log(conferenceId);
    console.log(sourceRoleDrag.role_id, sourceRoleDrag.task_id);
    // console.log(targetRoleDrag.role_id, targetRoleDrag.task_id);

    try {
      const deleteResponse = await axios.post(`http://localhost:5000/conf/dragEnter`,
        {
          conference_id: conferenceId,
          source_role_id: sourceRoleDrag.role_id,
          source_task_id: sourceRoleDrag.task_id,
          target_role_id: targetRoleDrag.role_id,
          // target_task_id: targetRoleDrag.task_id
        }
      );
      console.log(deleteResponse);
      setConferenceData(deleteResponse.data.conf_data[0]);
    }
    catch (error) {
      console.error(error);
    }
  }

  // Export Conference Data as json
  const handleSaveToPC = (jsonData, filename) => {
    const fileData = JSON.stringify(jsonData);
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
        <div className="navBar">
          <h1>Conference Role Management</h1>
          {/* <h3>{ConferenceData.conference_name}</h3> */}
        </div>
        <MoreHorizontal onClick={() => { handleSaveToPC(ConferenceData, filename); }} />
      </header>
      <div className="boardContainer">
        <Timeline />
        <div className="boardOuter">
          {
            ConferenceData?.roles?.map((role) => <BoardView
              key={role.role_id}
              role_id={role.role_id}
              data={role}
              deleteRole={deleteRole}
              addNewTask={addNewTaskToRole}
              deleteTask={deleteTaskFromRole}
              handleDragEnter={handleDragEnter}
              handleDragEnd={handleDragEnd}
            />)
          }
          <div className='addNewRoles'>
            <AddNewRole onSubmit={(roleType, rolePersonName) => addNewRole(roleType, rolePersonName)} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
