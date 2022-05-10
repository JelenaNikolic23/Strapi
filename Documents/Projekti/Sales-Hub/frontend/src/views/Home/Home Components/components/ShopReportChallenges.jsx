import React, { Component } from "react";
import MaterialTable from "components/Table/TablePaginationSearch.jsx";
import axios from "axios";
import { backend_address as serverip } from "../../../../config/backend";
// @material-ui/core components
import Icon from "@material-ui/core/Icon";
import { Link } from "react-router-dom";
import Card from "components/Card/Card.jsx";
import CardHeader from "components/Card/CardHeader.jsx";
import CardBody from "components/Card/CardBody.jsx";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import RegManagerActionTable from "../../../../components/Table/RegManagerActionTable";
import { CardActions, FormControlLabel, Checkbox } from "@material-ui/core";
import request_config from "../../../../helpers/RequestConfig";

export class ShopReportChallenges extends Component {
  constructor(props) {
    super(props);

    this.state = {
      creators: [],
      dialogOpen: false,
      dialogData: [],
      valueResolveChallenge: false
    };

    this.handleClickOpen = this.handleClickOpen.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.deleteChallenge = this.deleteChallenge.bind(this);
    this.resolveChallenge = this.resolveChallenge.bind(this);
    this.checkChallenge = this.checkChallenge.bind(this);
    this.viewChallengesRegMan = this.viewChallengesRegMan.bind(this);
  }

  componentDidMount() {
    // List of All shops  for reg Manager

    axios
      .get(`${serverip}/api/actionPlans/creator`, request_config())
      .then(creator => {
        const creatorArray = creator.data;
        this.setState({ creators: creatorArray });
      })
      .catch(error => {
        console.log(error);
      });
  }

  handleClickOpen(creator) {
    this.setState({
      ...this.state,
      dialogOpen: true,
      dialogData: creator
    });
  }

  handleClose() {
    this.setState({
      ...this.state,
      dialogOpen: false,
      dialogData: [],
      valueResolveChallenge: false
    });
  }

  deleteChallenge(challengeId) {
    const updatedChallenge = this.state.creators.filter(
      creator => creator._id !== challengeId
    );

    this.setState({
      ...this.state,
      creators: updatedChallenge
    });
  }

  resolveChallenge(e) {
    const valueChallenge = document.getElementById("checkChallenge").value;
    const challengeId = e.target.parentNode.id;

    const body = {
      challengeId: challengeId,
      resolved: valueChallenge
    };

    // Axios post request - update Action to true
    axios
      .post(
        `${serverip}/api/actionPlans/updateChallengeResolved`,
        body,
        request_config()
      )
      .then(updatedChallenge => {
        console.log(updatedChallenge.data);

        if (this.state.valueResolveChallenge) {
          this.deleteChallenge(challengeId);
        }

        this.handleClose();
      })
      .catch(err => {
        console.log(err);
      });
  }

  checkChallenge(e) {
    this.setState({
      ...this.state,
      valueResolveChallenge: !this.state.valueResolveChallenge
    });
  }

  creatorNamesDataRender(creator) {
    const profile_url = `/admin/reports/shops/${creator.shop.id}`;
    return [
      <Link
        to={profile_url}
        style={{
          color: "#033E8C",
          lineHeight: "25px",
          height: "25px"
        }}
      >
        <Icon
          style={{
            verticalAlign: "middle"
          }}
        >
          store
        </Icon>{" "}
        <span
          style={{
            verticalAlign: "middle"
          }}
        >
          {creator.shop.fullname}
        </span>
      </Link>
    ];
  }

  actionPlansDataRender(creator) {
    const sumActionPlans = creator.actions.length;
    let finishedActions = 0;

    for (let i = 0; i < creator.actions.length; i++) {
      if (creator.actions[i].completed) finishedActions++;
    }

    let color = () => {
      // return evaluation.evaluation.score > 70 ? "green" : "red";
      if (
        finishedActions >= sumActionPlans / 2 &&
        finishedActions < sumActionPlans
      ) {
        return "orange";
      } else if (finishedActions < sumActionPlans / 2) {
        return "red";
      } else if (finishedActions === sumActionPlans) {
        return "green";
      } else {
        return "gray";
      }
    };

    return [
      <span style={{ color: color() }}>
        <strong>
          {finishedActions != null
            ? finishedActions + "/" + sumActionPlans
            : "/"}
        </strong>
      </span>
    ];
  }

  deadLineForChallengesRegMan(creator) {
    return [
      <span
        style={{
          display: "flex",
          textAlign: "center",
          color: "#033E8C",
          fontSize: "14px",
          justifyContent: "center",
          paddingTop: "4px"
        }}
      >
        {creator.deadline.slice(0, 10)}
      </span>
    ];
  }

  viewChallengesRegMan(creator) {
    return [
      <div>
        <Button color="primary" onClick={() => this.handleClickOpen(creator)}>
          Pogledaj
        </Button>
      </div>
    ];
  }

  render() {
    return (
      <div>
        <Card>
          <CardHeader
            color="primary"
            style={{ paddingTop: "0px", paddingBottom: "0px" }}
          >
            <h4>Shop Report - Izazovi</h4>
          </CardHeader>
          <CardBody>
            <MaterialTable
              tableData={this.state.creators}
              tableHeaderColor="primary"
              toolbar={false}
              tableHead={[
                {
                  title: "Prodavnica",
                  field: "shop.fullname",
                  render: this.creatorNamesDataRender
                },
                {
                  title: "Progres",
                  field: "actions.completed",
                  render: this.actionPlansDataRender
                },
                {
                  title: "DeadLine",
                  field: "deadline",
                  render: this.deadLineForChallengesRegMan
                },

                {
                  title: "Detaljnije",
                  field: "none",
                  render: this.viewChallengesRegMan
                }
              ]}
            />
          </CardBody>
        </Card>

        {this.state.dialogData.challenge !== undefined ? (
          <Dialog
            fullScreen
            open={this.state.dialogOpen}
            style={{
              display: "flex",
              justifyContent: "center",
              height: "460px",
              paddingLeft: "20px",
              paddingRight: "20px"
            }}
            onClose={this.handleClose}
            aria-labelledby="scroll-dialog-title"
          >
            <p
              style={{
                padding: "5px",
                paddingLeft: "28px",
                paddingBottom: "15px"
              }}
            >
              DeadLine: <b>{this.state.dialogData.deadline.slice(0, 10)}</b>
            </p>

            <CardHeader
              color="primary"
              style={{
                paddingTop: "0px",
                marginBottom: "10px",
                display: "flex",
                justifyContent: "space-between",
                paddingBottom: "0"
              }}
            >
              <p>
                <b>
                  {this.state.dialogData.challenge.charAt(0).toUpperCase() +
                    this.state.dialogData.challenge.slice(1)}
                </b>
              </p>
            </CardHeader>

            <RegManagerActionTable
              checkedIndexes={[]}
              tableHeaderColor="primary"
              tableHead={["Završeno", "Ime Akcionog Plana"]}
              actions={this.state.dialogData.actions}
              challengeId={this.state.dialogData._id}
            />

            <FormControlLabel
              style={{ padding: "15px", color: "#414A4C" }}
              control={
                <Checkbox
                  id="checkChallenge"
                  onClick={this.checkChallenge}
                  value={this.state.valueResolveChallenge}
                  color="primary"
                />
              }
              label="Označi izazov kao rešen"
            />
            <br />
            <CardActions>
              <Button size="small" color="secondary" onClick={this.handleClose}>
                Zatvori
              </Button>
              <Button
                size="small"
                color="primary"
                onClick={this.resolveChallenge}
                id={this.state.dialogData._id}
                style={{ marginLeft: "140px", justifyContent: "space-between" }}
              >
                Sačuvaj promene
              </Button>
            </CardActions>
          </Dialog>
        ) : null}
      </div>
    );
  }
}

export default ShopReportChallenges;
