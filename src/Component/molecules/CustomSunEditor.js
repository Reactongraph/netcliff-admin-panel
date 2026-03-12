import React from "react";
import SunEditor from "suneditor-react";
import "suneditor/dist/css/suneditor.min.css";
import { Typography } from "@mui/material";

const defaultEditorOptions = {
    buttonList: [
        ["undo", "redo"],
        ["font", "fontSize", "formatBlock"],
        ["fontColor", "hiliteColor", "textStyle"],
        ["removeFormat"],
        ["bold", "underline", "italic", "subscript", "superscript"],
        ["align", "list", "lineHeight"],
        ["link"],
        ["fullScreen"],
    ],
};

const CustomSunEditor = ({
    label,
    value,
    onChange,
    placeholder,
    error,
    height = 200,
    width = "100%",
    setOptions = defaultEditorOptions,
    required = false,
    className = "custom_field_col wdt100",
    labelClassName,
    editorRef
}) => {
    return (
        <div className={className}>
            {label && <label className={labelClassName}>{label} {required && "*"}</label>}
            <SunEditor
                setContents={value}
                onChange={onChange}
                placeholder={placeholder}
                setOptions={setOptions}
                height={height}
                width={width}
                ref={editorRef}
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

export default CustomSunEditor;
