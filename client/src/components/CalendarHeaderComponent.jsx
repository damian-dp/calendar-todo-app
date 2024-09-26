import React, { useState, useEffect } from "react";
import {
	ChevronLeft,
	ChevronRight,
	Grid3X3,
	List,
	Mail,
	Settings,
} from "lucide-react";

const Header = ({ currentDate, navigateWeek, goToToday, toggleSettings }) => {
	const [dateRange, setDateRange] = useState("");

	useEffect(() => {
		updateDateRange(currentDate);
	}, [currentDate]);

	const updateDateRange = (date) => {
		const startOfWeek = new Date(date);
		startOfWeek.setDate(date.getDate() - date.getDay());
		const endOfWeek = new Date(startOfWeek);
		endOfWeek.setDate(startOfWeek.getDate() + 6);

		const monthNames = ["January", "February", "March", "April", "May", "June",
			"July", "August", "September", "October", "November", "December"];

		const month = monthNames[startOfWeek.getMonth()];
		const startDate = startOfWeek.getDate();
		const endDate = endOfWeek.getDate();
		const year = endOfWeek.getFullYear();

		setDateRange(
			<span className="date-range">
				<span className="month">{month}</span>
				{' '}
				<span className="dates">
					<span className="start-date">{startDate}</span>
					–
					<span className="end-date">{endDate}</span>
				</span>
				{' '}
				<span className="year">{year}</span>
			</span>
		);
	};

	return (
		<header className="main-header">
			<div className="header-left">
				<div id="calendar-header-date-range">{dateRange}</div>
				<div className="header-nav">
					<button className="icon-button" onClick={() => navigateWeek(-1)}>
						<ChevronLeft />
					</button>
					<button className="text-button" onClick={goToToday}>
						Today
					</button>
					<button className="icon-button" onClick={() => navigateWeek(1)}>
						<ChevronRight />
					</button>
				</div>
			</div>
			<div className="header-right">
				<button className="icon-button">
					<Grid3X3 />
				</button>
				<button className="icon-button">
					<List />
				</button>
				<button className="icon-button">
					<Mail />
				</button>
				<button className="icon-button" onClick={toggleSettings}>
					<Settings />
				</button>
			</div>
		</header>
	);
};

export default Header;
