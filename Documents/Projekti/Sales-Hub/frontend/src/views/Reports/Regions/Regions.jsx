import React, { Component } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { backend_address as serverip } from "../../../config/backend";
import request_config from "../../../helpers/RequestConfig";
// Datepicker Table
import DatePickerTable from "../../../components/DatePickerTable/DatePickerTable.jsx";
// @material-ui/core components
import withStyles from "@material-ui/core/styles/withStyles";
import Icon from "@material-ui/core/Icon";
import GridItem from "components/Grid/GridItem.jsx";
import GridContainer from "components/Grid/GridContainer.jsx";

import cardImagesStyles from "assets/jss/material-dashboard-react/cardImagesStyles.jsx";

export class Regions extends Component {
  constructor(props) {
    super(props);

    this.state = {
      regions: [],
    };

    this.handleSubmitDates = this.handleSubmitDates.bind(this);
  }
  componentDidMount() {
    const nowDate = new Date();
    const dateNow = nowDate.toISOString();
    const dateFirstInMonth = nowDate.setDate(1);

    const body = {
      date_from: new Date(dateFirstInMonth).toISOString(),
      date_to: dateNow,
    };

    axios
      .post(`${serverip}/api/regions/withEval`, body, request_config())
      .then(regionsData => {
        const regionsArray = regionsData.data.groups_array;
        this.setState({ regions: regionsArray });
      })
      .catch(error => {
        console.log(error);
      });
  }

  handleSubmitDates = (dateFrom, dateTo) => {
    const body = {
      date_from: dateFrom,
      date_to: dateTo,
    };

    // Axios post request - Get All Regions with stats for selected date range
    axios
      .post(`${serverip}/api/regions/withEval`, body, request_config())
      .then(regionsData => {
        const regionsArray = regionsData.data.groups_array;
        this.setState({ regions: regionsArray });
      })
      .catch(err => {
        console.log(err);
      });
  };

  render() {
    const { classes } = this.props;

    const regionsNamesDataRender = region => {
      const profile_url = `/admin/reports/regions/${region.id}`;

      return [
        <Link
          to={profile_url}
          style={{
            color: "#033E8C",
            lineHeight: "25px",
            height: "25px",
          }}
        >
          <Icon
            style={{
              verticalAlign: "middle",
            }}
          >
            store
          </Icon>{" "}
          <span
            style={{
              verticalAlign: "middle",
            }}
          >
            {region.name}
          </span>
        </Link>,
      ];
    };

    const regionsEvalDataRender = region => {
      return [<span>{region.evalCount != null ? region.evalCount : "/"}</span>];
    };

    const regionsEval7PDataRender = region => {
      return [
        <span>{region.evalCount7P != null ? region.evalCount7P : "/"}</span>,
      ];
    };

    const regionsCoachingCountDataRender = region => {
      return [
        <span>
          {region.coachingCount != null ? region.coachingCount : "/"}
        </span>,
      ];
    };

    const regionsFeedbackCountDataRender = region => {
      return [
        <span>
          {region.feedbackCount != null ? region.feedbackCount : "/"}
        </span>,
      ];
    };

    const regionsEvalAvgDataRender = region => {
      let color = () => {
        // return evaluation.evaluation.score > 70 ? "green" : "red";
        if (region.evalAvg > 80) {
          return "green";
        } else if (region.evalAvg >= 70) {
          return "orange";
        } else if (region.evalAvg != null) {
          return "red";
        } else {
          return "grey";
        }
      };

      return [
        <span style={{ color: color() }}>
          <strong>
            {region.evalAvg != null ? Math.round(region.evalAvg) : "/"}
          </strong>
        </span>,
      ];
    };

    const regionsEvalAvg7PDataRender = region => {
      let color = () => {
        // return evaluation.evaluation.score > 70 ? "green" : "red";
        if (region.evalAvg7P > 80) {
          return "green";
        } else if (region.evalAvg7P >= 70) {
          return "orange";
        } else if (region.evalAvg7P != null) {
          return "red";
        } else {
          return "grey";
        }
      };

      return [
        <span style={{ color: color() }}>
          <strong>
            {region.evalAvg7P != null ? Math.round(region.evalAvg7P) : "/"}
          </strong>
        </span>,
      ];
    };

    const regionsReportsCountDataRender = region => {
      return [
        <span>{region.reportsCount != null ? region.reportsCount : "/"}</span>,
      ];
    };

    return (
      <GridContainer>
        <GridItem xs={12} sm={12} md={12}>
          <DatePickerTable
            headerTitle="Regioni"
            search={true}
            pageSize={10}
            dateFrom={new Date().setDate(1)}
            submitDates={this.handleSubmitDates}
            tableData={this.state.regions}
            tableHead={[
              {
                title: "Naziv regiona",
                field: "name",
                cellStyle: {
                  whiteSpace: "nowrap",
                },
                headerStyle: {
                  whiteSpace: "nowrap",
                },
                render: regionsNamesDataRender,
              },
              {
                title: "5G - ukupno",
                field: "evalCount",
                render: regionsEvalDataRender,
              },
              {
                title: "5G - prosek",
                field: "evalAvg",
                render: regionsEvalAvgDataRender,
              },
              {
                title: "7P - ukupno",
                field: "evalCount7P",
                render: regionsEval7PDataRender,
              },
              {
                title: "7P - prosek",
                field: "evalAvg7P",
                render: regionsEvalAvg7PDataRender,
              },
              {
                title: "Coaching - ukupno",
                field: "coachingsReport",
                render: regionsCoachingCountDataRender,
              },
              {
                title: "Feedback - ukupno",
                field: "feedbackCount",
                render: regionsFeedbackCountDataRender,
              },
              {
                title: "Shop Report - ukupno",
                field: "reportsCount",
                render: regionsReportsCountDataRender,
              },
            ]}
          />
        </GridItem>
      </GridContainer>
    );
  }
}

export default withStyles(cardImagesStyles)(Regions);
