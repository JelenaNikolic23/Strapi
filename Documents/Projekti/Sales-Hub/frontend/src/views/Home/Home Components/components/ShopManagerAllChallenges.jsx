import React, { Component } from "react";
import axios from "axios";
import { backend_address as serverip } from "../../../../config/backend";
import GridItem from "components/Grid/GridItem.jsx";
import Card from "components/Card/Card.jsx";
import CardHeader from "components/Card/CardHeader.jsx";
import request_config from "../../../../helpers/RequestConfig";
import ActionPlansTable from "components/Table/ActionPlansTable.jsx";
import CardBody from "components/Card/CardBody.jsx";
import { Grid, CardActions, Typography } from "@material-ui/core";

export class ShopManagerAllChallenges extends Component {
  constructor(props) {
    super(props);

    this.state = {
      challenges: []
    };
  }

  componentDidMount() {
    let shopId = JSON.parse(localStorage.getItem("frontline_groups"))[0].id;

    // Shop Report challenges Aca commit

    axios
      .get(`${serverip}/api/actionPlans/shop/${shopId}`, request_config())
      .then(challenges => {
        this.setState({
          ...this.state,
          challenges: challenges.data
        });
      })
      .catch(error => {
        console.log(error);
      });

    // Evaluator stats
    axios
      .get(
        `${serverip}/api/evaluations/dashboard/evaluatorStats`,
        request_config()
      )
      .then(stats => {
        this.setState({
          ...this.state,
          evaluatorStats: stats.data
        });
      })
      .catch(error => {
        console.log(error);
      });
  }

  render() {
    const { challenges } = this.state;

    const ListAllChalanges = challenges.map(challenge => {
      return [
        <GridItem xs={12} sm={12} md={6} key={challenge._id}>
          <Card>
            <CardHeader
              color="primary"
              style={{
                paddingTop: "0px",
                paddingBottom: "0px",
                display: "flex",
                justifyContent: "space-between"
              }}
            >
              <p>
                <b>{challenge.challenge}</b>
              </p>
              <p>
                DeadLine: <b>{challenge.deadline.slice(0, 10)}</b>
              </p>
            </CardHeader>

            <CardBody>
              <ActionPlansTable
                checkedIndexes={[]}
                tableHeaderColor="primary"
                tableHead={["Zavrseno", "Ime Akcionog Plana"]}
                actions={challenge.actions}
                challengeId={challenge._id}
              />
            </CardBody>
            <CardActions
              style={{
                paddingTop: "0px",
                paddingBottom: "0px",
                marginRight: "20px",
                display: "flex",
                justifyContent: "flex-end"
              }}
            >
              <p>
                Kreirao: <b>{challenge.creator.fullname}</b>
              </p>
            </CardActions>
          </Card>
        </GridItem>
      ];
    });

    return (
      <div>
        <Typography style={{ padding: "20px" }} variant="h5">
          Aktivni Izazovi
        </Typography>
        <Grid container spacing={2}>
          {ListAllChalanges}
        </Grid>
      </div>
    );
  }
}

export default ShopManagerAllChallenges;
