import React from "react";
import { motion } from "framer-motion";
import GridLoader from "react-spinners/GridLoader";


const loaderPage={
    height:"80vh",
    display:"flex",
    justifyContent:"center",
    alignItems: "center",
}

const Loader = () => {
  return (
    <div style={loaderPage}>
    <GridLoader color="yellow"/>
      
    </div>
  );
};

export default Loader;
