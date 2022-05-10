import React, { Component } from "react";
import axios from "axios";
import { backend_address as serverip } from "../../../../config/backend";
import Table from "components/Table/Table.jsx";
import Card from "components/Card/Card.jsx";
import CardHeader from "components/Card/CardHeader.jsx";
import CardBody from "components/Card/CardBody.jsx";
import request_config from "../../../../helpers/RequestConfig";

export class Evaluators5GPerMonth extends Component {
  constructor(props) {
    super(props);

    this.state = {
      evaluatorStats: []
    };
  }

  componentDidMount() {
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
    const { evaluatorStats } = this.state;

    //Mapping through the evaluators data for the table
    const evaluatorsData = evaluatorStats.map(evaluator => {
      return [evaluator.fullname, evaluator.count, Math.round(evaluator.avg)];
    });

    return (
      <div>
        <Card>
          <CardHeader
            color="primary"
            style={{ paddingTop: "0px", paddingBottom: "0px" }}
          >
            <h4>5G - ocenjivači (tekući mesec)</h4>
          </CardHeader>
          <CardBody>
            <Table
              tableHeaderColor="primary"
              tableHead={["Ocenjivač", "Broj ocena", "Prosečna ocena"]}
              tableData={evaluatorsData}
            />
          </CardBody>
        </Card>
      </div>
    );
  }
}

export default Evaluators5GPerMonth;
