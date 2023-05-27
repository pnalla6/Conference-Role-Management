import React, { useState } from 'react';
import moment from 'moment';
import './Timeline.css';
function Timeline(props) {
    const { conferenceDates } = props;
    const allRoles = conferenceDates?.roles || {};
  
    const allTasks = Object.values(allRoles).flatMap(role => Object.values(role.tasks || {}));
    const sortedTasks = allTasks.sort((a, b) => new Date(a.deadlines.hard) - new Date(b.deadlines.hard));
  
    return (
      <div className='timelineVertical'>
        {sortedTasks.map((task, i) => (
          <div key={i} className='task-dot'>
            <div className='task-tooltip'>{task.task_description}</div>
          </div>
        ))}
      </div>
    );
  }
  
  export default Timeline;
  