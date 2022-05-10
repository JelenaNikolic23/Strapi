import React, { Component } from "react";
import axios from "axios";
import { backend_address as serverip } from "../../../../../config/backend";
import request_config from "../../../../../helpers/RequestConfig";
// Components
import { DropzoneDialog } from "material-ui-dropzone";
import Button from "@material-ui/core/Button";

export default class ShopPictures extends Component {
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
        const shopReportId = localStorage.getItem("ShopReportID");
        const formData = new FormData();
        // Loop through uploaded files and append them to formData
        files.forEach(photo => formData.append("photos", photo));

        try {
          await axios.post(
            `${serverip}/api/shopReports/${shopReportId}/pictures`,
            formData,
            request_config(),
            {
              headers: {
                "Content-Type": "multipart/form-data"
              }
            }
          );
        } catch (err) {
          if (err.response.status === 500) {
            console.log("There was a problem with the server");
          } else {
            console.log(err);
          }
        }
      }
    );
  }

  handleOpen() {
    this.setState({
      open: true
    });
  }

  render() {
    return (
      <div>
        <Button variant="contained" color="primary" onClick={this.handleOpen}>
          Dodaj Slike
        </Button>
        <DropzoneDialog
          open={this.state.open}
          onSave={this.handleSave.bind(this)}
          acceptedFiles={["image/jpeg", "image/png", "image/bmp"]}
          showPreviews={true}
          showFileNamesInPreview={false}
          maxFileSize={5000000}
          onClose={this.handleClose}
          cancelButtonText="Zatvori"
          submitButtonText="Sačuvaj"
          dialogTitle="Dodaj slike"
          dropzoneText="Klikni ovde da dodaš slike"
        />
      </div>
    );
  }
}
