import React from "react";
import { Switch as MuiSwitch, Typography } from "@mui/material";

const Switch = ({
    label,
    checked,
    onChange,
    name,
    color = "primary",
    className = "exclusiveContainer",
    labelClassName = "float-left",
    disabled = false
}) => {
    return (
        <div className={className} style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <div>
                <MuiSwitch
                    checked={checked}
                    onChange={onChange}
                    color={color}
                    name={name}
                    disabled={disabled}
                    inputProps={{
                        "aria-label": label || "switch",
                    }}
                />
            </div>
            {label && <label className={labelClassName}>{label}</label>}
        </div>
    );
};

export default Switch;
