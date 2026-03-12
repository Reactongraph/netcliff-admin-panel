import { Button, IconButton, Tooltip } from "@mui/material";
import React, { useEffect, useState } from "react";
import SwapHorizIcon from "@mui/icons-material/SwapHoriz";

const GeoBlockingForm = ({ originalList, action, actionTitle, title }) => {
  const [shownList, setShownList] = useState(originalList);
  const [hoveredItem, setHoveredItem] = useState(null);
  const [keyword, setKeyword] = useState("");

  useEffect(() => {
    const lowerCaseSearchTerm = keyword.toLowerCase();
    setShownList(
      originalList.filter((ol) =>
        ol.name.toLowerCase().includes(lowerCaseSearchTerm)
      )
    );
  }, [keyword]);

  useEffect(() => {
    setShownList(originalList);
  }, [originalList]);

  return (
    <>
      <div class="mb-3">
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <label className="float-left styleForTitle movieForm">{title}</label>
          <Button sx={{textTransform: "capitalize"}} onClick={() => action(originalList)}>Move all</Button>
        </div>

        <input
          type="text"
          placeholder="Input your search"
          className="form-control form-control-line"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
        />
      </div>
      <div
        style={{
          height: "450px",
          overflow: "auto",
          border: "1px solid rgb(34 55 56)",
        }}
      >
        {shownList.map((sl) => {
          return (
            <div
              id="item"
              key={sl.key}
              onMouseEnter={() => setHoveredItem(sl._id)}
              onMouseLeave={() => setHoveredItem(null)}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: "10px",
                background: hoveredItem === sl._id ? "rgb(34 55 56)" : "none",
                paddingLeft: 5,
                paddingRight: 5,
                lineHeight: "35px",
              }}
            >
              <span style={{ textTransform: "capitalize" }}>
                {sl.flag} {sl.name.toLowerCase()}
              </span>
              {hoveredItem === sl._id && (
                <Tooltip title={actionTitle}>
                  <IconButton onClick={() => action(sl)}>
                    <SwapHorizIcon />
                  </IconButton>
                </Tooltip>
              )}
            </div>
          );
        })}
      </div>
    </>
  );
};

export default GeoBlockingForm;
