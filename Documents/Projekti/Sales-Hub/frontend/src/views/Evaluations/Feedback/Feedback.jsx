import React, { Component } from "react";
import axios from "axios";
import { backend_address as serverip } from "../../../config/backend";
import request_config from "../../../helpers/RequestConfig";
import { feedbackPDF } from "./Feedback.pdfTemplate";

import CustomSelect from "../../../components/CustomSelect/CustomSelect";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import Notification from "../../../components/Notification/Notification";

// @material-ui/icons
import Search from "@material-ui/icons/Search";
// core components
import GridItem from "components/Grid/GridItem.jsx";
import GridContainer from "components/Grid/GridContainer.jsx";

import Button from "components/CustomButtons/Button.jsx";
import Card from "components/Card/Card.jsx";
import CardHeader from "components/Card/CardHeader.jsx";
import CardBody from "components/Card/CardBody.jsx";
import CardFooter from "components/Card/CardFooter.jsx";
import Autocomplete from "components/Autocomplete/Autocomplete.jsx";
import InputLabel from "@material-ui/core/InputLabel";
import CustomInput from "components/CustomInput/CustomInput.jsx";
import withStyles from "@material-ui/core/styles/withStyles";

import evalStyle from "../../../assets/jss/material-dashboard-react/views/eval.jsx";

export class Feedback extends Component {
  constructor(props) {
    super(props);
    this.state = {
      usersArray: [],
      selectedUser: {},
      feedback: "",
      score: "",
      generatePDF: false,
      notification: ""
    };
    this.setUser = this.setUser.bind(this);
    this.handleFeedback = this.handleFeedback.bind(this);
    this.getScore = this.getScore.bind(this);
    this.handlePDF = this.handlePDF.bind(this);
    this.submitFeedback = this.submitFeedback.bind(this);
    this.setNotification = this.setNotification.bind(this);
  }

  componentDidMount() {
    axios
      .get(`${serverip}/api/users`, request_config())
      .then(usersData => {
        const usersArray = usersData.data.users;
        this.setState({ usersArray: usersArray });
      })
      .catch(error => {
        console.log(error);
      });

    if (JSON.parse(localStorage.getItem("selectedUser"))) {
      this.setState({
        selectedUser: JSON.parse(localStorage.getItem("selectedUser"))
      });
    }
  }

  setUser(selectedUser) {
    this.setState({
      selectedUser: selectedUser
    });
  }

  handleFeedback(e) {
    const { name, value } = e.target;
    this.setState({ [name]: value });
  }

  getScore(selectValue) {
    this.setState({ score: selectValue });
  }

  handlePDF() {
    this.setState({
      generatePDF: !this.state.generatePDF
    });
  }

  setNotification(status) {
    this.setState({
      notification: status
    });
  }

  submitFeedback() {
    const newFeedback = {
      feedback: this.state.feedback,
      score: this.state.score,
      user: {
        frontline_id: this.state.selectedUser.id,
        fullname: this.state.selectedUser.fullname,
        username: this.state.selectedUser.username,
        email: this.state.selectedUser.email,
        group_name: this.state.selectedUser.group_name,
        group_id: this.state.selectedUser.group_id,
        group_nest_left: this.state.selectedUser.group_nest_left,
        group_nest_right: this.state.selectedUser.group_nest_right,
        group_nest_depth: this.state.selectedUser.group_nest_depth,
        group_parent_id: this.state.selectedUser.group_parent_id
      },
      evaluator: {
        frontline_id: localStorage.getItem("frontline_id"),
        fullname: localStorage.getItem("fullname"),
        username: localStorage.getItem("username"),
        email: localStorage.getItem("email"),
        frontline_groups: JSON.parse(localStorage.getItem("frontline_groups"))
      }
    };

    // Axios post request - add evaluation to MongoDB
    axios
      .post(`${serverip}/api/feedbacks/add`, newFeedback, request_config())
      .then(res => {
        // Remove selectedUser from local storage
        localStorage.removeItem("selectedUser");
        // Conditionaly generate pdf
        if (this.state.generatePDF) {
          const pdfData = res.data;
          feedbackPDF(pdfData);
        }
        // Show Notification and Clear the state
        this.setState({
          notification: "Success",
          feedback: "",
          generatePDF: false
        });
      })
      .catch(err => {
        this.setState({
          notification: "Failed"
        });
        console.log(err);
      });
  }

  render() {
    console.log(this.state.selectedUser);
    const { classes } = this.props;
    const {
      usersArray,
      selectedUser,
      feedback,
      score,
      generatePDF
    } = this.state;

    const selectItems = ["Loš", "Dobar", "Odličan"];

    return (
      <div>
        <GridContainer>
          <GridItem xs={12} sm={12} md={12}>
            <form>
              <Card>
                <CardHeader color="primary" className={classes.cardHeader}>
                  <h4 className={classes.cardTitleWhite}>Feedback</h4>
                  <GridContainer
                    style={{
                      display: "flex",
                      justifyContent: "space-between"
                    }}
                  >
                    <GridItem
                      xs={12}
                      sm={12}
                      md={12}
                      style={{
                        display: "flex",
                        alignItems: "flex-end",
                        marginBottom: "-10px",
                        marginTop: "15px"
                      }}
                    >
                      <div
                        className={classes.searchWrapper}
                        style={{
                          display: "flex",
                          alignItems: "center"
                        }}
                      >
                        <Autocomplete
                          selectedItemHandler={this.setUser}
                          searchItems={usersArray}
                          selectedItem={selectedUser.fullname}
                          placeholder="Pretraga prodavaca"
                        />
                        <Button color="white" aria-label="edit" justIcon round>
                          <Search />
                        </Button>
                      </div>
                    </GridItem>
                  </GridContainer>
                </CardHeader>
                <CardBody>
                  <GridContainer>
                    <GridItem xs={12} sm={12} md={12}>
                      <InputLabel>
                        <h5 style={{ color: "#AAAAAA", marginRight: "5px" }}>
                          Feedback{"  "}
                        </h5>
                      </InputLabel>
                      <CustomInput
                        //labelText="ponudi konkretne ideje koje će mu pomoći da unapredi svoje prodajne veštine"
                        id="feedback"
                        formControlProps={{
                          fullWidth: true
                        }}
                        inputProps={{
                          name: "feedback",
                          placeholder:
                            "napišite feedback za odabranog zaposlenog",
                          value: this.state.feedback,
                          onChange: this.handleFeedback,
                          multiline: true,
                          rows: 5
                        }}
                      />
                    </GridItem>
                    <GridItem
                      xs={12}
                      sm={6}
                      md={5}
                      lg={5}
                      style={{ marginTop: "20px" }}
                    >
                      <CustomSelect
                        items={selectItems}
                        title="Utisak"
                        getValue={this.getScore}
                      />
                    </GridItem>
                    <GridItem
                      xs={12}
                      sm={12}
                      md={7}
                      lg={7}
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "flex-end"
                      }}
                    >
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={generatePDF}
                            onChange={this.handlePDF}
                            color="primary"
                          />
                        }
                        label="Generiši PDF"
                      />
                    </GridItem>
                  </GridContainer>
                </CardBody>
                <CardFooter>
                  <Button
                    onClick={this.submitFeedback}
                    color="primary"
                    disabled={
                      Object.entries(selectedUser).length === 0 ||
                      !feedback ||
                      !score
                        ? true
                        : false
                    }
                  >
                    Sačuvaj Feedback
                  </Button>
                </CardFooter>
              </Card>
            </form>
          </GridItem>
          <Notification
            notificationType={this.state.notification}
            open={true}
            text="Feedback je sačuvan"
          />
        </GridContainer>
      </div>
    );
  }
}

export default withStyles(evalStyle)(Feedback);
