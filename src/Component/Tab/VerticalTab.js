// import * as React from "react";

// export const TabPanel = (props, isActive) => {
//   const { children, index } = props;

//   return (
//     <div class={`tab-pane ${isActive ? "active" : ""}`} id={`tab${index}`}>
//       {children}
//     </div>
//   );
// };

// export default function VerticalTab({ tabs, children, activeIndex }) {
//   return (
//     <div class="row">
//       <div class="col-md-3">
//         <ul class="nav nav-tabs tabs-left flex-column">
//           {tabs.map((tabItem) => {
//             return (
//               <li
//                 class={activeIndex === tabItem.index ? "active" : ""}
//                 key={tabItem.index}
//               >
//                 <a href={`#tab${tabItem.index}`} data-toggle="tab">
//                   <span style={tabItem.hasError ? { color: "red" } : {}}>
//                     {tabItem.label} {tabItem.hasError ? "*" : ""}
//                   </span>
//                 </a>
//               </li>
//             );
//           })}
//         </ul>
//       </div>
//       <div class="col-md-9">
//         <div class="tab-content">{children}</div>
//       </div>
//     </div>
//   );
// }



// MUI
import * as React from "react";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";

export const TabPanel = (props) => {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`vertical-tabpanel-${index}`}
      aria-labelledby={`vertical-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box className="tab-width" sx={{ px: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
};

export default function VerticalTab({ tabs, children, setTabValue, tabValue }) {
  const handleChange = (event, newValue) => {
    setTabValue(newValue);
  };

  return (
    <Box
      sx={{
        display: "flex",
      }}
    >
      <Tabs
        orientation="vertical"
        value={tabValue}
        onChange={handleChange}
        aria-label="Vertical tabs example"
        sx={{ borderRight: 1, borderColor: "divider" }}
      >
        {tabs.map((tabItem) => {
          return (
            <Tab
              sx={{
                color: "#000",
                width: "200px",
                textTransform: "capitalize",
              }}
              label={
                <span style={tabItem.hasError ? { color: "red" } : {}}>
                  {tabItem.label} {tabItem.hasError ? "*" : ""}
                </span>
              }
              id={`vertical-tab-${tabItem.index}`}
              aria-controls={`vertical-tabpanel-${tabItem.index}`}
              disabled={tabItem.disabled}
            />
          );
        })}
      </Tabs>
      <>{children}</>
    </Box>
  );
}

