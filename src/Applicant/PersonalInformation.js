import React, { useEffect, useState } from "react";
import { Form, Input, Radio, Button, message, Select, Upload } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { findPostcode } from "malaysia-postcodes";
import { supabase } from "../supabase-client";
import Loading from "../Components/Loading";
import UploadCert from "./Application/Components/UploadCert";

const PersonalInformation = () => {
  const T = require("tesseract.js");
  const [form] = Form.useForm();
  const [addressInfo, setAddressInfo] = useState(null);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [trigger, setTrigger] = useState(0);

  const [certType, setCertType] = useState(null);
  const [fileName, setFileName] = useState("");
  const [cert, setCert] = useState(null);
  const [fileListSize, setFileListSize] = useState(0);
  const [isCheckingEligibility, setIsCheckingEligibility] = useState(false);
  const [disableUpload, setDisableUpload] = useState(false)

  const getAddressInfo = (e) => {
    const postcode = e.target.value;
    const addressInfo = findPostcode(postcode);
    setAddressInfo(addressInfo);

    // Set city and state fields when addressInfo changes
    if (addressInfo) {
      form.setFieldsValue({
        city: addressInfo.city || "",
        state: addressInfo.state || "",
      });
    }
  };

  const getUser = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (user) {
      let { data, error } = await supabase
        .from("applicant")
        .select("*")
        .eq("applicant_id", user.id);

      if (error) {
        console.log(error);
        return;
      }

      setUser(data[0]);
    }

    // check whether the user has already applied in the application table
    let { data: applicationData, error: applicationError } = await supabase
      .from("application")
      .select("*")
      .eq("applicant_id", user.id);

    if (applicationError) {
      console.log(applicationError);
      return;
    }

    if (applicationData.length !== 0) {
      setDisableUpload(true)
    }
    setIsLoading(false);
  };

  useEffect(() => {
    setUser(getUser());
  }, [trigger]);

  useEffect(() => {
    getUser();

  }, [trigger]);

  const checkEligibility = async (subjectsAndGrades) => {
    let bahasaMelayuPass = false;
    let bahaseInggerisPass = false;
    let bahasaInggerisCredit = false;
    let addMathCredit = false;
    let mathCredit = false;

    if (certType.toString() === "SPM") {
      subjectsAndGrades.forEach(({ subject, grade }) => {
        if (
          subject === "BAHASA MELAYU" &&
          (grade === "E" ||
            grade === "D" ||
            grade === "C" ||
            grade === "C+" ||
            grade === "B-" ||
            grade === "B" ||
            grade === "B+" ||
            grade === "A-" ||
            grade === "A" ||
            grade === "A+")
        ) {
          bahasaMelayuPass = true;
        }
        if (
          subject === "BAHASA INGGERIS" &&
          (grade === "C" ||
            grade === "C+" ||
            grade === "B-" ||
            grade === "B" ||
            grade === "B+" ||
            grade === "A-" ||
            grade === "A" ||
            grade === "A+")
        ) {
          bahasaInggerisCredit = true;
        } else if (
          subject === "BAHASA INGGERIS" &&
          (grade === "E" ||
            grade === "D" ||
            grade === "C" ||
            grade === "C+" ||
            grade === "B-" ||
            grade === "B" ||
            grade === "B+" ||
            grade === "A-" ||
            grade === "A" ||
            grade === "A+")
        ) {
          bahaseInggerisPass = true;
        }
        if (
          (subject === "MATEMATIK TAMBAHAN" ||
            subject === "ADDITIONAL MATHEMATICS") &&
          (grade === "C" ||
            grade === "C+" ||
            grade === "B-" ||
            grade === "B" ||
            grade === "B+" ||
            grade === "A-" ||
            grade === "A" ||
            grade === "A+")
        ) {
          addMathCredit = true;
        }
        if (
          (subject === "MATEMATIK" || subject === "MATHEMATICS") &&
          (grade === "C" ||
            grade === "C+" ||
            grade === "B-" ||
            grade === "B" ||
            grade === "B+" ||
            grade === "A-" ||
            grade === "A" ||
            grade === "A+")
        ) {
          mathCredit = true;
        }
      });
    } else if (certType.toString() === "O-Level") {
      subjectsAndGrades.forEach(({ subject, grade }) => {
        if (
          subject === "BAHASA MELAYU" &&
          (grade === "C" ||
            grade === "C+" ||
            grade === "B-" ||
            grade === "B" ||
            grade === "B+" ||
            grade === "A-" ||
            grade === "A" ||
            grade === "A+")
        ) {
          bahasaMelayuPass = true;
        }
        if (
          subject === "BAHASA INGGERIS" &&
          (grade === "C" ||
            grade === "C+" ||
            grade === "B-" ||
            grade === "B" ||
            grade === "B+" ||
            grade === "A-" ||
            grade === "A" ||
            grade === "A+")
        ) {
          bahasaInggerisCredit = true;
        } else if (
          subject === "BAHASA INGGERIS" &&
          (grade === "E" ||
            grade === "D" ||
            grade === "C" ||
            grade === "C+" ||
            grade === "B-" ||
            grade === "B" ||
            grade === "B+" ||
            grade === "A-" ||
            grade === "A" ||
            grade === "A+")
        ) {
          bahaseInggerisPass = true;
        }
        if (
          (subject === "MATEMATIK TAMBAHAN" ||
            subject === "ADDITIONAL MATHEMATICS") &&
          (grade === "C" ||
            grade === "C+" ||
            grade === "B-" ||
            grade === "B" ||
            grade === "B+" ||
            grade === "A-" ||
            grade === "A" ||
            grade === "A+")
        ) {
          addMathCredit = true;
        }
        if (
          (subject === "MATEMATIK" || subject === "MATHEMATICS") &&
          (grade === "C" ||
            grade === "C+" ||
            grade === "B-" ||
            grade === "B" ||
            grade === "B+" ||
            grade === "A-" ||
            grade === "A" ||
            grade === "A+")
        ) {
          mathCredit = true;
        }
      });
    } else if (certType.toString() === "UEC") {
      subjectsAndGrades.forEach(({ subject, grade }) => {
        if (
          subject === "BAHASA MELAYU" &&
          (grade === "C" ||
            grade === "C+" ||
            grade === "B-" ||
            grade === "B" ||
            grade === "B+" ||
            grade === "A-" ||
            grade === "A" ||
            grade === "A+")
        ) {
          bahasaMelayuPass = true;
        }
        if (
          subject === "BAHASA INGGERIS" &&
          (grade === "C" ||
            grade === "C+" ||
            grade === "B-" ||
            grade === "B" ||
            grade === "B+" ||
            grade === "A-" ||
            grade === "A" ||
            grade === "A+")
        ) {
          bahasaInggerisCredit = true;
        } else if (
          subject === "BAHASA INGGERIS" &&
          (grade === "E" ||
            grade === "D" ||
            grade === "C" ||
            grade === "C+" ||
            grade === "B-" ||
            grade === "B" ||
            grade === "B+" ||
            grade === "A-" ||
            grade === "A" ||
            grade === "A+")
        ) {
          bahaseInggerisPass = true;
        }
        if (
          (subject === "MATEMATIK TAMBAHAN" ||
            subject === "ADDITIONAL MATHEMATICS") &&
          (grade === "C" ||
            grade === "C+" ||
            grade === "B-" ||
            grade === "B" ||
            grade === "B+" ||
            grade === "A-" ||
            grade === "A" ||
            grade === "A+")
        ) {
          addMathCredit = true;
        }
        if (
          (subject === "MATEMATIK" || subject === "MATHEMATICS") &&
          (grade === "C" ||
            grade === "C+" ||
            grade === "B-" ||
            grade === "B" ||
            grade === "B+" ||
            grade === "A-" ||
            grade === "A" ||
            grade === "A+")
        ) {
          mathCredit = true;
        }
      });
    }

    // get programme from database
    let { data, error } = await supabase.from("programme").select("*");

    if (error) {
      console.log(error);
      return;
    }

    //create a json object to store programme data
    const eligibilityList = {};

    console.log("bahasaMelayuPass", bahasaMelayuPass);
    console.log("bahaseInggerisPass", bahaseInggerisPass);
    console.log("bahasaInggerisCredit", bahasaInggerisCredit);
    console.log("addMathCredit", addMathCredit);
    console.log("mathCredit", mathCredit);

    if (
      bahasaMelayuPass &&
      (bahaseInggerisPass || bahasaInggerisCredit) &&
      addMathCredit
    ) {
      eligibilityList[data[0].id] = true;
      eligibilityList[data[1].id] = true;
      eligibilityList[data[4].id] = true;
      eligibilityList[data[11].id] = true;
      eligibilityList[data[2].id] = false;
      eligibilityList[data[3].id] = false;
      eligibilityList[data[5].id] = false;
      eligibilityList[data[6].id] = false;
      eligibilityList[data[7].id] = false;
      eligibilityList[data[8].id] = false;
      eligibilityList[data[9].id] = false;
      eligibilityList[data[10].id] = false;
    } else if (
      bahasaMelayuPass &&
      (bahaseInggerisPass || bahasaInggerisCredit) &&
      mathCredit
    ) {
      eligibilityList[data[2].id] = true;
      eligibilityList[data[3].id] = true;
      eligibilityList[data[5].id] = true;
      eligibilityList[data[6].id] = true;
      eligibilityList[data[7].id] = true;
      eligibilityList[data[8].id] = true;
      eligibilityList[data[9].id] = true;
      eligibilityList[data[10].id] = true;
      eligibilityList[data[0].id] = false;
      eligibilityList[data[1].id] = false;
      eligibilityList[data[4].id] = false;
      eligibilityList[data[11].id] = false;
    }

    console.log("elibnilityList", eligibilityList);

    // update eligibility in database
    let { data: updateData, error: updateError } = await supabase
      .from("applicant")
      .update([
        {
          eligibilityList: eligibilityList,
        },
      ])
      .eq("applicant_id", user.applicant_id);

    if (updateError) {
      console.log(updateError);
      return;
    }

    console.log(data);
  };

  const onFinish = async (values) => {
    try {
      setIsLoading(true);
      setIsCheckingEligibility(true);

      let { data, error } = await supabase
        .from("applicant")
        .update([
          {
            name: values.name,
            mykad_no: values.mykadNo,
            gender: values.gender,
            phone_no: values.phone,
            address: values.address,
            postcode: values.postcode,
            city: values.city,
            state: values.state,
          },
        ])
        .eq("applicant_id", user.applicant_id);


      // Upload the certificate file
      await supabase.storage.from("Certificates").upload(fileName, cert, {
        cacheControl: "3600",
        upsert: false,
      });

      const { data: certData, error: certError } = supabase.storage
        .from("Certificates")
        .getPublicUrl(fileName);
      const url = certData.publicUrl;

      const subjectsAndGrades = [];

      T.recognize(url).then(({ data: { text } }) => {
        console.log("text: " + text);

        if (certType.toString() === "SPM") {
          const regex = /([A-Z\s,]+)\s([A-Z+-]+)\s\([^)]+\)/g;

          // Iterate through matches and extract subjects and grades
          let match;
          while ((match = regex.exec(text))) {
            const subject = match[1].trim();
            const grade = match[2].trim();
            subjectsAndGrades.push({ subject, grade });
          }
          subjectsAndGrades.forEach(({ subject, grade }) => {
            console.log(`Subject: ${subject}, Grade: ${grade}`);
          });
        } else if (certType.toString() === "O-Level") {
          const regex = /(ENGLISH|ADDITIONAL MATHEMATICS)\s+([A-Z]+)/g;

          // Iterate through matches and extract subjects and grades
          let match;
          while ((match = regex.exec(text))) {
            const subject = match[1].trim();
            const grade = match[2].trim();
            subjectsAndGrades.push({ subject, grade });
          }
          subjectsAndGrades.forEach(({ subject, grade }) => {
            console.log(`-----Subject: ${subject}, Grade: ${grade}`);
          });
        } else if (certType.toString() === "UEC") {
          const regex = /([A-Z\s,]+)\s([A-Z+-]+)\s\([^)]+\)/g;

          // Iterate through matches and extract subjects and grades
          let match;
          while ((match = regex.exec(text))) {
            const subject = match[1].trim();
            const grade = match[2].trim();
            subjectsAndGrades.push({ subject, grade });
          }
          subjectsAndGrades.forEach(({ subject, grade }) => {
            console.log(`-----Subject: ${subject}, Grade: ${grade}`);
          });
        }

        console.log("subjectsAndGrades", subjectsAndGrades);

        if (subjectsAndGrades.length === 0) {
          message.error(
            "No subjects and grades found from your certificate. Please try to upload your certificates in the highest quality."
          );
          setIsCheckingEligibility(false); // Set loading state to false
          setIsLoading(false)
          return;
        }

        checkEligibility(subjectsAndGrades).then(() => {
          message.success("Personal information updated!");
          setIsCheckingEligibility(false); // Set loading state to false
          setIsLoading(false)
          setTrigger(trigger + 1);
        });
      });

      if (error) {
        console.log("error" + error);
        setIsLoading(false);
        setIsCheckingEligibility(false); // Set loading state to false
        return;
      }
    } catch (err) {
      console.error("Error in onFinish:", err);
      setIsLoading(false);
      setIsCheckingEligibility(false); // Set loading state to false
    }
  };

  const certTypeOption = [
    { value: "SPM", label: "SPM" },
    { value: "O-Level", label: "O-Level" },
    { value: "UEC", label: "UEC" },
  ];

  const certTypeOnChange = (value) => {
    setCertType(value);
  };

  const handleCertificateUpload = (info) => {
    if (info.fileList.length === 0) {
      // No file selected, reset state
      setCert(null);
      setFileName("");
      setFileListSize(0);
      return [];
    }

    // Get the uploaded file
    const file = info.fileList[0].originFileObj;

    // Set the certificate file and file name in the state
    setCert(file);
    setFileName(file.name);
    setFileListSize(1);

    return [file];
  };

  return isLoading || isCheckingEligibility ? (
    <Loading />
  ) : (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Form
        style={{ width: "70%" }}
        layout="vertical"
        form={form}
        onFinish={onFinish}
        initialValues={{
          name: user?.name,
          mykadNo: user?.mykad_no,
          gender: user?.gender,
          phone: user?.phone_no,
          email: user?.email,
          address: user?.address,
          postcode: user?.postcode,
          city: user?.city,
          state: user?.state,
        }}
      >
        <div className="header">
          <h3>Personal Information</h3>
          <p>
            Please ensure that the information provided is correct as it will be
            used for your registration and certificate purposes.
          </p>
        </div>
        <div
          className="form-container"
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-around",
          }}
        >
          <div className="personal-info" style={{ width: "40%" }}>
            <Form.Item
              label="Name (as in MyKad)"
              name="name"
              rules={[
                {
                  required: true,
                  message: "Please input your name!",
                },
                {
                  validator(_, value) {
                    if (
                      (value ?? "").length === 0 ||
                      (value ?? "").match(/^[a-zA-Z\s]*$/)
                    ) {
                      return Promise.resolve();
                    }
                    return Promise.reject(new Error("The name is invalid!"));
                  },
                },
              ]}
            >
              <Input placeholder="Name" />
            </Form.Item>
            <Form.Item
              label="MyKad No."
              name="mykadNo"
              rules={[
                {
                  required: true,
                  message: "Please input your MyKad number!",
                },
                {
                  validator(_, value) {
                    if (
                      (value ?? "").length === 0 ||
                      (value ?? "").match(/^[0-9]{6}-[0-9]{2}-[0-9]{4}$/)
                    ) {
                      return Promise.resolve();
                    }
                    return Promise.reject(
                      new Error("The MyKad number is invalid!")
                    );
                  },
                },
              ]}
            >
              <Input placeholder="999999-99-9999" />
            </Form.Item>
            <Form.Item
              label="Gender"
              name="gender"
              initialValue={user?.gender ? user.gender : "Male"}
            >
              <Radio.Group>
                <Radio.Button value="Male">Male</Radio.Button>
                <Radio.Button value="Female">Female</Radio.Button>
              </Radio.Group>
            </Form.Item>
            <Form.Item
              label="Phone Number"
              name="phone"
              rules={[
                {
                  required: true,
                  message: "Please input your phone number!",
                },
                {
                  validator(_, value) {
                    if (
                      (value ?? "").length === 0 ||
                      (((value ?? "").length === 10 ||
                        (value ?? "").length === 11) &&
                        (value ?? "").match(/^[0-9]+$/))
                    ) {
                      return Promise.resolve();
                    }
                    return Promise.reject(
                      new Error("The phone number is invalid!")
                    );
                  },
                },
              ]}
            >
              <Input placeholder="Phone Number" />
            </Form.Item>
            <Form.Item label="Email" name="email">
              <Input placeholder="Email" disabled />
            </Form.Item>
          </div>
          <div className="address-info" style={{ width: "40%" }}>
            <Form.Item
              label="Address"
              name="address"
              rules={[
                {
                  required: true,
                  message: "Please input your address!",
                },
              ]}
            >
              <Input placeholder="Address" />
            </Form.Item>
            <Form.Item
              label="Postcode"
              name="postcode"
              rules={[
                {
                  required: true,
                  message: "Please input your postcode!",
                },
                {
                  validator(_, value) {
                    if (
                      (value ?? "").length === 0 ||
                      ((value ?? "").match(/^[0-9]{5}$/) &&
                        findPostcode(value ?? "").found === true)
                    ) {
                      return Promise.resolve();
                    }
                    return Promise.reject(
                      new Error("The postcode is invalid!")
                    );
                  },
                },
              ]}
            >
              <Input placeholder="Postcode" onChange={getAddressInfo} />
            </Form.Item>
            <Form.Item label="City" name="city">
              <Input placeholder="City" disabled />
            </Form.Item>
            <Form.Item label="State" name="state">
              <Input placeholder="State" disabled />
            </Form.Item>
            <div
              style={{
                display: "flex",
              }}
            >
              <Form.Item
                label="Certificate Type"
                name="certType"
                rules={[
                  {
                    required: true,
                    message: "Please select a certificate type!",
                  },
                ]}
              >
                <Select
                disabled={disableUpload}
                  placeholder="Select a certificate type"
                  options={certTypeOption}
                  onChange={certTypeOnChange}
                />
              </Form.Item>
              <Form.Item
                name="upload_cert"
                label=" "
                valuePropName="fileList"
                getValueFromEvent={handleCertificateUpload}
                rules={[
                  {
                    required: true,
                    message: "Please upload a certificate",
                    // validator: (_, fileList) => {
                    //   return fileList && fileList.length > 0;
                    // },
                  },
                ]}
              >
                <Upload
                  disabled={disableUpload}
                  name="file"
                  beforeUpload={() => false}
                  accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                  maxCount={1}
                  multiple={false}
                >
                  <Button
                    disabled={certType === null}
                    icon={<UploadOutlined />}
                  >
                    {`Upload `}
                  </Button>
                </Upload>
              </Form.Item>
            </div>
          </div>
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "flex-end",
            marginTop: "1rem",
          }}
        >
          <Form.Item>
            <Button
              htmlType="reset"
              style={{
                fontSize: "1rem",
                height: "auto",
                marginRight: "1rem",
              }}
            >
              Undo Changes
            </Button>
          </Form.Item>
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              style={{
                fontSize: "1rem",
                height: "auto",
                marginRight: "2.75rem",
              }}
            >
              Update
            </Button>
          </Form.Item>
        </div>
      </Form>
    </div>
  );
};

export default PersonalInformation;
