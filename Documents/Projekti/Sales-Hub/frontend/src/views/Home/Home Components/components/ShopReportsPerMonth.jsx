import React, { Component } from "react";
import axios from "axios";
import { backend_address as serverip } from "../../../../config/backend";
import request_config from "../../../../helpers/RequestConfig";
// Core components
import CardBody from "components/Card/CardBody.jsx";
import CardHeader from "components/Card/CardHeader.jsx";
import MaterialTable from "components/Table/TablePaginationSearch.jsx";
import Card from "components/Card/Card.jsx";

class ShopReportsPerMonth extends Component {
  constructor(props) {
    super(props);

    this.state = {
      shopReportsPerMonth: []
    };
  }

  componentDidMount() {
    // ShopReport stats
    axios
      .get(
        `${serverip}/api/shopReports/dashboard/evaluatorCount`,
        request_config()
      )
      .then(shopReportsPerMonth => {
        const shopReports = shopReportsPerMonth.data;
        console.log(shopReports);
        this.setState({ shopReportsPerMonth: shopReports });
      })
      .catch(error => {
        console.log(error);
      });
  }

  render() {
    const { shopReportsPerMonth } = this.state;

    // Table columns to be rendered
    const evaluatorName = shopReportName => {
      return [<span>{shopReportName.fullname}</span>];
    };

    const evaluationNumber = shopReportName => {
      return [<p>{shopReportName.count}</p>];
    };
    // Table Headers
    const tableHead = [
      {
        title: "Ocenjivač",
        field: "fullname",
        render: evaluatorName
      },
      {
        title: "Broj ocena",
        field: "count",
        render: evaluationNumber
      }
    ];

    return (
      <Card>
        <CardHeader
          color="primary"
          style={{ paddingTop: "0px", paddingBottom: "0px" }}
        >
          <h4>Shop Report - ocenjivači (tekući mesec)</h4>
        </CardHeader>
        <CardBody>
          <MaterialTable
            tableHeaderColor="primary"
            pagination={false}
            tableData={shopReportsPerMonth}
            tableHead={tableHead}
            toolbar={false}
          />
        </CardBody>
      </Card>
    );
  }
}

export default ShopReportsPerMonth;
