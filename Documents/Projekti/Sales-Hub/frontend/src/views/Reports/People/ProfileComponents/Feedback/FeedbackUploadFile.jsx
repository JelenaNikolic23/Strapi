import React, { Component } from "react";
import axios from "axios";
import { backend_address as serverip } from "../../../../../config/backend";
import request_config from "../../../../../helpers/RequestConfig";

// Components
import { DropzoneDialog } from "material-ui-dropzone";
import { BackupOutlined } from "@material-ui/icons";
import Tooltip from "@material-ui/core/Tooltip";

export default class FeedbackUploadFile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false,
      files: []
    };
    this.handleOpen = this.handleOpen.bind(this);
    this.handleClose = this.handleClose.bind(this);
  }

  handleClose() {
    this.setState({
      open: false
    });
  }

  handleSave(files) {
    //Saving files to state for further use and closing Modal.
    this.setState(
      {
        files: files,
        open: false
      },
      async () => {
        const files = this.state.files;
        const { id, setFileScan } = this.props;
        const formData = new FormData();
        // Loop through uploaded files and append them to formData
        files.forEach(file => formData.append("file", file));

        try {
          const fileUpload = await axios.post(
            `${serverip}/api/feedbacks/${id}/scanFile`,
            formData,
            request_config(),
            {
              headers: {
                "Content-Type": "multipart/form-data"
              }
            }
          );
          setFileScan(fileUpload.data.fileName);
        } catch (err) {
          if (err.response.status === 500) {
            console.log("There was a problem with the server");
          } else {
            console.log(err);
          }
        }
      }
    );
    console.log(this.state.files);
  }

  handleOpen() {
    this.setState({
      open: true
    });
  }

  render() {
    return (
      <div>
        <Tooltip
          id="tooltip-top"
          title="Dodaj skenirani feedback"
          placement="top"
        >
          <BackupOutlined
            onClick={this.handleOpen}
            color="action"
            style={{ padding: "0 5px", cursor: "pointer" }}
          />
        </Tooltip>
        <DropzoneDialog
          open={this.state.open}
          onSave={this.handleSave.bind(this)}
          acceptedFiles={["application/*"]}
          showPreviews={true}
          showFileNamesInPreview={true}
          maxFileSize={5000000}
          onClose={this.handleClose}
          cancelButtonText="Zatvori"
          submitButtonText="Sačuvaj"
          dialogTitle="Dodaj dokument"
          dropzoneText="Klikni ovde da dodaš dokument"
        />
      </div>
    );
  }
}
