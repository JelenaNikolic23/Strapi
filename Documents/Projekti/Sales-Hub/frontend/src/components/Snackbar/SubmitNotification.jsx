import React from "react";

// @material-ui/core components
import Snackbar from "@material-ui/core/Snackbar";
import IconButton from "@material-ui/core/IconButton";
import Slide from "@material-ui/core/Slide";
import { makeStyles } from "@material-ui/core/styles";

// @material-ui/icons
import CloseIcon from "@material-ui/icons/Close";
import SuccessIcon from "@material-ui/icons/CheckCircle";
import ErrorIcon from "@material-ui/icons/Error";

const useStyles = makeStyles((theme) => ({
  snackbarSuccess: {
    backgroundColor: "#B4FF00", //green
  },
  snackbarError: {
    backgroundColor: "#f55a4e", // red
  },
}));

const SubmitNotification = ({
  success,
  error,
  closeSnackbarSuccess,
  closeSnackbarError,
  text,
}) => {
  const classes = useStyles();
  const message = text ? text : "Evaluacija je sačuvana.";
  return (
    <div>
      <Snackbar
        TransitionComponent={Slide}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        open={success}
        autoHideDuration={3000}
        message={
          <span
            id="message-id"
            style={{ display: "flex", alignItems: "center" }}
          >
            <SuccessIcon style={{ marginRight: "5px" }} />
            {message}
          </span>
        }
        ContentProps={{
          "aria-describedby": "message-id",
          classes: {
            root: classes.snackbarSuccess,
          },
        }}
        onClose={closeSnackbarSuccess}
        action={[
          <IconButton
            onClick={closeSnackbarSuccess}
            color="inherit"
            key="close"
            aria-label="close"
          >
            <CloseIcon />
          </IconButton>,
        ]}
      />
      <Snackbar
        TransitionComponent={Slide}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        open={error}
        autoHideDuration={3000}
        message={
          <span
            id="message-id-error"
            style={{ display: "flex", alignItems: "center" }}
          >
            <ErrorIcon style={{ marginRight: "5px" }} />
            Greška! Evaluacija nije sačuvana.
          </span>
        }
        ContentProps={{
          "aria-describedby": "message-id-error",
          classes: {
            root: classes.snackbarError,
          },
        }}
        onClose={closeSnackbarError}
        action={[
          <IconButton
            onClick={closeSnackbarError}
            color="inherit"
            key="close"
            aria-label="close"
          >
            <CloseIcon />
          </IconButton>,
        ]}
      />
    </div>
  );
};

export default SubmitNotification;
