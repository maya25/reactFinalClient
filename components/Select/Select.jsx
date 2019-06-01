import React from "react";
import { MenuItem, Select } from "@material-ui/core";
import "./Select.scss";

export default ({ value, onChange, items, detailed, }) => {
    const options = detailed ?
        items.map((item, idx) => <MenuItem key={idx} value={item.value}>{item.text}</MenuItem>) :
        items.map((item, idx) => <MenuItem key={idx} value={item}>{item}</MenuItem>);

    return (
        <Select value={value} onChange={onChange} className="site-select">
            {options}
        </Select>
    );
}