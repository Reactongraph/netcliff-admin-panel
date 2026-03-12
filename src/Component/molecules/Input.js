import React from "react";
import { Typography } from "@mui/material";

const Input = ({
    label,
    type = "text",
    placeholder,
    className = "col-md-6 my-2",
    labelClassName = "float-left styleForTitle",
    inputClassName = "form-control form-control-line",
    required = false,
    value,
    onChange,
    error,
    min,
    ...props
}) => {
    return (
        <div className={className}>
            {label && (
                <label className={labelClassName}>
                    {label} {required && "*"}
                </label>
            )}
            <input
                type={type}
                placeholder={placeholder}
                className={inputClassName}
                required={required}
                value={value}
                onChange={onChange}
                min={min}
                {...props}
            />
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

export default Input;
