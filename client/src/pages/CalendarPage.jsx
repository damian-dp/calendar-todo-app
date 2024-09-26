import React, { useState } from 'react'
import Sidebar from '../components/CalendarSidebarComponent'
import Header from '../components/CalendarHeaderComponent'
import CalendarGrid from '../components/CalendarGridComponent'
import '../css/CalendarStyles.css'

const CalendarPage = () => {
  const [currentDate, setCurrentDate] = useState(new Date());

  const navigateWeek = (direction) => {
    const newDate = new Date(currentDate);
    newDate.setDate(currentDate.getDate() + direction * 7);
    setCurrentDate(newDate);
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  return (
    <div className="calendar-container">
      <Sidebar />
      <div className="main-content">
        <Header currentDate={currentDate} navigateWeek={navigateWeek} goToToday={goToToday} />
        <CalendarGrid currentDate={currentDate} />
      </div>
    </div>
  )
}

export default CalendarPage