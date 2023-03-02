import { useState } from 'react';
import './App.css';
import BoardView from './components/boards/BoardView';
import AddNewRole from './components/roles/AddNewRole';
import myData from './assets/data.json';
function App() {
  const dataRoles = [
    {
      "role_id": "01",
      "role_type": "General Chair",
      "names": [
        "abc"
      ],
      "contact_info": "123",
      "tasks": [
        {
          "task_id": "01",
          "task_type": "Review",
          "is_flexible": "true",
          "task_dependency": [
            1,
            2,
            3,
            4
          ],
          "task_created_date": "02-16-2023",
          "task_description": "Some General Paper Review",
          "task_notes": "contact financial chair for advice before deadline",
          "deadlines": {
            "soft": "02-17-2023",
            "hard": "02-18-2023"
          }
        }
      ]
    },
    {
      "role_id": "02",
      "role_type": "Technical Chair",
      "names": [
        "def"
      ],
      "contact_info": "456",
      "tasks": [
        {
          "task_id": "01",
          "task_type": "Technical Review",
          "is_flexible": "none",
          "task_dependency": [
            1,
            2
          ],
          "task_created_date": "02-17-2023",
          "task_description": "Technical Paper Review",
          "task_notes": "contact paper presenter for technical review",
          "deadlines": {
            "soft": "02-18-2023",
            "hard": "02-19-2023"
          }
        }
      ]
    },
    {
      "role_id": "03",
      "role_type": "Finance Chair",
      "names": [
        "ghi"
      ],
      "contact_info": "789",
      "tasks": [
        {
          "task_id": "01",
          "task_type": "Financial Review1",
          "is_flexible": "false",
          "task_dependency": [
            3,
            4
          ],
          "task_created_date": "02-19-2023",
          "task_description": "Financial Review1",
          "task_notes": "decide and review the financial aspects of the conference",
          "deadlines": {
            "soft": "02-19-2023",
            "hard": "02-20-2023"
          }
        },
        {
          "task_id": "02",
          "task_type": "Financial Review2",
          "is_flexible": "false",
          "task_dependency": [
            3,
            4
          ],
          "task_created_date": "02-19-2023",
          "task_description": "Financial Review2",
          "task_notes": "and review the financial aspects of the conference",
          "deadlines": {
            "soft": "02-19-2023",
            "hard": "02-20-2023"
          }
        }
      ]
    }
  ];

  console.log(dataRoles);
  // const [Roles, setRoles] = useState(myData['roles']);
  const [Roles, setRoles] = useState(dataRoles);


  const addNewTask = (role_id, task_id) => {
    const newTaskData = {
      task_id: Number,
      task_type: String,
      is_flexible: Boolean,
      task_dependency: [],
      task_created_date: Date,
      task_description: String,
      task_notes: String,
      deadlines: {
        soft: Date,
        hard: Date
      }
    };

    const targetRoleIndex = Roles.findIndex((index) => index.id === role_id);
    if (targetRoleIndex < 0) return;
    const tempRoles = [...Roles];
    tempRoles[targetRoleIndex].tasks.push(newTaskData);
    setRoles(tempRoles);
  };

  const deleteTask = (task_id, role_id) => {
    console.log(task_id, role_id);
    const targetRoleIndex = Roles.findIndex((index) => index.role_id === role_id)
    if (targetRoleIndex < 0) return;
    console.log('targettasks', Roles[targetRoleIndex].tasks);
    const targettaskId = Roles[targetRoleIndex].tasks.findIndex((index) => index.task_id === task_id);
    if (targettaskId < 0) return;

    const tempRoles = [...Roles];
    tempRoles[targetRoleIndex].tasks.splice(task_id, -1);
    setRoles(tempRoles);
  };

  const addNewRole = (newRole) => {
    setRoles([...Roles, {
      role_type: newRole,
    }])
  };

  const deleteRole = (role_id) => {
    console.log('role_id==', role_id);
    const tempRoles = Roles.filter((index) => index.role_id !== role_id.toString());
    setRoles(tempRoles);
  };


  return (
    <div className="App">
      <header className="App-header">
        <div className="navBar">
          <h1>Conference Role Management</h1>
        </div>
      </header>

      <div className="boardContainer">
        <div className="boardOuter">
          {
            Roles.map((cdata) => <BoardView
              key={cdata.id}
              data={cdata}
              deleteRole={deleteRole}
              addNewTask={addNewTask}
              deleteTask={deleteTask}
            />)
          }
          <div className='addNewRoles'>
            <AddNewRole onSubmit={(newRole) => addNewRole(newRole)} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
