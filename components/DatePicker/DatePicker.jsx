import React from "react";
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import "./DatePicker.scss";

export default ({ onChange, selected, allowedDates }) => (
    <>
        <DatePicker
            onChange={onChange}
            selected={selected}
            includeDates={allowedDates}
            inline
        />
    </>
)