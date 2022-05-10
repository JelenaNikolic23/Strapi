import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { backend_address as serverip } from "../../../../config/backend";
import request_config from "../../../../helpers/RequestConfig";

// Core components
import DatePickerTable from "../../../../components/DatePickerTable/DatePickerTable.jsx";
import Icon from "@material-ui/core/Icon";
import Tooltip from "@material-ui/core/Tooltip";
import GridItem from "components/Grid/GridItem.jsx";

function Evaluations5GTable({ region_id, tooltip }) {
  const [evalData, setEvalData] = useState();

  useEffect(() => {
    // Axios post request - Get all evaluations created in last month
    if (region_id) {
      const nowDate = new Date();
      const dateNow = nowDate.toISOString();
      const dateMonthBefore = nowDate.setMonth(nowDate.getMonth() - 1);
      const evalDateBody = {
        date_from: new Date(dateMonthBefore).toISOString(),
        date_to: dateNow
      };

      axios
        .post(
          `${serverip}/api/evaluations/datepicker/region/${region_id}`,
          evalDateBody,
          request_config()
        )
        .then(newEvaluations => {
          setEvalData(newEvaluations.data);
        })
        .catch(err => {
          console.log(err);
        });
    }
  }, []);

  const handleSubmitDates = (dateFrom, dateTo) => {
    const body = {
      date_from: dateFrom,
      date_to: dateTo
    };

    // Axios post request - Get All Evaluations for selected date range
    axios
      .post(
        `${serverip}/api/evaluations/datepicker/region/${region_id}`,
        body,
        request_config()
      )
      .then(newEvaluations => {
        setEvalData(newEvaluations.data);
      })
      .catch(err => {
        console.log(err);
      });
  };

  // Table Columns that will be rendered
  const EvalDate = evaluation => {
    return [<span>{evaluation.date.split("T")[0]}</span>];
  };

  const ShopName = evaluation => {
    return [evaluation.user.group_name];
  };

  const EvalRateName = evaluation => {
    return [<span>{evaluation.user.fullname}</span>];
  };

  const EvaluatorName = evaluation => {
    return [<span>{evaluation.evaluator.fullname}</span>];
  };

  const EvaluationGrade = evaluation => {
    let color = () => {
      if (evaluation.evaluation.score > 80) {
        return "green";
      } else if (evaluation.evaluation.score >= 70) {
        return "orange";
      } else {
        return "red";
      }
    };

    return [
      <span>
        <strong style={{ color: color(), marginLeft: "0.5rem" }}>
          {evaluation.evaluation.score}
        </strong>
      </span>
    ];
  };

  const EvalIsSeen = evaluation => {
    const eval_is_seen = evaluation.evaluation_seen ? (
      <Tooltip
        id="tooltip-top"
        title="Zaposleni je pregledao ocenu"
        placement="top"
        classes={{ tooltip: tooltip }}
      >
        <Icon style={{ color: "green" }}>visibility</Icon>
      </Tooltip>
    ) : (
      <Tooltip
        id="tooltip-top"
        title="Zaposleni nije pregledao ocenu"
        placement="top"
        classes={{ tooltip: tooltip }}
      >
        <Icon style={{ color: "grey" }}>visibility_off</Icon>
      </Tooltip>
    );

    return [<div style={{ marginLeft: "0.5rem" }}>{eval_is_seen}</div>];
  };

  const EvalDetails = evaluation => {
    return [
      <Link
        to={`/admin/reports/people/${evaluation.user.frontline_id}/${
          evaluation._id
        }`}
        style={{
          color: "#033E8C",
          lineHeight: "25px",
          height: "25px"
        }}
      >
        Pogledaj evaluaciju
      </Link>
    ];
  };

  // Table Headers
  const tableHead = [
    {
      title: "Datum ocene",
      field: "date",
      render: EvalDate
    },
    {
      title: "Prodavnica",
      field: "user.group_name",
      render: ShopName
    },
    {
      title: "Ocenjen",
      field: "user.fullname",
      render: EvalRateName
    },
    {
      title: "Ocena",
      field: "evaluation.score",
      render: EvaluationGrade
    },

    {
      title: "Evaluator",
      field: "evaluator.fullname",
      render: EvaluatorName
    },
    {
      title: "Pregled",
      field: "evaluation_seen",
      render: EvalIsSeen
    },
    {
      title: "Detaljnije",
      field: "none",
      render: EvalDetails
    }
  ];

  return (
    <GridItem xs={12} sm={12} md={12}>
      <DatePickerTable
        headerTitle="5G Evaluacije"
        submitDates={handleSubmitDates}
        tableData={evalData}
        tableHead={tableHead}
      />
    </GridItem>
  );
}

export default Evaluations5GTable;
