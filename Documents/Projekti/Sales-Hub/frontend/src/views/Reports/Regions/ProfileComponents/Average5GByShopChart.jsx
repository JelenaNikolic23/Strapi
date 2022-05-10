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

function Average5GByShopChart(props) {
  const { classes } = props;
  const [avg5GByShop, setAvg5GByShop] = useState([]);

  useEffect(() => {
    const { region_id } = props;

    // Call backend API - Get shops with eval count and avg
    if (region_id) {
      const nowDate = new Date();
      const dateNow = nowDate.toISOString();
      const dateFirstInMonth = nowDate.setDate(1);

      const body = {
        date_from: new Date(dateFirstInMonth).toISOString(),
        date_to: dateNow
      };

      axios
        .post(
          `${serverip}/api/shops/withEval/region/${region_id}`,
          body,
          request_config()
        )
        .then(avg5GByShop => {
          console.log(avg5GByShop.data);
          setAvg5GByShop(avg5GByShop.data.groups_array);
        })
        .catch(error => {
          console.log(error);
        });
    }
  }, []);

  // #############################
  // // // 5G Averages by Shop - Bar Chart Configuration
  // #############################
  let labels = [];
  let series = [];
  avg5GByShop.forEach(shop => {
    labels.push(shop.name);
    series.push(shop.evalAvg);
  });

  const avg5GbyShopChart = {
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
            data={avg5GbyShopChart.data}
            type="Bar"
            options={avg5GbyShopChart.options}
            responsiveOptions={avg5GbyShopChart.responsiveOptions}
            listener={avg5GbyShopChart.animation}
          />
        </CardHeader>
        <CardBody>
          <h4 className={classes.cardTitle}>5G</h4>
          <p className={classes.cardCategory}>Prosečna ocena po prodavnici</p>
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

export default Average5GByShopChart;
