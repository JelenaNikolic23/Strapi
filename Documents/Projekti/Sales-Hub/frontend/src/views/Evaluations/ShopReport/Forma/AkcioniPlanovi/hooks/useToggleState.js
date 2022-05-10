import { useState } from "react";

// call useState
// return piece of state AND function to toggle it

function useToggle(initialVal = false) {
  // Call useState, "reserve piece of state"
  const [state, setState] = useState(initialVal);

  const toggle = () => {
    setState(!state);
  };
  return [state, toggle];
}

export default useToggle;
