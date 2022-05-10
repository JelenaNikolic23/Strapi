import React, { Component } from "react";
import axios from "axios";
import { backend_address as serverip } from "../../../../../config/backend";
import request_config from "../../../../../helpers/RequestConfig";

import GridItem from "components/Grid/GridItem.jsx";
import Card from "components/Card/Card.jsx";
import CardHeader from "components/Card/CardHeader.jsx";
import CardBody from "components/Card/CardBody.jsx";
import CoachingItem from "./CoachingItem";

class CoachingReport extends Component {
  constructor(props) {
    super(props);

    this.state = {
      coachingReports: []
    };
  }

  componentDidMount() {
    const { frontline_id } = this.props;

    // Call backend API evaluations to GET average score by month for the user
    if (frontline_id) {
      axios
        .get(`${serverip}/api/coachings/user/${frontline_id}`, request_config())
        .then(coaching => {
          this.setState({ ...this.state, coachingReports: coaching.data });
        })
        .catch(error => {
          console.log(error);
        });
    }
  }

  handleAcceptCoaching(reportId) {
    axios
      .post(
        `${serverip}/api/coachings/updateAccepted`,
        { coaching_id: reportId },
        request_config()
      )
      .then(() => {
        console.log("Coaching updated to accepted.");
      })
      .catch(error => {
        console.log(error);
      });
  }

  render() {
    const { coachingReports } = this.state;

    // User
    const userId = Number(localStorage.getItem("frontline_id"));

    const coachReport = coachingReports.map(report => (
      <CoachingItem report={report} userId={userId} key={report._id} />
    ));

    return (
      <GridItem xs={12} sm={12} md={12}>
        <Card>
          <CardHeader color="primary">
            <span>Coachings</span>
          </CardHeader>
          <CardBody style={{ padding: "0.9375rem 0px 0px" }}>
            {coachingReports.length ? (
              coachReport
            ) : (
              <div style={{ padding: "0px 0.9375rem 20px" }}>
                Zaposleni još uvek nije imao ni jednu koučing sesiju
              </div>
            )}
          </CardBody>
        </Card>
      </GridItem>
    );
  }
}

export default CoachingReport;
