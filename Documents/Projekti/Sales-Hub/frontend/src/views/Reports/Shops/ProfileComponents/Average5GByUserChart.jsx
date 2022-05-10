import React, { useState, useEffect } from "react";
import Chartist from "chartist";
import axios from "axios";
import { backend_address as serverip } from "../../../../config/backend";
import request_config from "../../../../helpers/RequestConfig";
// react plugin for creating charts
import ChartistGraph from "react-chartist";
// Component UI
import Card from "components/Card/Card.jsx";
import CardBody from "components/Card/CardBody.jsx";
import CardHeader from "components/Card/CardHeader.jsx";
import CardFooter from "components/Card/CardFooter.jsx";
import GridItem from "components/Grid/GridItem.jsx";

function Average5GByUserChart(props) {
  const { classes } = props;
  const [avg5GByUser, setAvg5GByUser] = useState([]);

  useEffect(() => {
    const { shop_id } = props;
    // Call backend API -  GET Average 5G data
    if (shop_id) {
      axios
        .get(
          `${serverip}/api/evaluations/shop5Gstats/perUser/${shop_id}`,
          request_config()
        )
        .then(avg5GByUser => {
          setAvg5GByUser(avg5GByUser.data);
        })
        .catch(err => {
          console.log(err);
        });
    }
  }, []);

  // #############################
  // // // 5G Averages by User - Bar Chart Configuration
  // #############################
  let labels = [];
  let series = [];
  avg5GByUser.forEach(user => {
    labels.push(user.fullname);
    series.push(user.avg);
  });

  const avg5GbyUserChart = {
    data: {
      labels: labels,
      series: [series]
    },
    options: {
      axisX: {
        showGrid: false
      },
      low: 0,
      high: 102,
      chartPadding: {
        top: 0,
        right: 5,
        bottom: 0,
        left: 0
      }
    },
    responsiveOptions: [
      [
        "screen and (max-width: 640px)",
        {
          seriesBarDistance: 5,
          axisX: {
            labelInterpolationFnc: function(value) {
              return value[0];
            }
          }
        }
      ]
    ],
    animation: {
      draw: function(data) {
        if (data.type === "bar") {
          data.element.animate({
            opacity: {
              begin: (data.index + 1) * 80,
              dur: 500,
              from: 0,
              to: 1,
              easing: Chartist.Svg.Easing.ease
            }
          });
        }
      }
    }
  };

  return (
    <GridItem xs={12} sm={12} md={12}>
      <Card chart>
        <CardHeader color="primary">
          <ChartistGraph
            className="ct-chart"
            data={avg5GbyUserChart.data}
            type="Bar"
            options={avg5GbyUserChart.options}
            responsiveOptions={avg5GbyUserChart.responsiveOptions}
            listener={avg5GbyUserChart.animation}
          />
        </CardHeader>
        <CardBody>
          <h4 className={classes.cardTitle}>5G</h4>
          <p className={classes.cardCategory}>Prosečna ocena po prodavcu</p>
        </CardBody>
        <CardFooter chart>
          <div className={classes.stats}>
            {/* <AccessTime /> campaign sent 2 days ago */}
          </div>
        </CardFooter>
      </Card>
    </GridItem>
  );
}

export default Average5GByUserChart;
