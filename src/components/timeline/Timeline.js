import React from 'react';
import './Timeline.css';
import { VerticalTimeline, VerticalTimelineElement } from 'react-vertical-timeline-component';
import 'react-vertical-timeline-component/style.min.css';

function Timeline() {
    return (
        <div className='timelineVertical'>
            <code className='startDate'>03/24/2023</code>
            <div className='lineParent'>
                <div className='line'></div>
            </div>
            <code className='endDate'>03/29/2023</code>
        </div>
    )
}

export default Timeline