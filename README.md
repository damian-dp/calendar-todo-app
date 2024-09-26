# CalendarToDo App

A comprehensive web application that combines a feature-rich calendar with an integrated todo list functionality.

## Features

### Calendar
- Create, edit, and delete events
- Set recurring events (daily, weekly, monthly, yearly)
- View calendar in day, week, and month formats
- Set reminders for events
- Share calendars with other users
- Export calendar to standard formats (e.g., iCal)
- Color-coding for different event types

### Todo List
- Create, edit, and delete todo items
- Set priorities for tasks
- Organise tasks into categories or projects
- Set due dates for tasks
- Add notes or attachments to tasks
- Mark tasks as complete
- Filter and sort tasks

### Integration
- Todo items with reminders appear on the calendar
- Drag and drop tasks to calendar dates
- Convert calendar events to todo items and vice versa

### User Experience
- Responsive design for mobile and desktop use
- Dark mode option

### Additional Features
- Search functionality across events and tasks

## Tech Stack

- Frontend: Vanilla JavaScript, HTML5, CSS3
- Backend: Node.js with Express.js
- Database: MongoDB
- Authentication: JSON Web Tokens (JWT)
- Deployment: Vercel (for both frontend and backend)

## Technical Implementation

### Security Measures
- Use HTTPS for all communications
- Store passwords using bcrypt for secure hashing
- Use environment variables for sensitive information

### Performance Optimisation
- Implement lazy loading for calendar events and todo items
- Use client-side caching for frequently accessed data
- Optimise database queries with proper indexing