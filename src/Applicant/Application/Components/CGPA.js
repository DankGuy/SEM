import React from "react";
import { Form, InputNumber } from "antd";

function CGPA({ value, onChange }) {
  return (
    <Form.Item name={"CGPA"} required={true}>
      <InputNumber
        value={value}
        onChange={onChange}
        step={0.0001}
        min={0}
        max={4}
        placeholder={"0.0000"}
        maxLength={6}
      />
    </Form.Item>
  );
}

export default CGPA;
