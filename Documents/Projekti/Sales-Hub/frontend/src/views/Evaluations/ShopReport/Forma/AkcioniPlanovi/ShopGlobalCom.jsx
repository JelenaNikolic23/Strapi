import React from "react";

import TextField from "@material-ui/core/TextField";

function ShopGlobalCom({ globalComments, addGlobalComment }) {
  return (
    <TextField
      value={globalComments}
      onChange={function(e) {
        addGlobalComment(e.target.value);
      }}
      margin="normal"
      label="Globalni Komentari"
      placeholder="Kreiraj novi izazov"
      fullWidth
      multiline
    />
  );
}

export default ShopGlobalCom;
