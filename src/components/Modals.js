// src/components/Modals.js

import React, { useState, useEffect } from 'react';
import { Modal } from 'react-bootstrap';

const ErrorModal = ({ show, message, onClose }) => {
    const [errorMessage, setErrorMessage] = useState('');
    const [showErrorModal, setShowErrorModal] = useState(false);

    const displayError = (message) => {
        setErrorMessage(message);
        setShowErrorModal(true);
        const timer = setTimeout(() => {
            setShowErrorModal(false);
        }, 5000);
        return () => clearTimeout(timer);
    };

    useEffect(() => {
        // Assume displayError is globally available
        window.displayError = displayError;
    }, []);


    return (
        <Modal show={showErrorModal} centered onHide={() => setShowErrorModal(false)}>
            <Modal.Header closeButton>
                <Modal.Title>Error</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <p className="text-danger">{errorMessage}</p>
            </Modal.Body>
        </Modal>
    );
};

const ConfirmationModal = ({ show, message, onConfirm, onCancel }) => {
    return (
        <Modal show={show} centered onHide={onCancel}>
            <Modal.Header closeButton>
                <Modal.Title>Confirmation</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <p>{message}</p>
                <div className="d-flex justify-content-end">
                    <button className="btn btn-secondary mr-2" onClick={onCancel}>Cancel</button>
                    <button className="btn btn-danger" onClick={onConfirm}>Confirm</button>
                </div>
            </Modal.Body>
        </Modal>
    );
};


export { 
    ErrorModal, 
    ConfirmationModal 
};
