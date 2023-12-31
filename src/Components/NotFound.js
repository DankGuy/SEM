import React from "react";
import { Result } from "antd";
const NotFound = () => (
  <div
    style={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      height: "100%",
    }}
  >
    <Result
      status="404"
      title="404"
      subTitle="Sorry, the page you visited does not exist."
    />
  </div>
);
export default NotFound;
