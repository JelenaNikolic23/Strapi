import React, { Component } from "react";
import axios from "axios";
import { backend_address as serverip } from "../../../../config/backend";
import request_config from "../../../../helpers/RequestConfig";

import GoToEvaluationsButtons from "./GoToEvaluationsButtons";
import CardAvatar from "components/Card/CardAvatar.jsx";
import GridItem from "components/Grid/GridItem.jsx";
import GridContainer from "components/Grid/GridContainer.jsx";
import Card from "components/Card/Card.jsx";
import CardBody from "components/Card/CardBody.jsx";
import avatar from "assets/img/faces/user-icon.jpg";

import { Redirect } from "react-router-dom";
// Components
import { DropzoneDialog } from "material-ui-dropzone";
import Button from "@material-ui/core/Button";

class ProfileHeader extends Component {
  constructor(props) {
    super(props);

    this.state = {
      user: "",
      open: false,
      files: [],
      imageExist: false,
      avatarPath: `uploads/usersAvatar/${this.props.frontline_id}`
    };

    this.handleOpen = this.handleOpen.bind(this);
    this.handleClose = this.handleClose.bind(this);
  }

  componentDidMount() {
    const { frontline_id } = this.props;
    // Call backend API users to set user data into profile

    if (frontline_id) {
      axios
        .get(`${serverip}/api/users/${frontline_id}`, request_config())
        .then(user => {
          this.setState({
            user: user.data
          });
        })
        .catch(error => {
          console.log(error);
        });
    }

    // check if image avatar exist for logged user

    if (frontline_id) {
      axios
        .get(`/uploads/usersAvatar/${frontline_id}`, request_config(), {
          headers: {
            "Access-Control-Allow-Origin": "*"
          }
        })
        .then(image => {
          if (image.status === 200) {
            this.setState({
              imageExist: true
            });
          }
        })
        .catch(error => {
          console.log(error);
        });
    }
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
        const formData = new FormData();
        // Loop through uploaded files and append them to formData
        files.forEach(photo => formData.append("photos", photo));

        try {
          axios
            .post(
              `${serverip}/api/users/avatarPicture/${this.state.user.name}/${
                this.state.user.id
              }`,
              formData,
              request_config(),
              {
                headers: {
                  "Content-Type": "multipart/form-data",
                  "Access-Control-Allow-Origin": "*"
                }
              }
            )
            .then(imageUpload => {
              if (imageUpload.status === 200) {
                const randNumber = Math.floor(Math.random() * 100);

                this.setState({
                  imageExist: imageUpload.data.imgUpload,
                  avatarPath: `uploads/usersAvatar/${
                    this.props.frontline_id
                  }?${randNumber}`
                });
              }
            })
            .catch(error => {
              console.log(error);
            });
        } catch (err) {
          if (err.status === 500) {
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
    const { classes, frontline_id } = this.props;
    const { imageExist, user, avatarPath } = this.state;
    const frontLineId = JSON.parse(localStorage.getItem("frontline_id"));
    const isUserPofile = parseInt(frontLineId) === user.id ? true : false;

    const ls_role = localStorage.getItem("elearningrole");
    const ls_id = localStorage.getItem("frontline_id");
    if (parseInt(ls_role) < 2 && parseInt(frontline_id) !== parseInt(ls_id)) {
      return <Redirect to="/error" />;
    }

    return (
      <div>
        <GridContainer>
          <GridItem
            xs={12}
            sm={12}
            md={12}
            style={{ display: "flex", justifyContent: "center" }}
          >
            <Card profile>
              <CardAvatar profile>
                <img src={imageExist ? avatarPath : avatar} alt="avatarPhoto" />
              </CardAvatar>
              {isUserPofile ? (
                <GridItem
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    marginTop: "15px"
                  }}
                >
                  <Button
                    color="primary"
                    onClick={this.handleOpen}
                    style={{
                      fontSize: 12,
                      fontFamily: "Arial, Helvetica, sans-serif"
                    }}
                  >
                    Dodaj sliku
                  </Button>
                </GridItem>
              ) : null}
              <DropzoneDialog
                open={this.state.open}
                filesLimit={1}
                onSave={this.handleSave.bind(this)}
                acceptedFiles={["image/jpeg", "image/png", "image/bmp"]}
                showPreviews={true}
                showFileNamesInPreview={false}
                maxFileSize={5000000}
                onClose={this.handleClose}
                cancelButtonText="Zatvori"
                submitButtonText="Sačuvaj"
                dialogTitle="Dodaj sliku"
                dropzoneText="Klikni ovde da dodaš sliku"
              />
              <CardBody profile>
                <h3 className={classes.cardTitle}>
                  {user.fullname
                    ? `${user.fullname.split(" ")[0]} 
                  ${user.fullname.split(" ")[1]}`
                    : null}
                </h3>
                <p className={classes.description}>
                  {user.email}
                  <br />
                  Prodajno mesto:&nbsp;
                  {user.group_name === "null" ? "-" : user.group_name}
                  <br />
                </p>
                <GoToEvaluationsButtons user={user} />
              </CardBody>
            </Card>
          </GridItem>
          {/* <GridItem xs={12} sm={12} md={8}>
            <Card profile>
              <CardBody profile />
            </Card>
          </GridItem> */}
        </GridContainer>
      </div>
    );
  }
}

export default ProfileHeader;
