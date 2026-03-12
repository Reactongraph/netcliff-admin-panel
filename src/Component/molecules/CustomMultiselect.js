import React from "react";
import Multiselect from "multiselect-react-dropdown";
import { Typography } from "@mui/material";

const CustomMultiselect = ({
    label,
    options,
    selectedValues,
    onSelect,
    onRemove,
    displayValue = "name",
    error,
    placeholder,
    className = "custom_field_col",
    required = false,
    id = "css_custom",
    style = {
        chips: {},
        multiselectContainer: {
            color: "rgba(174, 159, 199, 1)",
        },
        searchBox: {
            border: "none",
            "border-bottom": "1px solid blue",
            "border-radius": "0px",
        },
    }
}) => {
    return (
        <div className={className}>
            {label && <label>{label} {required && "*"}</label>}
            <Multiselect
                options={options}
                selectedValues={selectedValues}
                onSelect={onSelect}
                onRemove={onRemove}
                displayValue={displayValue}
                id={id}
                placeholder={placeholder}
                style={style}
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

export default CustomMultiselect;
