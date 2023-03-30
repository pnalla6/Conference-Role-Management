import { useState, useEffect } from 'react';
import './App.css';
import BoardView from './components/boards/BoardView';
import AddNewRole from './components/roles/AddNewRole';
// import myData from './assets/data.json';
import Timeline from './components/timeline/Timeline';

import axios from 'axios';


function App() {
  const [ConferenceData, setConferenceData] = useState([]);
  const conferenceId = ConferenceData.id;

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

      // const updatedRoles = [...existingRoles, newRole];


      try {
        const postResponse = await axios.post(`http://localhost:5000/conf/addNewRole`,
          {
            conference_id: conferenceId,
            newRole
          }
        );
        // console.log(postResponse);
        setConferenceData(postResponse.data.conf_data[0]);
      }
      catch (error) {
        console.error(error);
      }
    }

    // setConferenceData([...ConferenceData, {
    //   role_type: newRole,
    // }]);
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


  return (
    <div className="App">
      <header className="App_header">
        <div className="navBar">
          <h1>Conference Role Management</h1>
          {/* <h3>{ConferenceData.conference_name}</h3> */}
        </div>
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
