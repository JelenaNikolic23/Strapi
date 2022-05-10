import React, { Component } from "react";
import axios from "axios";
import { backend_address as serverip } from "../../../config/backend";
import request_config from "../../../helpers/RequestConfig";
import { EditorState } from "draft-js";

import CustomSelect from "../../../components/CustomSelect/CustomSelect";
import RichTextEditor from "../../../components/RichTextEditor/RichTextEditor";

// @material-ui/core
import Input from "@material-ui/core/Input";
import Snackbar from "@material-ui/core/Snackbar";
import IconButton from "@material-ui/core/IconButton";
import Slide from "@material-ui/core/Slide";
import withStyles from "@material-ui/core/styles/withStyles";
// @material-ui/icons
import Search from "@material-ui/icons/Search";
import CloseIcon from "@material-ui/icons/Close";
import SuccessIcon from "@material-ui/icons/CheckCircle";
import ErrorIcon from "@material-ui/icons/Error";

// core components
import GridItem from "components/Grid/GridItem.jsx";
import GridContainer from "components/Grid/GridContainer.jsx";
import Button from "components/CustomButtons/Button.jsx";
import Card from "components/Card/Card.jsx";
import CardHeader from "components/Card/CardHeader.jsx";
import CardBody from "components/Card/CardBody.jsx";
import CardFooter from "components/Card/CardFooter.jsx";
import Autocomplete from "components/Autocomplete/Autocomplete.jsx";

import evalStyle from "../../../assets/jss/material-dashboard-react/views/eval.jsx";

export class Coaching extends Component {
  constructor(props) {
    super(props);
    this.state = {
      usersArray: [],
      selectedUser: {},
      evaluator: {},
      topic: "",
      customTopicIsVisible: false,
      editorState1: EditorState.createEmpty(),
      editorState2: EditorState.createEmpty(),
      coachingSaved: false,
      coachingSaveError: false,
    };
    this.setUser = this.setUser.bind(this);
    this.getEditorState1 = this.getEditorState1.bind(this);
    this.getEditorState2 = this.getEditorState2.bind(this);
    this.getTopic = this.getTopic.bind(this);
    this.customTopicChange = this.customTopicChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.closeSnackbar = this.closeSnackbar.bind(this);
    this.closeSnackbarError = this.closeSnackbarError.bind(this);
  }

  componentDidMount() {
    // set evaluator
    this.setState({
      evaluator: {
        frontline_id: localStorage.getItem("frontline_id"),
        fullname: localStorage.getItem("fullname"),
        username: localStorage.getItem("username"),
        email: localStorage.getItem("email"),
        frontline_groups: JSON.parse(localStorage.getItem("frontline_groups")),
      },
    });

    // set users
    axios
      .get(`${serverip}/api/users`, request_config())
      .then((usersData) => {
        const usersArray = usersData.data.users;
        this.setState({ usersArray: usersArray });
      })
      .catch((error) => {
        console.log(error);
      });

    if (JSON.parse(localStorage.getItem("selectedUser"))) {
      this.setState({
        selectedUser: JSON.parse(localStorage.getItem("selectedUser")),
      });
    }
  }

  setUser(selectedUser) {
    this.setState({
      selectedUser: selectedUser,
    });
  }

  getEditorState1(editorState1) {
    this.setState({ editorState1 });
  }
  getEditorState2(editorState2) {
    this.setState({ editorState2 });
  }

  getTopic(selectValue) {
    if (selectValue === "Drugo") {
      this.setState({ topic: selectValue, customTopicIsVisible: true });
    } else {
      this.setState({ topic: selectValue, customTopicIsVisible: false });
    }
  }

  customTopicChange(event) {
    this.setState({ topic: event.target.value });
  }

  handleSubmit(event) {
    // iF text editor is empty we add space

    const space = {
      blocks: [
        {
          key: "45vsk",
          text: " ",
          type: "unstyled",
          depth: 0,
          inlineStyleRanges: [],
          entityRanges: [],
          data: {},
        },
      ],
      entityMap: {},
    };
    //Check if text editor 1 is emptry
    if (this.state.editorState1._immutable) {
      this.state.editorState1 = space;
    }
    //Check if text editor 2 is emptry
    if (this.state.editorState2._immutable) {
      this.state.editorState2 = space;
    }

    console.log(this.state.editorState1);
    console.log(this.state.editorState2);
    event.preventDefault();
    const {
      topic,
      selectedUser,
      evaluator,
      editorState1,
      editorState2,
    } = this.state;
    const newCoaching = {
      topic: topic,
      actionKnowledge: JSON.stringify(editorState1),
      actionSkills: JSON.stringify(editorState2),
      user: {
        frontline_id: selectedUser.id,
        fullname: selectedUser.fullname,
        username: selectedUser.username,
        email: selectedUser.email,
        group_name: selectedUser.group_name,
        group_id: selectedUser.group_id,
        group_nest_left: selectedUser.group_nest_left,
        group_nest_right: selectedUser.group_nest_right,
        group_nest_depth: selectedUser.group_nest_depth,
        group_parent_id: selectedUser.group_parent_id,
      },
      evaluator: {
        frontline_id: evaluator.frontline_id,
        fullname: evaluator.fullname,
        username: evaluator.username,
        email: evaluator.email,
        frontline_groups: evaluator.frontline_groups,
      },
    };

    // Axios post request - add coaching to MongoDB
    axios
      .post(`${serverip}/api/coachings/add`, newCoaching, request_config())
      .then((res) => {
        // Remove selectedUser from local storage
        localStorage.removeItem("selectedUser");

        this.setState({
          coachingSaved: true,
          topic: "",
          selectedUser: {},
          editorState1: EditorState.createEmpty(),
          editorState2: EditorState.createEmpty(),
        });
      })
      .catch((err) => {
        console.log(err);
        this.setState({
          coachingSaveError: true,
        });
      });
  }

  closeSnackbar() {
    this.setState({ coachingSaved: false });
  }

  closeSnackbarError() {
    this.setState({ coachingSaveError: false });
  }

  render() {
    const { classes } = this.props;
    const {
      usersArray,
      selectedUser,
      topic,
      customTopicIsVisible,
    } = this.state;
    const selectTopic = [
      "Srdačna neverbalna komunikacija",
      "Autentična zainteresovanost za korisnika",
      "Bezpredrasudno socijalno opažanje",
      "Otvoren stav u komunikaciji",
      "Pažljivo slušanje i mentalno mapiranje",
      "Unapređenje spontanog komuniciranja",
      "Unapređenje efikasnosti u komuniciranju",
      "Umeće upravljanja razgovorom",
      "Aktivno uključivanje sagovornika u komunikaciju kroz pitanja",
      "Aktivno uključivanje sagovornika kroz sugestije",
      "Aktivno uključivanje sagovornika kroz “show don’t tell”",
      "Unapređenje afirmativne komunikacije",
      "Ilustrativnost u iznošenju ponude",
      "Jednostavnost u izražavanju i strukturisanju informacija",
      "Proaktivnost u iznošenju ponude",
      "Interaktivan način iznošenja ponude",
      "Entuzijastičan stav tokom iznošenja ponude",
      "Ambicioznost kod nuđenja",
      "Unapređenje pregovaračkih umeća",
      "Fleksibilan i strpljiv odnos",
      "Kreativno mišljenje i dosetljivost",
      "Umeće upravljanja konfliktnim situacijama",
      "Asertivna komunikacija",
      "Drugo",
    ];

    return (
      <div>
        <GridContainer>
          <GridItem xs={12} sm={12} md={12}>
            <form onSubmit={this.handleSubmit}>
              <Card>
                <CardHeader color="primary" className={classes.cardHeader}>
                  <h4 className={classes.cardTitleWhite}>Koučing</h4>
                  <GridContainer
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
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
                        marginTop: "15px",
                      }}
                    >
                      <div
                        className={classes.searchWrapper}
                        style={{
                          display: "flex",
                          alignItems: "center",
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
                    <GridItem xs={12} sm={6} md={6} lg={6}>
                      <CustomSelect
                        items={selectTopic}
                        title="Tema"
                        getValue={this.getTopic}
                      />
                      {customTopicIsVisible && (
                        <Input
                          placeholder="Unesite temu..."
                          fullWidth={true}
                          style={{ margin: "10px 0px", paddingBottom: "" }}
                          onChange={this.customTopicChange}
                        />
                      )}
                    </GridItem>
                  </GridContainer>
                  {topic !== "" ? (
                    <>
                      <GridContainer>
                        <GridItem xs={12} sm={12} md={6}>
                          <h3 className={classes.h3Basic}>
                            Aktivnosti za unapređenje znanja
                          </h3>
                          <div
                            style={{
                              border: "1px solid #AAAAAA",
                              paddingLeft: "12px",
                              minHeight: "240px",
                            }}
                          >
                            <RichTextEditor
                              label="Unesite aktivnosti za unapređenje znanja..."
                              getEditorState={this.getEditorState1}
                            />
                          </div>
                        </GridItem>
                        <GridItem xs={12} sm={12} md={6}>
                          <h3 className={classes.h3Basic}>
                            Aktivnosti za unapređenje veština
                          </h3>
                          <div
                            style={{
                              border: "1px solid #AAAAAA",
                              paddingLeft: "12px",
                              minHeight: "240px",
                            }}
                          >
                            <RichTextEditor
                              label="Unesite aktivnosti za unapređenje veština..."
                              getEditorState={this.getEditorState2}
                            />
                          </div>
                        </GridItem>
                      </GridContainer>
                    </>
                  ) : (
                    <></>
                  )}
                </CardBody>
                <CardFooter>
                  <Button
                    type="submit"
                    color="primary"
                    disabled={
                      topic === "" || Object.entries(selectedUser).length === 0
                        ? true
                        : false
                    }
                  >
                    Sačuvaj temu sesije
                  </Button>
                </CardFooter>
              </Card>
            </form>
          </GridItem>
        </GridContainer>
        <Snackbar
          TransitionComponent={Slide}
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
          open={this.state.coachingSaved}
          autoHideDuration={3000}
          message={
            <span
              id="message-id"
              style={{ display: "flex", alignItems: "center" }}
            >
              <SuccessIcon style={{ marginRight: "5px" }} />
              Koučing je sačuvan.
            </span>
          }
          ContentProps={{
            "aria-describedby": "message-id",
            classes: {
              root: classes.snackbarRoot,
            },
          }}
          onClose={this.closeSnackbar}
          action={[
            <IconButton
              onClick={this.closeSnackbar}
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
          open={this.state.coachingSaveError}
          autoHideDuration={3000}
          message={
            <span
              id="message-id-error"
              style={{ display: "flex", alignItems: "center" }}
            >
              <ErrorIcon style={{ marginRight: "5px" }} />
              Greška! Koučing nije sačuvan.
            </span>
          }
          ContentProps={{
            "aria-describedby": "message-id-error",
            classes: {
              root: classes.snackbarRootError,
            },
          }}
          onClose={this.closeSnackbar}
          action={[
            <IconButton
              onClick={this.closeSnackbarError}
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
  }
}

export default withStyles(evalStyle)(Coaching);
