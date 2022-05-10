import React, { useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
// @material-ui/icons
import Snackbar from "@material-ui/core/Snackbar";
import IconButton from "@material-ui/core/IconButton";
import Slide from "@material-ui/core/Slide";
import CloseIcon from "@material-ui/icons/Close";
import SuccessIcon from "@material-ui/icons/CheckCircle";
import ErrorIcon from "@material-ui/icons/Error";

const useStyles = makeStyles(theme => ({
  close: {
    padding: theme.spacing(0.5)
  },
  snackbarRoot: {
    backgroundColor: "#4caf50"
  },
  snackbarRootError: {
    backgroundColor: "#f55a4e"
  }
}));

export default function Notifications(props) {
  const classes = useStyles();
  const [open, setOpen] = React.useState(true);
  const [snackBar, setSnackBar] = React.useState();

  const handleClick = () => {
    setOpen(false);
  };
  // When props open and notificationType changes run the function to open the snackbar and set type
  useEffect(() => {
    setOpen(props.open);
    setSnackBar(props.notificationType);
  }, [props.open, props.notificationType]);

  const setSnackbar = type => {
    switch (type) {
      case "ShopReportSuccess":
        return (
          <Snackbar
            TransitionComponent={Slide}
            anchorOrigin={{ vertical: "top", horizontal: "center" }}
            open={open}
            autoHideDuration={4000}
            message={
              <span
                id="message-id"
                style={{ display: "flex", alignItems: "center" }}
              >
                <SuccessIcon style={{ marginRight: "5px" }} />
                Shop Report je sačuvan.
              </span>
            }
            ContentProps={{
              "aria-describedby": "message-id",
              classes: {
                root: classes.snackbarRoot
              }
            }}
            onClose={handleClick}
            action={[
              <IconButton
                onClick={handleClick}
                color="inherit"
                key="close"
                aria-label="close"
              >
                <CloseIcon />
              </IconButton>
            ]}
          />
        );
      case "ShopReportFailed":
        return (
          <Snackbar
            TransitionComponent={Slide}
            anchorOrigin={{ vertical: "top", horizontal: "center" }}
            open={open}
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
                root: classes.snackbarRootError
              }
            }}
            onClose={handleClick}
            action={[
              <IconButton
                onClick={handleClick}
                color="inherit"
                key="close"
                aria-label="close"
              >
                <CloseIcon />
              </IconButton>
            ]}
          />
        );
      case "ActionPlanSuccess":
        return (
          <Snackbar
            TransitionComponent={Slide}
            anchorOrigin={{ vertical: "top", horizontal: "center" }}
            open={open}
            autoHideDuration={6000}
            message={
              <span
                id="message-id"
                style={{ display: "flex", alignItems: "center" }}
              >
                <SuccessIcon style={{ marginRight: "5px" }} />
                Uspešno je sačuvano
              </span>
            }
            ContentProps={{
              "aria-describedby": "message-id",
              classes: {
                root: classes.snackbarRoot
              }
            }}
            onClose={handleClick}
            action={[
              <IconButton
                onClick={handleClick}
                color="inherit"
                key="close"
                aria-label="close"
              >
                <CloseIcon />
              </IconButton>
            ]}
          />
        );
      case "ActionPlanFailed":
        return (
          <Snackbar
            TransitionComponent={Slide}
            anchorOrigin={{ vertical: "top", horizontal: "center" }}
            open={open}
            autoHideDuration={3000}
            message={
              <span
                id="message-id-error"
                style={{ display: "flex", alignItems: "center" }}
              >
                <ErrorIcon style={{ marginRight: "5px" }} />
                Greška! Nije sačuvano.
              </span>
            }
            ContentProps={{
              "aria-describedby": "message-id-error",
              classes: {
                root: classes.snackbarRootError
              }
            }}
            onClose={handleClick}
            action={[
              <IconButton
                onClick={handleClick}
                color="inherit"
                key="close"
                aria-label="close"
              >
                <CloseIcon />
              </IconButton>
            ]}
          />
        );
      default:
        return null;
    }
  };
  return <>{setSnackbar(snackBar)}</>;
}
