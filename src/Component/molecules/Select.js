import React from "react";
import { Typography } from "@mui/material";

const Select = ({
    label,
    options = [],
    placeholder = "Select Option",
    className = "col-md-6 my-2",
    labelClassName = "float-left styleForTitle",
    selectClassName = "form-control",
    required = false,
    value,
    onChange,
    error,
    ...props
}) => {
    return (
        <div className={className}>
            {label && (
                <label className={labelClassName}>
                    {label} {required && "*"}
                </label>
            )}
            <select
                className={selectClassName}
                required={required}
                value={value}
                onChange={onChange}
                {...props}
            >
                <option value="">{placeholder}</option>
                {options.map((option, index) => (
                    <option key={index} value={option.value}>
                        {option.label}
                    </option>
                ))}
            </select>
            {error && (
                <div className="pl-1 text-left">
                    <Typography
                        variant="caption"
                        style={{
                            fontFamily: "Circular-Loom",
                            color: "#ee2e47",
                        }}
                    >
                        {error}
                    </Typography>
                </div>
            )}
        </div>
    );
};

export default Select;
