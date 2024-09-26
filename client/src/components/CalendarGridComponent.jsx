import React, { useState, useEffect, useRef } from "react";

const CalendarGrid = ({ currentDate }) => {
	const [weekDates, setWeekDates] = useState([]);
	const timeSlotRef = useRef(null);

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

	useEffect(() => {
		const scrollToCurrentTime = () => {
			if (timeSlotRef.current) {
				const now = new Date();
				const currentHour = now.getHours();
				const scrollPosition =
					((currentHour - 1) * 10 * window.innerHeight) / 100;
				const middleOffset = window.innerHeight / 2;
				// Scroll an additional 20% of the viewport height
				const additionalScroll = window.innerHeight * 0.3;
				timeSlotRef.current.scrollTop =
					scrollPosition - middleOffset + additionalScroll;
			}
		};

		// Delay the scroll to ensure the component has rendered
		const timeoutId = setTimeout(scrollToCurrentTime, 100);

		// Clean up the timeout on component unmount
		return () => clearTimeout(timeoutId);
	}, []);

	const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
	const hours = Array.from({ length: 24 }, (_, i) => i);

	const allDayEvents = [
		{ id: 1, title: "Report Day", start: 1, end: 5, color: "#e6fffa" },
		{ id: 2, title: "Pay Day", start: 1, end: 1, color: "#feebc8" },
		{ id: 3, title: "Another Event", start: 4, end: 4, color: "#feebc8" },
	];

	const events = [
		{
			id: 1,
			title: "Afternoon Meeting",
			start: 15,
			end: 17,
			day: 1,
			color: "var(--category-color-1)",
		},
		{
			id: 2,
			title: "Long Event",
			start: 10,
			end: 15,
			day: 3,
			color: "var(--category-color-2)",
		},
		{
			id: 3,
			title: "Short Event",
			start: 14,
			end: 15,
			day: 5,
			color: "var(--category-color-3)",
		},
	];

	const getEventStyle = (event) => {
		return {
			gridArea: `${event.start + 1} / ${event.day + 2} / span ${
				event.end - event.start
			} / span 1`,
		};
	};

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

				<div className="time-slots" ref={timeSlotRef}>
					{hours.map((hour) => (
						<React.Fragment key={hour}>
							<div className="time-slot">{hour === 0 ? "" : `${hour}:00`}</div>
							{weekDates.map((date, index) => (
								<div key={`${index}-${hour}`} className="day-slot"></div>
							))}
						</React.Fragment>
					))}
					{events.map((event) => (
						<div key={event.id} className="event" style={getEventStyle(event)}>
							<div
								className="event-content"
								style={{ backgroundColor: event.color }}
							>
								{event.title}
								<br />
								{`${event.start}:00 - ${event.end}:00`}
							</div>
						</div>
					))}
				</div>
			</div>
		</div>
	);
};

export default CalendarGrid;
