import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { backend_address as serverip } from "../../../../config/backend";
import request_config from "../../../../helpers/RequestConfig";
// Component UI
import MaterialTable from "components/Table/TablePaginationSearch.jsx";
import Card from "components/Card/Card.jsx";
import CardBody from "components/Card/CardBody.jsx";
import CardHeader from "components/Card/CardHeader.jsx";
import GridItem from "components/Grid/GridItem.jsx";

function ShopReportsList({ shop_id }) {
  const [shopReports, setShopReports] = useState();

  useEffect(() => {
    // Axios post request - Get all Shop Reports for the selected shop
    if (shop_id) {
      axios
        .get(`${serverip}/api/shopReports/shop/${shop_id}`, request_config())
        .then(shopReports => {
          setShopReports(shopReports.data);
        })
        .catch(err => {
          console.log(err);
        });
    }
  }, []);
  // Define what will be rendered in columns of MaterialTable
  const shopReportLink = shopReport => {
    const shopReportDetailed = `/admin/reports/shops/${shop_id}/${
      shopReport._id
    }`;

    return [
      <Link
        to={shopReportDetailed}
        style={{
          color: "#033E8C",
          lineHeight: "25px",
          height: "25px",
        }}
        key={shopReport._id}
      >
        <span>Prikaži</span>
      </Link>,
    ];
  };

  const shopReportDate = shopReport => {
    return [<span key={shopReport._id}>{shopReport.date.split("T")[0]}</span>];
  };

  const ShopReportEvaluator = shopReport => {
    return <span>{shopReport.evaluator}</span>;
  };

  return (
    <GridItem xs={12} sm={12} md={8}>
      <Card>
        <CardHeader color="primary">Shop Report</CardHeader>
        <CardBody>
          <MaterialTable
            tableData={shopReports}
            tableHead={[
              {
                title: "Datum kreiranja",
                field: "date",
                render: shopReportDate,
              },
              {
                title: "Evaluator",
                field: "evaluator",
                render: ShopReportEvaluator,
              },
              {
                title: "Detaljnije",
                field: "_id",
                render: shopReportLink,
              },
            ]}
            toolbar={false}
          />
        </CardBody>
      </Card>
    </GridItem>
  );
}

export default ShopReportsList;
