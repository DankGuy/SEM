import React from "react";
const ComparisonModal = ({ selectedProgrammeDetails, onClose }) => {
    const modalStyle = {
        // Define your modal style here
    };

    return (
        <div className="modal" style={modalStyle}>
            <div className="modal-content">
                <span className="close" onClick={onClose}>&times;</span>

                {/* Render details for each selected programme */}
                {selectedProgrammeDetails.map((programme, index) => (
                    <div key={index}>
                        {/* Render programme details here */}
                        <h2>{programme.programme_name}</h2>
                        <p>{programme.programme_overview}</p>
                        {/* Add similar checks for other components */}
                        <p>Local Fee: {programme.local_fee}</p>
                        <p>Interfere: {programme.international_fee}</p>
                        {/* Add more details as needed */}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ComparisonModal;