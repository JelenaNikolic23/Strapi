import React from "react";
import PropTypes from "prop-types";
import MaterialTable from "material-table";
import { forwardRef } from "react";

import AddBox from "@material-ui/icons/AddBox";
import ArrowUpward from "@material-ui/icons/ArrowUpward";
import Check from "@material-ui/icons/Check";
import ChevronLeft from "@material-ui/icons/ChevronLeft";
import ChevronRight from "@material-ui/icons/ChevronRight";
import Clear from "@material-ui/icons/Clear";
import DeleteOutline from "@material-ui/icons/DeleteOutline";
import Edit from "@material-ui/icons/Edit";
import FilterList from "@material-ui/icons/FilterList";
import FirstPage from "@material-ui/icons/FirstPage";
import LastPage from "@material-ui/icons/LastPage";
import Remove from "@material-ui/icons/Remove";
import SaveAlt from "@material-ui/icons/SaveAlt";
import Search from "@material-ui/icons/Search";
import ViewColumn from "@material-ui/icons/ViewColumn";
// @material-ui/core components
import withStyles from "@material-ui/core/styles/withStyles";

// core components
import tableStyle from "assets/jss/material-dashboard-react/components/tableStyle.jsx";

function CustomTable({ ...props }) {
  const { classes, tableHead, tableData, tableHeaderColor, pageSize } = props;
  const tableIcons = {
    Add: forwardRef((props, ref) => <AddBox {...props} ref={ref} />),
    Check: forwardRef((props, ref) => <Check {...props} ref={ref} />),
    Clear: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
    Delete: forwardRef((props, ref) => <DeleteOutline {...props} ref={ref} />),
    DetailPanel: forwardRef((props, ref) => (
      <ChevronRight {...props} ref={ref} />
    )),
    Edit: forwardRef((props, ref) => <Edit {...props} ref={ref} />),
    Export: forwardRef((props, ref) => <SaveAlt {...props} ref={ref} />),
    Filter: forwardRef((props, ref) => <FilterList {...props} ref={ref} />),
    FirstPage: forwardRef((props, ref) => <FirstPage {...props} ref={ref} />),
    LastPage: forwardRef((props, ref) => <LastPage {...props} ref={ref} />),
    NextPage: forwardRef((props, ref) => <ChevronRight {...props} ref={ref} />),
    PreviousPage: forwardRef((props, ref) => (
      <ChevronLeft {...props} ref={ref} />
    )),
    ResetSearch: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
    Search: forwardRef((props, ref) => <Search {...props} ref={ref} />),
    SortArrow: forwardRef((props, ref) => <ArrowUpward {...props} ref={ref} />),
    ThirdStateCheck: forwardRef((props, ref) => (
      <Remove {...props} ref={ref} />
    )),
    ViewColumn: forwardRef((props, ref) => <ViewColumn {...props} ref={ref} />),
  };

  return (
    <div className={classes.tableResponsive}>
      <MaterialTable
        className={classes.table}
        title=""
        data={tableData}
        columns={tableHead}
        //isLoading
        localization={{
          body: {
            emptyDataSourceMessage: "Nema rezultata za odabrani period",
          },
          pagination: {
            labelDisplayedRows: "{from}-{to} od {count}",
            labelRowsSelect: "redova",
            firstTooltip: "Prva strana",
            previousTooltip: "Prethodna strana",
            nextTooltip: "Sledeća strana",
            lastTooltip: "Poslednja strana",
          },
          toolbar: {
            exportTitle: "Preuzmi",
            exportName: "Preuzmi CSV",
          },
        }}
        options={{
          toolbar: props.toolbar === false ? false : true,
          search: props.search === false ? false : true,
          paging: props.pagination === false ? false : true,
          pageSize: !pageSize ? 5 : pageSize,
          //exportButton: props.exportButton === false ? false : true
          exportButton: true,
          exportAllData: true,
          exportFileName: "Izveštaj",
          padding: "dense",
          headerStyle: {
            //backgroundColor: "#DEF3FA",
            //color: "Black",
            //whiteSpace: "nowrap",
          },
        }}
      />
    </div>
  );
}

CustomTable.defaultProps = {
  tableHeaderColor: "gray",
};

CustomTable.propTypes = {
  classes: PropTypes.object.isRequired,
  tableHeaderColor: PropTypes.oneOf([
    "warning",
    "primary",
    "danger",
    "success",
    "info",
    "rose",
    "gray",
  ]),
  tableHead: PropTypes.arrayOf(PropTypes.string),
  tableData: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.any)),
};

export default withStyles(tableStyle)(CustomTable);
