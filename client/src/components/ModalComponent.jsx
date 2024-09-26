import React from "react";
import "../css/ModalStyles.css";

const ModalComponent = ({ children }) => {
	return (
		<div className="modal-overlay">
			<div className="modal-content">
				<div className="modal-body">{children}</div>
			</div>
		</div>
	);
};

export default ModalComponent;
