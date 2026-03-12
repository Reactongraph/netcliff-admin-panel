import React, { useState, useEffect } from "react";

//react-redux
import { useDispatch, useSelector } from "react-redux";
import { connect } from "react-redux";

//action
import { insertFaQ, updateFaQ } from "../../store/Faq/faq.action";
import { CLOSE_DIALOG } from "../../store/Faq/faq.type";

// material-ui
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Tooltip,
  TextField,
} from "@mui/material";
import CancelIcon from "@mui/icons-material/Cancel";
import styled from "styled-components";

//Alert

const StyledTextField = styled(TextField)`
  .MuiInputBase-root {
    color: #fff;
    background: #221f3a;
    fontsize: "1rem";
    fontweight: "400";
    lineheight: "1.5";
    border: none;
    borderradius: 0.25rem !important;
    transition: border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
  }
  .MuiInput-underline::before {
    border: none;
  }
  .MuiInput-underline:hover:not(.Mui-disabled)::before {
    border: none;
  }
  .MuiInput-underline::after {
    border: none;
  }
`;

const FaqDialog = (props) => {
  const { dialog: open, dialogData } = useSelector((state) => state.FaQ);

  const dispatch = useDispatch();

  //define states
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");

  const [faqId, setFaqId] = useState("");
  // const [mid, setMid] = useState([]);
  const [error, setError] = useState({
    question: "",
    answer: "",
  });

  //Insert Data Functionality
  const submitInsert = () => {
    if (!question || !answer) {
      const error = {};
      if (!question) error.question = "Question is Required !";
      if (!answer) error.answer = "Answer is Required !";

      return setError({ ...error });
    }
    dispatch({ type: CLOSE_DIALOG });

    const formData = {
      question,
      answer,
    };

    props.insertFaQ(formData);
  };

  //Empty Data After Insert
  useEffect(() => {
    setQuestion("");
    setAnswer("");
    setFaqId("");
    setError({
      question: "",
      answer: "",
    });
  }, [open]);

  //Set Data Value
  useEffect(() => {
    if (dialogData) {
      setQuestion(dialogData.question);
      setAnswer(dialogData.answer);
      setFaqId(dialogData._id);
    }
  }, [dialogData]);

  //Update Function
  const submitUpdate = () => {
    if (!question) {
      const error = {};
      if (!question) error.question = "Question is Required !";
      if (!answer) error.answer = "Answer is Required !";

      return setError({ ...error });
    }
    dispatch({ type: CLOSE_DIALOG });

    const formData = {
      question,
      answer,
    };

    props.updateFaQ(faqId, formData);
  };

  //Close Dialog
  const handleClose = () => {
    dispatch({ type: CLOSE_DIALOG });
  };

  return (
    <>
      <Dialog
        open={open}
        aria-labelledby="responsive-dialog-title"
        onClose={handleClose}
        disableBackdropClick
        disableEscapeKeyDown
        fullWidth
        maxWidth="xs"
      >
        <DialogTitle id="responsive-dialog-title">
          {dialogData ? <h5>Edit FAQ</h5> : <h5>Add FAQ</h5>}
        </DialogTitle>

        <Tooltip title="Close">
          <CancelIcon
            className="cancelButton"
            sx={{
              position: "absolute",
              top: "10px",
              right: "10px",
              color: "#fff",
            }}
            onClick={handleClose}
          />
        </Tooltip>

        <DialogContent style={{ padding: 0 }}>
          <div className="modal-body">
            <div className="d-flex flex-column">
              <form>
                <div className="form-group">
                  <div className="row">
                    <div className="col-md-12 my-2">
                      <label className="float-left styleForTitle">
                        Question
                      </label>

                      <input
                        type="text"
                        placeholder="Question"
                        style={{ color: "#fdfdfd" }}
                        // className="form-control form-control-line"
                        className="form-control"
                        required
                        value={question}
                        onChange={(e) => {
                          setQuestion(e.target.value);

                          if (!e.target.value) {
                            return setError({
                              ...error,
                              question: "Question is Required!",
                            });
                          } else {
                            return setError({
                              ...error,
                              question: "",
                            });
                          }
                        }}
                      />
                      {error.question && (
                        <div className="pl-1 text-left">
                          {error.question && (
                            <span className="error">{error.question}</span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="row">
                    <div className="col-md-12 my-2">
                      <label className="float-left styleForTitle">Answer</label>
                      <textarea
                        class="form-control"
                        placeholder="Answer"
                        id="exampleFormControlTextarea1"
                        rows="5"
                        value={answer}
                        onChange={(e) => {
                          setAnswer(e.target.value);

                          if (!e.target.value) {
                            return setError({
                              ...error,
                              answer: "Answer is Required!",
                            });
                          } else {
                            return setError({
                              ...error,
                              answer: "",
                            });
                          }
                        }}
                      ></textarea>

                      {error.answer && (
                        <div className="pl-1 text-left">
                          {error.answer && (
                            <span className="error">{error.answer}</span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </DialogContent>
        <div>
          <hr className=" dia_border w-100"></hr>
        </div>
        <DialogActions>
          <button
            type="button"
            className="btn btn-danger btn-sm px-3 py-1 mb-3"
            onClick={handleClose}
          >
            Cancel
          </button>
          {dialogData ? (
            <button
              type="button"
              className="btn btn-primary btn-sm px-3 py-1 mr-3 mb-3"
              onClick={submitUpdate}
            >
              Update
            </button>
          ) : (
            <button
              type="button"
              className="btn btn-primary btn-sm px-3 py-1 mr-3 mb-3"
              onClick={submitInsert}
            >
              Insert
            </button>
          )}
        </DialogActions>
      </Dialog>
    </>
  );
};

export default connect(null, { insertFaQ, updateFaQ })(FaqDialog);
