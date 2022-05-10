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

export class Shops extends Component {
  constructor(props) {
    super(props);

    this.state = {
      shops: [],
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
      .post(`${serverip}/api/shops/withEval`, body, request_config())
      .then(shopsData => {
        const shopsArray = shopsData.data.groups_array;
        this.setState({ shops: shopsArray });
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

    // Axios post request - Get All Shops with stats for selected date range
    axios
      .post(`${serverip}/api/shops/withEval`, body, request_config())
      .then(shopsData => {
        const shopsArray = shopsData.data.groups_array;
        this.setState({ shops: shopsArray });
      })
      .catch(err => {
        console.log(err);
      });
  };

  render() {
    const { classes } = this.props;

    const shopsNamesDataRender = shop => {
      const profile_url = `/admin/reports/shops/${shop.id}`;

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
            {shop.name}
          </span>
        </Link>,
      ];
    };

    const shopsEvalDataRender = shop => {
      return [<span>{shop.evalCount != null ? shop.evalCount : "/"}</span>];
    };

    const shopsEval7PDataRender = shop => {
      return [<span>{shop.evalCount7P != null ? shop.evalCount7P : "/"}</span>];
    };

    const coachingCountDataRender = shop => {
      return [
        <span>{shop.coachingCount != null ? shop.coachingCount : "/"}</span>,
      ];
    };

    const feedbackCountDataRender = shop => {
      return [
        <span>{shop.feedbackCount != null ? shop.feedbackCount : "/"}</span>,
      ];
    };

    const shopsEvalAvgDataRender = shop => {
      let color = () => {
        // return evaluation.evaluation.score > 70 ? "green" : "red";
        if (shop.evalAvg > 80) {
          return "green";
        } else if (shop.evalAvg >= 70) {
          return "orange";
        } else if (shop.evalAvg != null) {
          return "red";
        } else {
          return "grey";
        }
      };

      return [
        <span style={{ color: color() }}>
          <strong>
            {shop.evalAvg != null ? Math.round(shop.evalAvg) : "/"}
          </strong>
        </span>,
      ];
    };

    const shopsEvalAvg7PDataRender = shop => {
      let color = () => {
        // return evaluation.evaluation.score > 70 ? "green" : "red";
        if (shop.evalAvg7P > 80) {
          return "green";
        } else if (shop.evalAvg7P >= 70) {
          return "orange";
        } else if (shop.evalAvg7P != null) {
          return "red";
        } else {
          return "grey";
        }
      };

      return [
        <span style={{ color: color() }}>
          <strong>
            {shop.evalAvg7P != null ? Math.round(shop.evalAvg7P) : "/"}
          </strong>
        </span>,
      ];
    };

    const shopReportsCountDataRender = shop => {
      return [
        <span>{shop.reportsCount != null ? shop.reportsCount : "/"}</span>,
      ];
    };

    return (
      <GridContainer>
        <GridItem xs={12} sm={12} md={12}>
          <DatePickerTable
            headerTitle="Prodavnice"
            search={true}
            pageSize={10}
            dateFrom={new Date().setDate(1)}
            submitDates={this.handleSubmitDates}
            tableData={this.state.shops}
            tableHead={[
              {
                title: "Naziv prodavnice",
                field: "name",
                cellStyle: {
                  whiteSpace: "nowrap",
                },
                headerStyle: {
                  whiteSpace: "nowrap",
                },
                render: shopsNamesDataRender,
              },
              {
                title: "5G - ukupno",
                field: "evalCount",
                render: shopsEvalDataRender,
              },
              {
                title: "5G - prosek",
                field: "evalAvg",
                render: shopsEvalAvgDataRender,
              },
              {
                title: "7P - ukupno",
                field: "evalCount",
                render: shopsEval7PDataRender,
              },
              {
                title: "7P - prosek",
                field: "evalAvg",
                render: shopsEvalAvg7PDataRender,
              },
              {
                title: "Coaching - ukupno",
                field: "coachingsReport",
                render: coachingCountDataRender,
              },
              {
                title: "Feedback - ukupno",
                field: "feedbackCount",
                render: feedbackCountDataRender,
              },
              {
                title: "Shop Report - ukupno",
                field: "reportsCount",
                render: shopReportsCountDataRender,
              },
            ]}
          />
        </GridItem>
      </GridContainer>
    );
  }
}

export default withStyles(cardImagesStyles)(Shops);
