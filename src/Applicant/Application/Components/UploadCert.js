import React from "react";
import { Form, Upload, Button } from "antd";
import { UploadOutlined } from "@ant-design/icons";

function UploadCert({ name, label, handleUpload, certName, disabled }) {
  return (
    <Form.Item
      name={name}
      label={label}
      valuePropName="fileList"
      getValueFromEvent={handleUpload}
      rules={[
        {
          required: true,
          message: "Please upload a certificate",
          validator: (_, fileList) => {
            return fileList && fileList.length > 0;
          },
        },
      ]}
    >
      <Upload

        name="file"
        beforeUpload={() => false}
        accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
        maxCount={1}
        multiple={false}
      >
        <Button       disabled={disabled} icon={<UploadOutlined />}>{`Upload ${certName}`}</Button>
      </Upload>
    </Form.Item>
  );
}

// where i can clear the file list
// <Upload
//   name="file"
//   beforeUpload={() => false}
//   accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
//   maxCount={1}
//   multiple={false}
//   onRemove={() => {
//     setCert(null);
    

export default UploadCert;
