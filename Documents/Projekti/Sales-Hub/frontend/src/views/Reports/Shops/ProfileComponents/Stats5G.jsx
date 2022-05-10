import React, { useState, useEffect } from "react";
import axios from "axios";
import { backend_address as serverip } from "../../../../config/backend";
import request_config from "../../../../helpers/RequestConfig";
// Component UI
import Card from "components/Card/Card.jsx";
import CardBody from "components/Card/CardBody.jsx";
import CardHeader from "components/Card/CardHeader.jsx";
import CardFooter from "components/Card/CardFooter.jsx";
import CardIcon from "components/Card/CardIcon.jsx";
import GridItem from "components/Grid/GridItem.jsx";
import Icon from "@material-ui/core/Icon";

function Stats5G(props) {
  const { classes } = props;
  const [stats5G, setStats5G] = useState({});

  useEffect(() => {
    const { shop_id } = props;
    // Call backend API -  GET Statistic 5G data summary
    if (shop_id) {
      axios
        .get(
          `${serverip}/api/evaluations/shop5Gstats/${shop_id}`,
          request_config()
        )
        .then(stats5G => {
          setStats5G(stats5G.data[0]);
        })
        .catch(err => {
          console.log(err);
        });
    }
  }, []);

  return (
    <GridItem xs={12} sm={6} md={4}>
      <Card>
        <CardHeader color="primary" stats icon>
          <CardIcon color="primary">
            <Icon>timeline</Icon>
          </CardIcon>
          <p className={classes.cardCategory}>Statistika</p>
        </CardHeader>
        <CardBody>
          <h3 className={classes.cardTitle}>
            Ukupno ocena: {stats5G ? stats5G.count : 0}
          </h3>
          <h3 className={classes.cardTitle}>
            Prosečna ocena:{" "}
            <span style={{ color: "green", fontWeight: "400" }}>
              {stats5G ? Math.round(stats5G.avg) : "/"}
            </span>
          </h3>
        </CardBody>
        <CardFooter stats />
      </Card>
    </GridItem>
  );
}

export default Stats5G;
