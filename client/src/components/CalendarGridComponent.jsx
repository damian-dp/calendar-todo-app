import React, { useState, useEffect } from "react";

const CalendarGrid = ({ currentDate }) => {
	const [weekDates, setWeekDates] = useState([]);

	useEffect(() => {
		const today = new Date(currentDate);
		const dayOfWeek = today.getDay();
		const startOfWeek = new Date(today);
		startOfWeek.setDate(today.getDate() - dayOfWeek);

		const dates = [];
		for (let i = 0; i < 7; i++) {
			const date = new Date(startOfWeek);
			date.setDate(startOfWeek.getDate() + i);
			dates.push(date);
		}
		setWeekDates(dates);
	}, [currentDate]);

	const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
	const hours = Array.from({ length: 24 }, (_, i) => i);

	const allDayEvents = [
		{ id: 1, title: "Report Day", start: 1, end: 5, color: "#e6fffa" },
		{ id: 2, title: "Pay Day", start: 1, end: 1, color: "#feebc8" },
		{ id: 3, title: "Another Event", start: 4, end: 4, color: "#feebc8" },
	];

	return (
		<div className="calendar-grid-container">
			<div className="calendar-grid">
				<div className="sticky-header">
					<div className="day-headers">
						<div className="time-column-header"></div>
						{weekDates.map((date, index) => (
							<div key={index} className="day-column-header">
								{days[date.getDay()]} {date.getDate()}
							</div>
						))}
					</div>

					<div className="all-day-row">
						<div className="all-day-label">all-day</div>
						<div className="all-day-events-container">
							{allDayEvents.map((event) => (
								<div
									key={event.id}
									className="all-day-event"
									style={{
										backgroundColor: event.color,
										gridColumn: `${event.start + 1} / span ${
											event.end - event.start + 1
										}`,
									}}
								>
									{event.title}
								</div>
							))}
						</div>
					</div>
				</div>

				<div className="time-slots">
					{hours.map((hour) => (
						<React.Fragment key={hour}>
							<div className="time-slot">{hour === 0 ? "" : `${hour}:00`}</div>
							{weekDates.map((date, index) => (
								<div key={`${index}-${hour}`} className="day-slot">
									{(date.getDay() === 1 || date.getDay() === 3 || date.getDay() === 6) &&
										hour === 15 && (
											<div className="event afternoon-meeting">
												Afternoon Meeting
												<br />3 pm - 5 pm
											</div>
										)}
								</div>
							))}
						</React.Fragment>
					))}
				</div>
			</div>
		</div>
	);
};

export default CalendarGrid;
