import React from "react";
import { Spin } from "antd";

const Loading = () => {
  return (
    <div
      style={{
        minHeight: "70vh",
        height: "100%",
        width: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Spin />
    </div>
  );
};

export default Loading;
