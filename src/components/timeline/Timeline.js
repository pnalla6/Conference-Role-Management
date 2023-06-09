// import React, { useState, useEffect } from 'react';
// import moment from 'moment';
// import './Timeline.css';

// function Timeline(props) {
//   const { conferenceDates } = props;
//   const allRoles = conferenceDates?.roles || {};
//   const allTasks = Object.values(allRoles).flatMap(role => Object.values(role.tasks || {}));
//   const sortedTasks = allTasks.sort((a, b) => new Date(a.deadlines.hard) - new Date(b.deadlines.hard));

//   const [confCreatedDate, setConfCreatedDate] = useState('');
//   const [confDeadlineDate, setConfDeadlineDate] = useState('');

//   useEffect(() => {
//     if (conferenceDates) {
//       const formattedCreatedDate = formatDate(conferenceDates.conference_created);
//       const formattedDeadlineDate = formatDate(conferenceDates.conference_deadline);
//       setConfCreatedDate(formattedCreatedDate);
//       setConfDeadlineDate(formattedDeadlineDate);
//     }
//   }, [conferenceDates]);

//   function formatDate(dateString) {
//     if (!dateString) {
//       return '';
//     }
//     const date = moment.utc(dateString);
//     return date.format('MMM D');
//   }

//   return (
//     <div className='timelineVertical'>
//       {confCreatedDate && (
//         <code style={{ fontSize: '0.7rem' }}>{confCreatedDate}</code>
//       )}
//       {sortedTasks.map((task, i) => (
//         <div key={i} className='task-dot'>
//           <div className='task-tooltip'>{task.task_description} <br /> Deadline: {task.deadlines.hard}</div>
//         </div>
//       ))}
//       {confDeadlineDate && (
//         <code style={{ fontSize: '0.7rem' }}>{confDeadlineDate}</code>
//       )}
//     </div>
//   );
// }

// export default Timeline;



import React, { useState, useEffect } from 'react';
import moment from 'moment';
import './Timeline.css';

function Timeline(props) {
  const { conferenceDates } = props;
  const allRoles = conferenceDates?.roles || {};
  const allTasks = Object.values(allRoles).flatMap(role => Object.values(role.tasks || {}));
  const sortedTasks = allTasks.sort((a, b) => new Date(a.deadlines.hard) - new Date(b.deadlines.hard));

  const [confCreatedDate, setConfCreatedDate] = useState('');
  const [confDeadlineDate, setConfDeadlineDate] = useState('');
  const [selectedTaskId, setSelectedTaskId] = useState(null); // Track the clicked task ID
  const [allTasksList, setAllTasksList] = useState([]);

  const { getAllTasks } = props;


  useEffect(() => {
    if (conferenceDates) {
      const formattedCreatedDate = formatDate(conferenceDates.conference_created);
      const formattedDeadlineDate = formatDate(conferenceDates.conference_deadline);
      setConfCreatedDate(formattedCreatedDate);
      setConfDeadlineDate(formattedDeadlineDate);
    }
    async function fetchData() {
      const data = await getAllTasks();
      const filteredTasks = data.filter((task) => {
        return task.role_id !== props.role_id;
      });
      setAllTasksList(filteredTasks);
    }
    fetchData();
  }, [conferenceDates]);

  function formatDate(dateString) {
    if (!dateString) {
      return '';
    }
    const date = moment.utc(dateString);
    return date.format('MMM D');
  }

  function handleTaskClick(taskId) {
    setSelectedTaskId(taskId);
  }

  const handleCardClick = (task_id) => {
    const cards = document.getElementsByClassName("card");
  
    for (let i = 0; i < cards.length; i++) {
      const card = cards[i];
      const isClickedCard = allTasksList.some(task => task.task_id === task_id);
      const isCardActiveDot = card.classList.contains("task-active-dot");
  
      if (isClickedCard && card.id === task_id) {
        if (isCardActiveDot) {
          card.classList.remove("task-active-dot");
        } else {
          card.classList.add("task-active-dot");
        }
      } else {
        card.classList.remove("task-active-dot");
      }
    }
  };
  
  
  


  return (
    <div className='timelineVertical'>
      {confCreatedDate && (
        <code style={{ fontSize: '0.7rem' }}>{confCreatedDate}</code>
      )}
      {sortedTasks.map((task, i) => (
        <div
          key={i}
          className={`task-dot ${selectedTaskId === task.task_id ? 'task-selected' : ''}`} // Apply the 'task-selected' class if the task is clicked
          onClick={() => { handleTaskClick(task.task_id); handleCardClick(task.task_id) }} // Handle task click event
        >
          <div className='task-tooltip'>{task.task_description} <br /> Deadline: {task.deadlines.hard}</div>
        </div>
      ))}
      {confDeadlineDate && (
        <code style={{ fontSize: '0.7rem' }}>{confDeadlineDate}</code>
      )}
    </div>
  );
}

export default Timeline;
