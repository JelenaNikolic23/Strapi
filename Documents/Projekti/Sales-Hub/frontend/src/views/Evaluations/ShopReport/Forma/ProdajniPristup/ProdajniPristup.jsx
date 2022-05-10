import React, { useEffect } from "react";
import { Link } from "react-router-dom";
// Components and Data
import CategoryData from "../Kategorije/CategoryData.jsx";
import { ProdajniPristupCategory } from "../ShopReportData";
// Material Ui components
import Table from "components/Table/Table.jsx";
import Radio from "@material-ui/core/Radio";
import Button from "components/CustomButtons/Button.jsx";
// @material-ui/icons
import FiberManualRecord from "@material-ui/icons/FiberManualRecord";

import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles({
  root: {
    padding: "13px"
  },
  checked: {
    color: `#033E8C !important`
  },
  checkedIcon: {
    width: "20px",
    height: "20px",
    border: "1px solid black",
    borderRadius: "3px"
  },
  uncheckedIcon: {
    width: "0px",
    height: "0px",
    padding: "10px",
    border: "1px solid black",
    borderRadius: "3px"
  },
  radio: {
    color: `#033E8C !important`
  },
  radioChecked: {
    width: "20px",
    height: "20px",
    border: `1px solid #033E8C`,
    borderRadius: "50%"
  },
  radioUnchecked: {
    width: "0px",
    height: "0px",
    padding: "10px",
    border: "1px solid black",
    borderRadius: "50%"
  },
  upDivider: {
    marginTop: "0px",
    marginBottom: "30px",
    textAlign: "center"
  }
});

function ProdajniPristup(props) {
  const classes = useStyles();
  const [evaluations, setEvaluations] = React.useState(
    JSON.parse(localStorage.getItem("lastDayEvaluations")) !== undefined
      ? JSON.parse(localStorage.getItem("lastDayEvaluations"))
      : []
  );
  const [hasEvaluations, setHasEvaluations] = React.useState(true);
  const [selected, setSelected] = React.useState(
    localStorage.getItem("selectedEvaluation")
  );

  const rows = evaluations.map(row => {
    return [
      row.user,
      row.score,
      <Radio
        checked={selected === row.id}
        onChange={e => setSelected(e.target.value)}
        value={row.id}
        //name={item.checkboxName}
        aria-label="Shop Report"
        icon={<FiberManualRecord className={classes.radioUnchecked} />}
        checkedIcon={<FiberManualRecord className={classes.radioChecked} />}
        classes={{
          checked: classes.radio
        }}
      />
    ];
  });

  useEffect(() => {
    const lastDayEvaluations = JSON.parse(
      localStorage.getItem("lastDayEvaluations")
    );
    if (lastDayEvaluations.length) setEvaluations(lastDayEvaluations);
    setHasEvaluations(true);
    if (lastDayEvaluations.length === 0) setHasEvaluations(false);
  }, []);

  useEffect(() => {
    localStorage.setItem("selectedEvaluation", selected);
  }, [selected]);

  return (
    <>
      {hasEvaluations ? (
        <>
          <h4>Odaberi 5G evaluaciju iz ove posete</h4>
          <Table
            tableHeaderColor="primary"
            tableHead={["Prodavac", "Ocena", "Odaberi"]}
            tableData={rows}
            style={{ marginBottom: "50px" }}
          />
          <div style={{ marginTop: "100px" }} />
          <CategoryData
            kategorija={props.kategorija}
            handleChange={props.handleChange}
            data={ProdajniPristupCategory}
          />
        </>
      ) : (
        <>
          <h4>Nemate urađenih 5G evaluacija u ovoj poseti</h4>
          <Link to={`/admin/evaluations/5G`}>
            <Button color="primary" style={{ marginBottom: "70px" }}>
              Uradi 5G Evaluaciju
            </Button>
          </Link>
        </>
      )}
    </>
  );
}

export default ProdajniPristup;
