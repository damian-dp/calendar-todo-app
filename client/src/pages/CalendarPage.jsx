import React, { useState } from 'react'
import Sidebar from '../components/CalendarSidebarComponent'
import Header from '../components/CalendarHeaderComponent'
import CalendarGrid from '../components/CalendarGridComponent'
import SettingsComponent from '../components/SettingsComponent'
import ModalComponent from '../components/ModalComponent'
import '../css/CalendarStyles.css'

const CalendarPage = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const navigateWeek = (direction) => {
    const newDate = new Date(currentDate);
    newDate.setDate(currentDate.getDate() + direction * 7);
    setCurrentDate(newDate);
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  const toggleSettings = () => {
    setIsSettingsOpen(!isSettingsOpen);
  };

  const closeSettings = () => {
    setIsSettingsOpen(false);
  };

  return (
    <div className="calendar-container">
      <Sidebar />
      <div className="main-content">
        {isSettingsOpen && (
          <ModalComponent>
            <SettingsComponent onClose={closeSettings} />
          </ModalComponent>
        )}
        <Header 
          currentDate={currentDate} 
          navigateWeek={navigateWeek} 
          goToToday={goToToday}
          toggleSettings={toggleSettings}
        />
        <CalendarGrid currentDate={currentDate} />
      </div>
    </div>
  )
}

export default CalendarPage