import React from 'react';
import './Timeline.css';
import moment from 'moment';

function Timeline(props) {
    const datetimeCreated = moment(props?.conferenceDates?.conference_created);
    const confCreatedDate = datetimeCreated.format('MMMM Do');

    const datetimeDeadline = moment(props?.conferenceDates?.conference_deadline);
    const confDeadlineDate = datetimeDeadline.format('MMMM Do');

    return (
        <div className='timelineVertical'>
            <code style={{ fontSize: "0.8rem", fontWeight: 'bold' }} className='startDate'>{confCreatedDate}</code>
            <div className='lineParent'>
                <div className='line'></div>
            </div>
            <code style={{ fontSize: "0.8rem", fontWeight: 'bold' }} className='endDate'>{confDeadlineDate}</code>
        </div>
    )
}

export default Timeline