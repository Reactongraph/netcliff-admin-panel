import React, { createRef } from "react";

//spinner
import { BounceLoader } from "react-spinners";

//mui
import { Dialog } from "@mui/material";

//redux
import { useSelector } from "react-redux";

const Loader = () => {
  const ref = createRef();
  const open = useSelector((state) => state.loader.loader);

  return (
    <div>
      <Dialog
        open={open}
        disableEscapeKeyDown
        PaperComponent="div"
        ref={ref}
        style={{ background: "transparent", boxShadow: "none" }}
      >
        <BounceLoader size={60} color="#222e3c" loading={open} />
      </Dialog>
    </div>
  );
};

export default Loader;
