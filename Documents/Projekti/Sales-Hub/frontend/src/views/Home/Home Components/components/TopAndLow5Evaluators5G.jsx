import React, { Component } from "react";
import CustomTabs from "components/CustomTabs/CustomTabs.jsx";
import axios from "axios";
import { backend_address as serverip } from "../../../../config/backend";
import Table from "components/Table/Table.jsx";
import request_config from "../../../../helpers/RequestConfig";
import { Link } from "react-router-dom";
import Person from "@material-ui/icons/Person";

export class TopAndLow5Evaluators5G extends Component {
  constructor(props) {
    super(props);

    this.state = {
      top5G: [],
      low5G: [],
      evaluatorStats: []
    };
  }

  componentDidMount() {
    // Top 5 and low 5
    axios
      .get(`${serverip}/api/evaluations/dashboard/topAndlow5`, request_config())
      .then(top5G => {
        this.setState({
          ...this.state,
          top5G: top5G.data.top5G,
          low5G: top5G.data.low5G
        });
      })
      .catch(error => {
        console.log(error);
      });
  }

  render() {
    const { top5G, low5G } = this.state;

    // Mapping through the top5G to get data for the table
    const topPerform = top5G.map(salesman => {
      return [
        <Link to={`/admin/reports/people/${salesman._id}`}>
          {salesman.fullname}
        </Link>,
        <strong style={{ color: "green" }}>{Math.round(salesman.avg)}</strong>,
        salesman.shop
      ];
    });

    // Mapping through the low5G to get data for the table
    const lowPerform = low5G.map(salesman => {
      return [
        <Link to={`/admin/reports/people/${salesman._id}`}>
          {salesman.fullname}
        </Link>,
        <strong style={{ color: "red" }}>{Math.round(salesman.avg)}</strong>,
        salesman.shop
      ];
    });

    return (
      <div>
        <CustomTabs
          title="5G:"
          headerColor="primary"
          tabs={[
            {
              tabName: "Top 5",
              tabIcon: Person,
              tabContent: (
                <Table
                  tableHeaderColor="primary"
                  tableHead={["Prodavac", "Ocena", "Prodavnica"]}
                  tableData={topPerform}
                />
              )
            },
            {
              tabName: "Low 5",
              tabIcon: Person,
              tabContent: (
                <Table
                  tableHeaderColor="primary"
                  tableHead={["Prodavac", "Ocena", "Prodavnica"]}
                  tableData={lowPerform}
                />
              )
            }
          ]}
        />
      </div>
    );
  }
}

export default TopAndLow5Evaluators5G;
