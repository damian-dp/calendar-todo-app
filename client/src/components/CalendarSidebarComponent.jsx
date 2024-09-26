import React from "react";
import { Search, ChevronDown } from "lucide-react";

const Sidebar = () => {
	return (
		<div className="sidebar">
			<div className="search-container">
				<Search className="search-icon" />
				<input
					type="text"
					placeholder="Search events"
					className="search-input"
				/>
			</div>
			<div className="month-header">
				<h2>September 2023</h2>
				<div className="month-nav">
					<ChevronDown className="month-nav-icon" />
				</div>
			</div>
			<div className="mini-calendar">
				<div className="mini-calendar-header">
					{["S", "M", "T", "W", "T", "F", "S"].map((day, i) => (
						<div key={i} className="day-label">
							{day}
						</div>
					))}
				</div>
				<div className="mini-calendar-days">
					{Array.from({ length: 35 }, (_, i) => (
						<div
							key={i}
							className={`calendar-day ${i === 5 ? "current-day" : ""}`}
						>
							{i + 1}
						</div>
					))}
				</div>
			</div>
			<h3 className="todo-header">Todo List</h3>
			{/* Todo list items would go here */}
		</div>
	);
};

export default Sidebar;
