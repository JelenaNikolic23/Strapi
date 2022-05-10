import React from "react";
// material-ui components
import withStyles from "@material-ui/core/styles/withStyles";
import Slide from "@material-ui/core/Slide";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";
import IconButton from "@material-ui/core/IconButton";
// @material-ui/icons
import Close from "@material-ui/icons/Close";
// core components
import Button from "../../components/CustomButtons/Button.jsx";
import baki from "../../assets/jss/material-dashboard-react/baki.jsx";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="down" ref={ ref } { ...props } />;
});

function Modal({ selectedUser, message, disabled, classes, submit }) {


  const [modal, setModal] = React.useState(false);
  const handleClickOpen = () => {
    setModal(true);
  };
  const handleClose = () => {
    setModal(false);
  };

  const defaultSelectUser = { "fullname": "Telenor" };
  const user = selectedUser ? selectedUser : defaultSelectUser;
  const defaulMessage = `Da li potvrđujete da ${ user.fullname } dobije ovu
    evaluaciju?`;
  const msg = message ? message : defaulMessage;
  return (
    <div>
      <Button
        color="primary"
        onClick={ handleClickOpen }
        disabled={ disabled ? true : false }
      >
        Sačuvaj
      </Button>
      <Dialog
        classes={ {
          root: classes.center,
          paper: classes.modal
        } }
        open={ modal }
        TransitionComponent={ Transition }
        keepMounted
        onClose={ handleClose }
        aria-labelledby="modal-slide-title"
        aria-describedby="modal-slide-description"
      >
        <DialogTitle
          id="classic-modal-slide-title"
          disableTypography
          className={ classes.modalHeader }
        >
          <IconButton
            className={ classes.modalCloseButton }
            key="close"
            aria-label="Close"
            color="inherit"
            onClick={ handleClose }
          >
            <Close className={ classes.modalClose } />
          </IconButton>
          {/* <h4 className={classes.modalTitle}>Modal title</h4> */ }
        </DialogTitle>
        <DialogContent
          id="modal-slide-description"
          className={ classes.modalBody }
        >
          <h5>
            { msg }
          </h5>
        </DialogContent>
        <DialogActions
          className={ classes.modalFooter + " " + classes.modalFooterCenter }
        >
          <Button onClick={ handleClose }>Ne</Button>
          <form>
            <Button
              type={ submit }
              onClick={ handleClose }
              color="success"
            >
              Da
            </Button>
          </form>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default withStyles(baki)(Modal);
