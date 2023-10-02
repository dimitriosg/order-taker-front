// src/components/ErrorModal.js

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

export default ErrorModal;
