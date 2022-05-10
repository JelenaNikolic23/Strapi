import React from "react";

import Card from "components/Card/Card.jsx";
import Header from "components/Card/CardHeaderDatePicker.jsx";
import MaterialTable from "components/Table/TablePaginationSearch.jsx";
import CardBody from "components/Card/CardBody.jsx";

function DatePickerTable(props) {
  const {
    headerTitle,
    submitDates,
    tableData,
    tableHead,
    search,
    dateFrom,
    dateTo,
    pageSize,
  } = props;
  return (
    <Card>
      <Header
        title={headerTitle} //String
        submitDates={submitDates}
        dateFrom={dateFrom}
        dateTo={dateTo}
      />
      <CardBody style={{ marginTop: "-2rem" }}>
        <MaterialTable
          tableData={tableData}
          tableHeaderColor="primary"
          pageSize={pageSize}
          //toolbar={false}
          search={search !== undefined ? search : false}
          //exportButton={false}
          tableHead={tableHead}
        />
      </CardBody>
    </Card>
  );
}

export default DatePickerTable;
