import React, { Component } from "react";
import axios from "axios";
import Category from "./Category";
import data from "./evaluationData";
import { backend_address as serverip } from "../../../config/backend";
import request_config from "../../../helpers/RequestConfig";

// core components
import GridItem from "components/Grid/GridItem.jsx";
import GridContainer from "components/Grid/GridContainer.jsx";
import Card from "components/Card/Card.jsx";
import CardHeaderSearch from "components/Card/CardHeaderSearch.jsx";
import CardBody from "components/Card/CardBody.jsx";
import MultilineInput from "components/CustomInput/MultilineInput.jsx";
import CardFooter from "components/Card/CardFooter.jsx";
import Modal from "components/Modal/Modal";
import SubmitNotification from "components/Snackbar/SubmitNotification.jsx";
import withStyles from "@material-ui/core/styles/withStyles";

import evalStyle from "assets/jss/material-dashboard-react/views/eval.jsx";

export class Evaluation5G extends Component {
  constructor(props) {
    super(props);
    this.state = {
      G1A: "10",
      G1B: "10",
      G2A: "10",
      G2B: "10",
      G3A: "10",
      G3B: "10",
      G4A: "10",
      G4B: "10",
      G5A: "10",
      G5B: "10",
      feedback: "",
      usersArray: [],
      selectedUser: {},
      evaluator: {},
      evaluationSaved: false,
      evaluationSaveError: false,
    };

    this.handleChangeEnabled = this.handleChangeEnabled.bind(this);
    this.prepareStepValue = this.prepareStepValue.bind(this);
    this.prepareStepScore = this.prepareStepScore.bind(this);
    this.setUser = this.setUser.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.closeSnackbar = this.closeSnackbar.bind(this);
    this.closeSnackbarError = this.closeSnackbarError.bind(this);
  }

  componentDidMount() {
    this.setState({
      evaluator: {
        frontline_id: localStorage.getItem("frontline_id"),
        fullname: localStorage.getItem("fullname"),
        username: localStorage.getItem("username"),
        email: localStorage.getItem("email"),
        frontline_groups: JSON.parse(localStorage.getItem("frontline_groups")),
      },
    });

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

  prepareStepScore(stepScore) {
    switch (stepScore) {
      case "10":
        return 10;
      case "0":
        return 0;
      case "na":
        return 0;
      default:
        return null;
    }
  }

  prepareStepValue(stepVal) {
    switch (stepVal) {
      case "10":
        return "Da";
      case "0":
        return "Ne";
      case "na":
        return "na";
      default:
        return null;
    }
  }

  closeSnackbar() {
    this.setState({ evaluationSaved: false });
  }

  closeSnackbarError() {
    this.setState({ evaluationSaveError: false });
  }

  onSubmit(e) {
    e.preventDefault();

    const {
      G1A,
      G1B,
      G2A,
      G2B,
      G3A,
      G3B,
      G4A,
      G4B,
      G5A,
      G5B,
      feedback,
      selectedUser,
      evaluator,
    } = this.state;

    // Broj n/a obeleženih polja
    let formWeight = 100;

    formWeight -= G1A === "na" ? 10 : 0;
    formWeight -= G1B === "na" ? 10 : 0;
    formWeight -= G2A === "na" ? 10 : 0;
    formWeight -= G2B === "na" ? 10 : 0;
    formWeight -= G3A === "na" ? 10 : 0;
    formWeight -= G3B === "na" ? 10 : 0;
    formWeight -= G4A === "na" ? 10 : 0;
    formWeight -= G4B === "na" ? 10 : 0;
    formWeight -= G5A === "na" ? 10 : 0;
    formWeight -= G5B === "na" ? 10 : 0;

    // Vrednosti su prvobitno bile u string formatu jer radio button ne moze da posalje u state neki value ako je u number formatu. Ovde ih sve konvertujemo u number format kako bi dobili finalni score
    const totalScore =
      ((this.prepareStepScore(G1A) +
        this.prepareStepScore(G1B) +
        this.prepareStepScore(G2A) +
        this.prepareStepScore(G2B) +
        this.prepareStepScore(G3A) +
        this.prepareStepScore(G3B) +
        this.prepareStepScore(G4A) +
        this.prepareStepScore(G4B) +
        this.prepareStepScore(G5A) +
        this.prepareStepScore(G5B)) /
        formWeight) *
      100;

    const newEvaluation = {
      type: "5G",
      evaluation: {
        score: Math.round(totalScore),
        categories: [
          {
            categoryName: "Gradi odnos",
            categoryWeight: 20,
            categoryScore:
              this.prepareStepScore(G1A) + this.prepareStepScore(G1B),
            categorySteps: [
              {
                stepName:
                  "Prodavac proaktivno i ljubazno pozdravlja svakog korisnika/korisnike kad uđu u prodavnicu, bez obzira na zauzetost.",
                stepWeight: 10,
                stepScore: this.prepareStepScore(G1A),
                stepValue: this.prepareStepValue(G1A),
              },
              {
                stepName:
                  "Prodavac razume razlog dolaska u prodavnicu (uključujući segmentaciju fizičko / pravno lice) i spram toga uključuje korisnika u komunikaciju.",
                stepWeight: 10,
                stepScore: this.prepareStepScore(G1B),
                stepValue: this.prepareStepValue(G1B),
              },
            ],
          },
          {
            categoryName: "Generiši želju",
            categoryWeight: 20,
            categoryScore:
              this.prepareStepScore(G2A) + this.prepareStepScore(G2B),
            categorySteps: [
              {
                stepName:
                  "Prodavac stvara korisniku želju za kupovinom koristeći efikasna pitanja, dosetljive komentare i aktivno slušajući.",
                stepWeight: 10,
                stepScore: this.prepareStepScore(G2A),
                stepValue: this.prepareStepValue(G2A),
              },
              {
                stepName:
                  "Prodavac „čačka“ sve teme u vezi sa našim portfoliom (internet svuda, voice, uređaji, hipernet, televizija) i tako utvrđuje prodajni potencijal.",
                stepWeight: 10,
                stepScore: this.prepareStepScore(G2B),
                stepValue: this.prepareStepValue(G2B),
              },
            ],
          },
          {
            categoryName: "Genijalno ponudi",
            categoryWeight: 20,
            categoryScore:
              this.prepareStepScore(G3A) + this.prepareStepScore(G3B),
            categorySteps: [
              {
                stepName:
                  "Prodavac nudi dobitnu kombinaciju u skladu sa prethodno generisanim željama kod korisnika.",
                stepWeight: 10,
                stepScore: this.prepareStepScore(G3A),
                stepValue: this.prepareStepValue(G3A),
              },
              {
                stepName:
                  "Prodavac ilustruje dobitnu kombinaciju ubedljivo koristeći efektnu vizualizaciju na brošuri/interaktivnom ekranu.",
                stepWeight: 10,
                stepScore: this.prepareStepScore(G3B),
                stepValue: this.prepareStepValue(G3B),
              },
            ],
          },
          {
            categoryName: "Guraj dalje",
            categoryWeight: 20,
            categoryScore:
              this.prepareStepScore(G4A) + this.prepareStepScore(G4B),
            categorySteps: [
              {
                stepName:
                  "Prodavac hrabro pregovara ambiciozniju prodaju kroz cross-sell ili up-sell i/ili osigurava prodaju.",
                stepWeight: 10,
                stepScore: this.prepareStepScore(G4A),
                stepValue: this.prepareStepValue(G4A),
              },
              {
                stepName: "Prodavac uspešno zatvara prodaju.",
                stepWeight: 10,
                stepScore: this.prepareStepScore(G4B),
                stepValue: this.prepareStepValue(G4B),
              },
            ],
          },
          {
            categoryName: "Glat zatvori",
            categoryWeight: 20,
            categoryScore:
              this.prepareStepScore(G5A) + this.prepareStepScore(G5B),
            categorySteps: [
              {
                stepName:
                  "Prodavac entuzijastično „obučava“ korisnika (Yettel app uključujući i Yettel svaki dan, E-bill, HBO...) hvaleći njegov izbor i smisleno ga obrađuje radi jedinstvenog korisničog iskustva.",
                stepWeight: 10,
                stepScore: this.prepareStepScore(G5A),
                stepValue: this.prepareStepValue(G5A),
              },
              {
                stepName:
                  "Prodavac na dosetljiv i kreativan način „oprema“ korisnika dodatnom opremom.",
                stepWeight: 10,
                stepScore: this.prepareStepScore(G5B),
                stepValue: this.prepareStepValue(G5B),
              },
            ],
          },
        ],
        feedback: feedback,
      },
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

    // Axios post request - add evaluation to MongoDB
    axios
      .post(`${serverip}/api/evaluations/add`, newEvaluation, request_config())
      .then((res) => {
        // Remove selectedUser from local storage
        localStorage.removeItem("selectedUser");

        this.setState(
          {
            evaluationSaved: true,
            G1A: "10",
            G1B: "10",
            G2A: "10",
            G2B: "10",
            G3A: "10",
            G3B: "10",
            G4A: "10",
            G4B: "10",
            G5A: "10",
            G5B: "10",
            feedback: "",
            selectedUser: {},
          }
          // () => {
          //   window.location.reload();
          // }
        );
      })
      .catch((err) => {
        console.log(err);
        this.setState({
          evaluationSaveError: true,
        });
      });
  }

  handleChangeEnabled(event) {
    this.setState({
      [event.target.name]: event.target.value,
    });
  }

  render() {
    const { classes } = this.props;
    const { selectedUser, usersArray } = this.state;

    const categoriesMap = data.map((cat, i) => {
      return (
        <Category
          key={data[i].categoryName}
          data={data[i]}
          //classes={classes}
          checkedA={this.state[data[i].stepAcheckboxName]}
          checkedB={this.state[data[i].stepBcheckboxName]}
          nameHandler={this.handleChangeEnabled}
        />
      );
    });

    return (
      <>
        <GridContainer>
          <GridItem xs={12} sm={12} md={12}>
            <form onSubmit={this.onSubmit}>
              <Card>
                <CardHeaderSearch
                  title="5G Evaluacija"
                  searchItems={usersArray}
                  selectItem={this.setUser}
                  selectedItemName={selectedUser.fullname}
                  searchPlaceholder="Pretraga prodavaca"
                />
                <CardBody>
                  {categoriesMap}
                  <MultilineInput
                    label="Posavetuj prodavca"
                    mandatory
                    placeholder="ponudi konkretne ideje koje će prodavcu pomoći da unapredi prodajne veštine"
                    inputValue={this.state.feedback}
                    handleInputChange={this.handleChangeEnabled}
                  />
                </CardBody>
                <CardFooter>
                  <Modal
                    submit="submit"
                    selectedUser={selectedUser}
                    disabled={
                      Object.entries(this.state.selectedUser).length === 0 ||
                      this.state.feedback.length === 0
                        ? true
                        : false
                    }
                  />
                </CardFooter>
              </Card>
            </form>
          </GridItem>
        </GridContainer>
        <SubmitNotification
          success={this.state.evaluationSaved}
          error={this.state.evaluationSaveError}
          closeSnackbarSuccess={this.closeSnackbar}
          closeSnackbarError={this.closeSnackbarError}
        />
      </>
    );
  }
}

export default withStyles(evalStyle)(Evaluation5G);
