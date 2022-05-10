import React, { useState, useEffect } from "react";
import axios from "axios";
import { backend_address as serverip } from "../../../../../config/backend";
import request_config from "../../../../../helpers/RequestConfig";
import ShopReportCategories from "./ShopReportCategories.jsx";
import ProdajniPristupCategory from "./ProdajniPristupCategory.jsx";
import ChallengesList from "./ChallengesList.jsx";
import ImageGallery from "react-image-gallery";

import { withStyles } from "@material-ui/core/styles";
import "react-image-gallery/styles/css/image-gallery.css";

const styles = {
  content: { justifyContent: "space-between", fontWeight: 200 }
};

function DetailedShopReport(props) {
  const { classes } = props;
  const [shopReport, setShopReport] = useState({
    ShopPerformans: [],
    ProdajniPristup: {},
    ManagementOsoblja: [],
    MerchShopLayout: [],
    AdministrativniPoslovi: [],
    evaluationId: "",
    evaluation5G: [],
    id: "",
    pictures: []
  });
  const [actionPlans, setActionPlans] = useState([]);
  const {
    ShopPerformans,
    ProdajniPristup,
    ManagementOsoblja,
    MerchShopLayout,
    AdministrativniPoslovi,
    evaluation5G,
    id
  } = shopReport;

  useEffect(() => {
    const { shopReport_id } = props.match.params;

    // Call Api to get Shop Report by id
    if (shopReport_id) {
      axios
        .get(`${serverip}/api/shopReports/${shopReport_id}`, request_config())
        .then(shopReport => {
          setShopReport({
            ShopPerformans: shopReport.data.evaluation.categories[0],
            ProdajniPristup: shopReport.data.evaluation.ProdajniPristup,
            ManagementOsoblja: shopReport.data.evaluation.categories[1],
            MerchShopLayout: shopReport.data.evaluation.categories[2],
            AdministrativniPoslovi: shopReport.data.evaluation.categories[3],
            evaluationId:
              shopReport.data.evaluation.ProdajniPristup.evaluation5G,
            id: shopReport.data._id,
            pictures: shopReport.data.pictures
          });
        })
        .catch(error => {
          console.log(error);
        });
    }
  }, []);

  useEffect(() => {
    const body = id;
    if (body) {
      axios
        .post(`${serverip}/api/actionPlans/${id}`, body, request_config())
        .then(actionPlans => setActionPlans(actionPlans.data))
        .catch(error => {
          console.log(error);
        });
    }
  }, [shopReport.id]);

  useEffect(() => {
    if (shopReport.evaluationId.length) {
      axios
        .get(
          `${serverip}/api/evaluations/${shopReport.evaluationId}`,
          request_config()
        )
        .then(evaluation => {
          setShopReport({
            ...shopReport,
            evaluation5G: [
              {
                score: evaluation.data.evaluation.score,
                fullname: evaluation.data.user.fullname,
                userId: evaluation.data.user.frontline_id,
                id: evaluation.data._id
              }
            ]
          });
        })
        .catch(error => {
          console.log(error);
        });
    }
  }, [shopReport.evaluationId]);

  const challenges = actionPlans.map(challenge => {
    return <ChallengesList challenge={challenge} key={challenge._id} />;
  });

  const images = shopReport.pictures.map(image => {
    return {
      original: `uploads/shopReport/${image}`,
      thumbnail: `uploads/shopReport/${image}`
    };
  });

  return (
    <div style={{ width: "100%" }}>
      <h5 style={{ marginTop: "15px" }}>Evaluacija</h5>
      <ShopReportCategories
        steps={ShopPerformans.categorySteps}
        name={ShopPerformans.categoryName}
        comment={ShopPerformans.categoryComment}
      />
      <ProdajniPristupCategory
        steps={ProdajniPristup.categorySteps}
        evaluation5G={evaluation5G}
      />
      <ShopReportCategories
        steps={ManagementOsoblja.categorySteps}
        name={ManagementOsoblja.categoryName}
        comment={ManagementOsoblja.categoryComment}
      />
      <ShopReportCategories
        steps={MerchShopLayout.categorySteps}
        name={MerchShopLayout.categoryName}
        comment={MerchShopLayout.categoryComment}
      />
      <ShopReportCategories
        steps={AdministrativniPoslovi.categorySteps}
        name={AdministrativniPoslovi.categoryName}
        comment={AdministrativniPoslovi.categoryComment}
      />
      <h5>Izazovi</h5>
      {challenges}
      <h5>Slike</h5>
      <ImageGallery items={images} showPlayButton={false} />
    </div>
  );
}

export default withStyles(styles)(DetailedShopReport);
