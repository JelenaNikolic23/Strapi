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

class avg5GChartByMonth extends Component {
  constructor(props) {
    super(props);

    this.state = {
      avg5GbyMonth: []
    };
  }

  componentDidMount() {
    const { frontline_id } = this.props;

    // Call backend API evaluations to GET average score by month for the user
    if (frontline_id) {
      axios
        .get(
          `${serverip}/api/evaluations/user5GstatsByMonth/${frontline_id}`,
          request_config()
        )
        .then(summary => {
          this.setState({ ...this.state, avg5GbyMonth: summary.data });
        })
        .catch(error => {
          console.log(error);
        });
    }
  }

  render() {
    const { classes } = this.props;
    const { avg5GbyMonth } = this.state;
    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "Maj",
      "Jun",
      "Jul",
      "Avg",
      "Sep",
      "Okt",
      "Nov",
      "Dec"
    ];

    // Getting labels and series for the chart

    const labelsByMonth = avg5GbyMonth.map(item => {
      return item._id;
    });

    // Sorting given numbers in array

    const sortedLabelsByMonth = labelsByMonth.sort((a, b) => a - b);

    // converting numbers to months names

    const labelsNamesByMonth = sortedLabelsByMonth.map(number => {
      var selectedMonthName = months[number - 1];

      return selectedMonthName;
    });

    const seriesByMonth = avg5GbyMonth.map(item => {
      return item.avg;
    });

    const avg5GChartByMonth = {
      data: {
        labels: labelsNamesByMonth,
        series: [seriesByMonth]
      },
      options: {
        lineSmooth: Chartist.Interpolation.cardinal({
          tension: 0
        }),
        low: 0,
        high: 110, // creative tim: we recommend you to set the high sa the biggest value + something for a better look
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
          <CardHeader color="primary">
            <ChartistGraph
              className="ct-chart"
              data={avg5GChartByMonth.data}
              type="Bar"
              options={avg5GChartByMonth.options}
              listener={avg5GChartByMonth.animation}
            />
          </CardHeader>
          <CardBody>
            <h4 className={classes.cardTitle}>
              5G - <small>prosečne ocene po mesecima</small>
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

export default avg5GChartByMonth;
