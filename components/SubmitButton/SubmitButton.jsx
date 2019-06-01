import React from 'react';
import './SubmitButton.scss';

export default ({ children }) => (
    <button type="submit" className="site-submit-btn">{children}</button>
)