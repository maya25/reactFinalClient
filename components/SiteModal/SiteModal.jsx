import React from "react";
import Modal from "react-modal";
import "./SiteModal.scss";
import Box from '../Box/Box';

export default ({ title, text, open, onClose }) => (
    <>
        <Modal
            isOpen={open}
            onRequestClose={onClose}
            ariaHideApp={false}
            className="site-modal-container"
        >
            <div className="site-modal">
                <div className="site-modal-header">
                    <h3 className="site-modal-title">{title}</h3>
                </div>
                <div className="site-modal-content">
                    <Box>
                        <p className="site-modal-text">{text}</p>
                    </Box>
                </div>
                <div className="site-modal-button-container">
                    <button className="site-modal-button" onClick={onClose}>אישור</button>
                </div>
            </div>
        </Modal>
    </>
);