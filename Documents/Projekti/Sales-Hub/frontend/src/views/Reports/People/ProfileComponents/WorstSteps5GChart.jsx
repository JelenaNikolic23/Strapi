import React, { Component } from "react";
import axios from "axios";
import { backend_address as serverip } from "../../../../config/backend";
import request_config from "../../../../helpers/RequestConfig";
import GridItem from "components/Grid/GridItem.jsx";
import ChartistGraph from "react-chartist";
import Chartist from "chartist";
import Card from "components/Card/Card.jsx";
import CardHeader from "components/Card/CardHeader.jsx";
import CardBody from "components/Card/CardBody.jsx";
import CardFooter from "components/Card/CardFooter.jsx";

class WorstSteps5GChart extends Component {
  constructor(props) {
    super(props);

    this.state = {
      worst5Gsteps: []
    };
  }
  componentDidMount() {
    const { frontline_id } = this.props;

    // Call backend API evaluations to GET 5G step with worst performance
    if (frontline_id) {
      axios
        .get(
          `${serverip}/api/evaluations/user5GworstStep/${frontline_id}`,
          request_config()
        )
        .then(summary => {
          this.setState({ ...this.state, worst5Gsteps: summary.data });
        })
        .catch(error => {
          console.log(error);
        });
    }
  }

  render() {
    const { classes } = this.props;
    const { worst5Gsteps } = this.state;
    // Getting labels and series for the chart
    let labelsWorstSteps = worst5Gsteps.map(item => {
      return item._id;
    });

    //labelsByMonth.sort();

    const seriesWorstSteps = worst5Gsteps.map(item => {
      return item.count;
    });

    // ##############################
    // // // Worst Steps 5G evaluations by month chart data
    // #############################

    const worstSteps5GChart = {
      data: {
        labels: labelsWorstSteps,
        series: [seriesWorstSteps]
      },
      options: {
        lineSmooth: Chartist.Interpolation.cardinal({
          tension: 0
        }),
        low: 0,
        high: Math.max(...seriesWorstSteps) + 1, // creative tim: we recommend you to set the high sa the biggest value + something for a better look
        chartPadding: {
          top: 0,
          right: 0,
          bottom: 0,
          left: 0
        }
      },
      // for animation
      animation: {
        draw: function(data) {
          if (data.type === "line" || data.type === "area") {
            data.element.animate({
              d: {
                begin: 600,
                dur: 700,
                from: data.path
                  .clone()
                  .scale(1, 0)
                  .translate(0, data.chartRect.height())
                  .stringify(),
                to: data.path.clone().stringify(),
                easing: Chartist.Svg.Easing.ease
              }
            });
          } else if (data.type === "point") {
            data.element.animate({
              opacity: {
                begin: (data.index + 1) * 80,
                dur: 500,
                from: 0,
                to: 1,
                easing: "ease"
              }
            });
          }
        }
      }
    };

    return (
      <GridItem xs={12} sm={12} md={6}>
        <Card chart>
          <CardHeader color="rose">
            <ChartistGraph
              className="ct-chart"
              data={worstSteps5GChart.data}
              type="Bar"
              options={worstSteps5GChart.options}
              listener={worstSteps5GChart.animation}
            />
          </CardHeader>
          <CardBody>
            <h4 className={classes.cardTitle}>
              5G - <small>najslabiji koraci</small>
            </h4>
          </CardBody>
          <CardFooter chart>
            <div className={classes.stats}>
              {/* <AccessTime /> updated 4 minutes ago */}
            </div>
          </CardFooter>
        </Card>
      </GridItem>
    );
  }
}

export default WorstSteps5GChart;
