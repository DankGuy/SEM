import { Spin, Select, Cascader, Button, message, Result } from "antd";
import React, { useState, useEffect } from "react";
import SelectField from "./Components/SelectField";
import CGPA from "./Components/CGPA";
import UploadCert from "./Components/UploadCert";
import SoftwareEngineeringAssessment from "./Assessment Functions/SoftwareEngineering";
import ManagementMathematicsWithComputingAssessment from "./Assessment Functions/ManagementMath";
import EnterprisingAssessment from "./Assessment Functions/Enterprise";
import { supabase } from "../../supabase-client";

let computingTrackA = false;
let computingTrackB = false;
let scienceTrackA = false;

let applyResultMsg = null;

let loggedUser = null;

const Application = () => {
  const T = require("tesseract.js");
  const [user, setUser] = useState(null);
  // UI
  const [loading, setLoading] = useState(false);
  const [hideCgpa, setHideCgpa] = useState(true);
  const [messageApi, contextHolder] = message.useMessage();

  // Attributes
  const [qualification, setQualification] = useState("");
  const [previousQualification, setPreviousQualification] = useState("");
  const [cert, setCert] = useState(null);
  const [prevCert, setPrevCert] = useState(null);
  const [fileName, setFileName] = useState("");
  const [fileListSize, setFileListSize] = useState(0);
  const [prevFileListSize, setPrevFileListSize] = useState(0);
  const [cgpa, setCgpa] = useState(0.0);
  const [isCgpaEntered, setIsCgpaEntered] = useState(false);
  const [programme, setProgramme] = useState("");

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
  };

  useEffect(() => {
    setUser(getUser());
    loggedUser = getUser();
  }, []);

  useEffect(() => {
    console.log("userLogged: " + user);
  }, [user]);

  // Options
  const qualificationOptions = [
    {
      label: "Tunku Abdul Rahman University College (TARUMT)",
      value: "Tunku Abdul Rahman University College (TARUMT)",
      children: [
        {
          label: "Foundation",
          value: "Foundation",
          children: [
            {
              disabled: !computingTrackA,
              label: "Foundation In Computing Track A",
              value: "Foundation In Computing Track A",
            },
            {
              disabled: !computingTrackB,
              label: "Foundation In Computing Track B",
              value: "Foundation In Computing Track B",
            },
            {
              disabled: !scienceTrackA,
              label: "Foundation In Science Track A",
              value: "Foundation In Science Track A",
            },
          ],
        },
        {
          label: "Diploma",
          value: "Diploma",
          children: [
            {
              label: "Diploma in Computer Science",
              value: "Diploma in Computer Science",
            },
            {
              label: "Diploma in Information Systems",
              value: "Diploma in Information Systems",
            },
            {
              label: "Diploma in Information Technology",
              value: "Diploma in Information Technology",
            },
            {
              label: "Diploma in Software Engineering",
              value: "Diploma in Software Engineering",
            },
          ],
        },
      ],
    },
    {
      label: "Pre-University",
      value: "Pre-University",
      children: [
        {
          label: "STPM (Relavant)",
          value: "STPM",
        },
        {
          label: "A-Level",
          value: "A-Level",
        },
        {
          label: "UEC",
          value: "UEC",
        },
      ],
    },
    {
      label: "Other Institution of Higher Learning (IHL)",
      value: "Other Institution of Higher Learning (IHL)",
      children: [
        {
          label: "IHL Foundation",
          value: "IHL Foundation",
        },
        {
          label: "IHL Diploma",
          value: "IHL Diploma",
        },
      ],
    },
  ];

  const previousQualificationOptions = [
    {
      label: "SPM",
      value: "SPM",
    },
    {
      label: "O-Level",
      value: "O-Level",
    },
    {
      label: "UEC",
      value: "UEC",
    },
  ];

  const programmeOptions = [
    {
      label: "Bachelor of Science in Management Mathematics with Computing",
      value: "Bachelor of Science in Management Mathematics with Computing",
    },
    {
      label: "Bachelor of Computer Science in Interactive Software Technology",
      value: "Bachelor of Computer Science in Interactive Software Technology",
    },
    {
      label: "Bachelor of Computer Science in Data Science",
      value: "Bachelor of Computer Science in Data Science",
    },
    {
      label:
        "Bachelor of Information Systems in Enterprise Information Systems",
      value:
        "Bachelor of Information Systems in Enterprise Information Systems",
    },
    {
      label: "Bachelor of Information Technology in Information Security",
      value: "Bachelor of Information Technology in Information Security",
    },
    {
      label: "Bachelor of Information Technology in Internet Technology",
      value: "Bachelor of Information Technology in Internet Technology",
    },
    {
      label:
        "Bachelor of Information Technology in Software Systems Development",
      value:
        "Bachelor of Information Technology in Software Systems Development",
    },
    {
      label: "Bachelor of Software Engineering",
      value: "Bachelor of Software Engineering",
    },
  ];

  const handleProgrammeChange = (value) => {
    setProgramme(value);
    if (
      value === "Bachelor of Science in Management Mathematics with Computing"
    ) {
      computingTrackA = false;
      computingTrackB = false;
      scienceTrackA = true;
    } else if (
      value === "Bachelor of Computer Science in Data Science" ||
      value === "Bachelor of Software Engineering" ||
      value ===
        "Bachelor of Computer Science in Interactive Software Technology"
    ) {
      computingTrackA = true;
      computingTrackB = false;
      scienceTrackA = false;
    } else {
      computingTrackA = false;
      computingTrackB = true;
      scienceTrackA = false;
    }
  };

  const isDiploma = (qualification) => {
    if (qualification.toString().includes("Diploma")) {
      return true;
    } else {
      return false;
    }
  };

  const handleQualificationChange = (value) => {
    setQualification(value);

    if (isDiploma(value)) {
      setHideCgpa(false);
    } else {
      setHideCgpa(true);
    }
  };

  const handleCertificateUpload = async (info) => {
    // 'info' contains information about the uploaded file
    if (info.fileList.length > 0) {
      setFileListSize(info.fileList.length);
      const uploadedFile = info.fileList[0].originFileObj;
      setCert(uploadedFile);

      // Extract the file name
      setFileName(uploadedFile.name);
      console.log("Uploaded certificate file name: " + fileName);

      if (qualification.includes("Tunku Abdul Rahman University College (TARUMT)")) {
        setPreviousQualification("SPM");
      } else if (qualification.includes("UEC")) {
        setPreviousQualification("UEC");
      }

    } else {
      // If no files are uploaded, hide the previous qualification select
      setFileListSize(0);
      setPreviousQualification(""); // Clear previous qualification value
    }

    return info.fileList; // Return the fileList to update the Form.Item
  };

  const handlePrevCertificateUpload = async (info) => {
    // 'info' contains information about the uploaded file
    if (info.fileList.length > 0) {
      setPrevFileListSize(info.fileList.length);
      const uploadedFile = info.fileList[0].originFileObj;
      setPrevCert(uploadedFile);

      // Extract the file name
      setFileName(uploadedFile.name);
      console.log("Uploaded previous certificate file name: " + fileName);
    }
    else {
      // If no files are uploaded, hide the previous qualification select
      setPrevFileListSize(0);
    }

    return info.fileList; // Return the fileList to update the Form.Item
  };

  const getCertName = (qualification) => {
    if (qualification.includes("Foundation")) {
      return "Foundation Certificate";
    } else if (qualification.includes("Diploma")) {
      return "Diploma Certificate";
    } else if (qualification.includes("STPM")) {
      return "STPM Certificate";
    } else if (qualification.includes("A-Level")) {
      return "A-Level Certificate";
    } else if (qualification.includes("UEC")) {
      return "UEC Certificate";
    } else if (qualification.includes("IHL Foundation")) {
      return "Foundation Certificate";
    } else if (qualification.includes("IHL Diploma")) {
      return "Diploma Certificate";
    }
  };

  const getPrevCertName = (prevQualification) => {
    if (prevQualification.includes("SPM")) {
      return "SPM Certificate";
    }
    else if (prevQualification.includes("O-Level")) {
      return "O-Level Certificate";
    }
    else if (prevQualification.includes("UEC")) {
      return "UEC Certificate";
    }
  };

  const handlePreviousQualificationChange = (value) => {
    setPreviousQualification(value);
  };

  const handleCgpaChange = (value) => {
    setCgpa(value);
    setIsCgpaEntered(value > 0);
  };

  const reset = () => {
    setQualification("");
    setPreviousQualification("");
    setCert(null);
    setPrevCert(null);
    setFileName("");
    setFileListSize(0);
    setPrevFileListSize(0);
    setCgpa(0.0);
    setIsCgpaEntered(false);
    setProgramme("");
  };

  const sendMessage = (msg) => {
    messageApi.open({
      type: 'error',
      content: msg,
      duration: 5,
    });
  };

  const handleSubmit = async () => {

    setLoading(true);

    await supabase.storage.from("Certificates").upload(fileName, prevCert, {
      cacheControl: "3600",
      upsert: false,
    });
    const { data, error } = supabase.storage
      .from("Certificates")
      .getPublicUrl(fileName);
    const url = data.publicUrl;

    T.recognize(url).then(({ data: { text } }) => {
      console.log("text: " + text);

      if (previousQualification.includes("SPM")) {
        const regex = /([A-Z\s,]+)\s([A-Z+-]+)\s\([^)]+\)/g;
        const subjectsAndGrades = [];

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

        if(subjectsAndGrades.length === 0) {
          sendMessage("No subjects found from your certificate. Please try to upload your certificates in the highest quality.");
        }else{
          assessment(
            qualification.toString(),
            subjectsAndGrades,
            cgpa,
            previousQualification,
            programme
          );
        }

        setLoading(false);

      } else if (previousQualification === "O-Level") { //only can scan add maths
        const regex = /(ENGLISH|ADDITIONAL MATHEMATICS)\s+([A-Z]+)/g
        const subjectsAndGrades = [];


        
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


        if(subjectsAndGrades.length === 0) {
          sendMessage("No subjects found from your certificate. Please try to upload your certificates in the highest quality.");
        }else{
          assessment(
            qualification.toString(),
            subjectsAndGrades,
            cgpa,
            previousQualification,
            programme
          );
        }

        setLoading(false);
      }
      else if (previousQualification === "UEC") {
        const regex = /([A-Z\s,]+)\s([A-Z+-]+)\s\([^)]+\)/g;
        const subjectsAndGrades = [];

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

        if(subjectsAndGrades.length === 0) {
          sendMessage("No subjects found from your certificate. Please try to upload your certificates in the highest quality.");
        }else{
          assessment(
            qualification.toString(),
            subjectsAndGrades,
            cgpa,
            previousQualification,
            programme
          );
        }

        setLoading(false);
      }
    });
  };

  return (
    <>
      <div>
        <Result
          style={{
            display: applyResultMsg === null ? "none" : "block",
          }}
          status="success"
          title="Successfully Applied"
          subTitle={applyResultMsg + ". \nYou are required to bring along with your original certificates for verification purpose."} 
          extra={[
            <Button type="primary">

            </Button>
          ]}
        />
        <div
          style={{

          }}
        >
          <Spin spinning={loading} tip="Assessing">
            {contextHolder}
            <message message={message} />
            <div>
              <h3>Choose your desired programme</h3>
              <Select
                placeholder="Please select yor desired programme"
                onChange={handleProgrammeChange}
                options={programmeOptions}
                value={programme}
                style={{
                  width: "100%",
                }}
              />
            </div>
            {programme !== "" && (
              <div>
                <h3>Choose your qualifcation</h3>
                <Cascader
                  options={qualificationOptions}
                  onChange={handleQualificationChange}
                  placeholder="Please select your qualification"
                  allowClear={false}
                />
              </div>
            )}
            {programme !== "" && !hideCgpa && (
              <div>
                <h3>Enter your CGPA</h3>
                <CGPA value={cgpa} onChange={handleCgpaChange} />
              </div>
            )}
            {((programme !== "" && qualification !== "" && isCgpaEntered) ||
              (programme !== "" && qualification !== "" && hideCgpa)) && (
              <div>
                <h3>Upload your {`${getCertName(qualification)}`}</h3>
                <UploadCert
                  name="cert"
                  handleUpload={handleCertificateUpload}
                  certName={"Certificate"}
                />
              </div>
            )}
            {((programme !== "" && qualification !== "" && isCgpaEntered) ||
              (programme !== "" && qualification !== "" && hideCgpa)) &&
              fileListSize > 0 && (
                <div>
                  <h3>Choose your previous qualifcation</h3>
                  <Select
                    placeholder="Please select your previous qualification"
                    onChange={handlePreviousQualificationChange}
                    options={previousQualificationOptions}
                    value={previousQualification}
                    disabled={
                      qualification.includes(
                        "Tunku Abdul Rahman University College (TARUMT)"
                      ) || qualification.includes("UEC")
                    }
                    style={{
                      width: "100%",
                    }}
                  />
                </div>
              )}
            {((programme !== "" && qualification !== "" && isCgpaEntered) ||
              (programme !== "" && qualification !== "" && hideCgpa)) &&
              previousQualification !== "" && (
                <div>
                  <h3>
                    Upload your {`${getPrevCertName(previousQualification)}`}
                  </h3>
                  <UploadCert
                    name="cert"
                    handleUpload={handlePrevCertificateUpload}
                    certName={"Certificate"}
                  />
                </div>
              )}
            <Button
              type="secondary"
              htmlType="reset"
              style={{
                fontSize: "1rem",
                height: "auto",
                marginRight: "2.75rem",
              }}
              onClick={reset}
            >
              Reset
            </Button>
            <Button
              type="primary"
              htmlType="submit"
              style={{
                fontSize: "1rem",
                height: "auto",
                marginRight: "2.75rem",
              }}
              disabled={
                (programme !== "" &&
                  qualification !== "" &&
                  isCgpaEntered &&
                  previousQualification !== "" &&
                  prevFileListSize > 0) ||
                (programme !== "" &&
                  qualification !== "" &&
                  hideCgpa &&
                  previousQualification !== "" &&
                  prevFileListSize > 0)
                  ? false
                  : true
              }
              onClick={handleSubmit}
            >
              Submit
            </Button>
          </Spin>
        </div>
      </div>
    </>
  );
};

function assessment(
  qualification,
  previousQualificationSubjectsAndGrades,
  cgpa,
  previousQualification,
  programme
) {
  const updateResult = () => {
    console.log("user" + loggedUser.applicant_id);
    const { error } = supabase
    .from('applicant')
    .update({ isApplied: 'TRUE' })
    .eq('applicant_id', loggedUser.applicant_id)
    if (error) {
      console.log(error)
      return
    }
    console.log("Successfully updated")
  }

  
  const qualifcationList = [
    "Tunku Abdul Rahman University College (TARUMT),Foundation,Foundation In Computing Track A",
    "Tunku Abdul Rahman University College (TARUMT),Foundation,Foundation In Computing Track B",
    "Tunku Abdul Rahman University College (TARUMT),Foundation,Foundation In Science Track A",
    "Tunku Abdul Rahman University College (TARUMT),Diploma,Diploma in Computer Science",
    "Tunku Abdul Rahman University College (TARUMT),Diploma,Diploma in Information Systems",
    "Tunku Abdul Rahman University College (TARUMT),Diploma,Diploma in Information Technology",
    "Tunku Abdul Rahman University College (TARUMT),Diploma,Diploma in Software Engineering",
    "Pre-University,STPM",
    "Pre-University,A-Level",
    "Pre-University,UEC",
    "Other Institution of Higher Learning (IHL),IHL Foundation",
    "Other Institution of Higher Learning (IHL),IHL Diploma"
  ];

  console.log("programme: " + programme);

  if (
    programme === "Bachelor of Science in Management Mathematics with Computing"
  ) {
    // Management Mathematics with Computing
    console.log("programme is " + programme);
    console.log("qualification is " + qualification);
    console.log("qualification is " + qualifcationList[0]);
    const result = ManagementMathematicsWithComputingAssessment(
      qualification,
      cgpa,
      previousQualification,
      previousQualificationSubjectsAndGrades
    );
    if (
      qualification === qualifcationList[0] ||
      qualification === qualifcationList[1] ||
      qualification === qualifcationList[2]
    ) {
      if (
        result.mathCredit === null &&
        result.bahaseInggerisCredit === null &&
        result.cgpaEnough === null
      ) {
        if (result.bahasaMelayuCredit) {
          console.log("You are eligible for this programme");
          applyResultMsg = "You are eligible for this programme";
        } else {
          console.log(
            "You are eligible for this programme, but you are required to pass Bahasa Kebangsaan A before graduation"
          );
          applyResultMsg = "You are eligible for this programme, but you are required to pass Bahasa Kebangsaan A before graduation";
        }
        updateResult();
      } else {
        console.log("You are not eligible for this programme");
        applyResultMsg = "You are not eligible for this programme";
      }
    } else if (
      qualification === qualifcationList[3] ||
      qualification === qualifcationList[4] ||
      qualification === qualifcationList[5] ||
      qualification === qualifcationList[6]
    ) {
      if (
        result.mathCredit === null &&
        result.bahaseInggerisCredit === null &&
        result.cgpaEnough
      ) {
        if (result.bahasaMelayuCredit) {
          console.log("You are eligible for this programme");
          applyResultMsg = "You are eligible for this programme";
        } else {
          console.log(
            "You are eligible for this programme, but you are required to pass Bahasa Kebangsaan A before graduation"
          );
          applyResultMsg = "You are eligible for this programme, but you are required to pass Bahasa Kebangsaan A before graduation";
        }
        updateResult();
      } else {
        console.log("You are not eligible for this programme");
        applyResultMsg = "You are not eligible for this programme";
      }
    } else if (
      qualification === qualifcationList[7] ||
      qualification === qualifcationList[8] ||
      qualification === qualifcationList[9] ||
      qualification === qualifcationList[10]
    ) {
      if (
        result.mathCredit &&
        result.bahaseInggerisCredit &&
        result.cgpaEnough === null
      ) {
        if (result.bahasaMelayuCredit) {
          console.log("You are eligible for this programme");
          applyResultMsg = "You are eligible for this programme";
        } else {
          console.log(
            "You are eligible for this programme, but you are required to pass Bahasa Kebangsaan A before graduation"
          );
          applyResultMsg = "You are eligible for this programme, but you are required to pass Bahasa Kebangsaan A before graduation";
        }
        updateResult();
      } else {
        console.log("You are not eligible for this programme");
        applyResultMsg = "You are not eligible for this programme";
      }
    } else {
      if (
        result.mathCredit &&
        result.bahaseInggerisCredit &&
        result.cgpaEnough
      ) {
        if (result.bahasaMelayuCredit) {
          console.log("You are eligible for this programme");
          applyResultMsg = "You are eligible for this programme";
        } else {
          console.log(
            "You are eligible for this programme, but you are required to pass Bahasa Kebangsaan A before graduation"
          );
          applyResultMsg = "You are eligible for this programme, but you are required to pass Bahasa Kebangsaan A before graduation";
        }
        updateResult();
      } else {
        console.log("You are not eligible for this programme");
        applyResultMsg = "You are not eligible for this programme";
      }
    }
  } else if (
    // Software Engineering
    programme === "Bachelor of Computer Science in Data Science" ||
    programme === "Bachelor of Software Engineering" ||
    programme ===
      "Bachelor of Computer Science in Interactive Software Technology"
  ) {
    console.log("programme is " + programme);
    console.log("qualification is " + qualification);
    console.log("qualification is " + qualifcationList[0]);
    const result = SoftwareEngineeringAssessment(
      qualification,
      cgpa,
      previousQualification,
      previousQualificationSubjectsAndGrades
    );
    if (
      qualification === qualifcationList[0] ||
      qualification === qualifcationList[1] ||
      qualification === qualifcationList[2]
    ) {
      if (
        result.addMathCredit === null &&
        result.bahaseInggerisCredit === null &&
        result.cgpaEnough === null
      ) {
        if (result.bahasaMelayuCredit) {
          console.log("You are eligible for this programme");
          applyResultMsg = "You are eligible for this programme";
        } else {
          console.log(
            "You are eligible for this programme, but you are required to pass Bahasa Kebangsaan A before graduation"
          );
          applyResultMsg = "You are eligible for this programme, but you are required to pass Bahasa Kebangsaan A before graduation";
        }
        updateResult();
      } else {
        console.log("You are not eligible for this programme");
        applyResultMsg = "You are not eligible for this programme";
      }
    } else if (
      qualification === qualifcationList[3] ||
      qualification === qualifcationList[4] ||
      qualification === qualifcationList[5] ||
      qualification === qualifcationList[6]
    ) {
      if (
        result.addMathCredit === null &&
        result.bahaseInggerisCredit === null &&
        result.cgpaEnough
      ) {
        if (result.bahasaMelayuCredit) {
          console.log("You are eligible for this programme");
          applyResultMsg = "You are eligible for this programme";
        } else {
          console.log(
            "You are eligible for this programme, but you are required to pass Bahasa Kebangsaan A before graduation"
          );
          applyResultMsg = "You are eligible for this programme, but you are required to pass Bahasa Kebangsaan A before graduation";
        }
        updateResult();
      } else {
        console.log("You are not eligible for this programme");
        applyResultMsg = "You are not eligible for this programme";
      }
    } else if (
      qualification === qualifcationList[7] ||
      qualification === qualifcationList[8] ||
      qualification === qualifcationList[9] ||
      qualification === qualifcationList[10]
    ) {
      if (
        result.addMathCredit &&
        result.bahaseInggerisCredit &&
        result.cgpaEnough === null
      ) {
        if (result.bahasaMelayuCredit) {
          console.log("You are eligible for this programme");
          applyResultMsg = "You are eligible for this programme";
        } else {
          console.log(
            "You are eligible for this programme, but you are required to pass Bahasa Kebangsaan A before graduation"
          );
          applyResultMsg = "You are eligible for this programme, but you are required to pass Bahasa Kebangsaan A before graduation";
        }
        updateResult();
      } else {
        console.log("You are not eligible for this programme");
        applyResultMsg = "You are not eligible for this programme";
      }
    } else {
      if (
        result.addMathCredit &&
        result.bahaseInggerisCredit &&
        result.cgpaEnough
      ) {
        if (result.bahasaMelayuCredit) {
          console.log("You are eligible for this programme");
          applyResultMsg = "You are eligible for this programme";
        } else {
          console.log(
            "You are eligible for this programme, but you are required to pass Bahasa Kebangsaan A before graduation"
          );
          applyResultMsg = "You are eligible for this programme, but you are required to pass Bahasa Kebangsaan A before graduation";
        }
        updateResult();
      } else {
        console.log("You are not eligible for this programme");
        applyResultMsg = "You are not eligible for this programme";
      }
    }
  } else {
    // Enterprise
    console.log("programme is " + programme);
    console.log("qualification is " + qualification);
    console.log("qualification is " + qualifcationList[0]);
    const result = EnterprisingAssessment(
      qualification,
      cgpa,
      previousQualification,
      previousQualificationSubjectsAndGrades
    );
    if (
      qualification === qualifcationList[0] ||
      qualification === qualifcationList[1] ||
      qualification === qualifcationList[2]
    ) {
      if (
        result.mathCredit === null &&
        result.bahaseInggerisCredit === null &&
        result.cgpaEnough === null
      ) {
        if (result.bahasaMelayuCredit) {
          console.log("You are eligible for this programme");
          applyResultMsg = "You are eligible for this programme";
        } else {
          console.log(
            "You are eligible for this programme, but you are required to pass Bahasa Kebangsaan A before graduation"
          );
          applyResultMsg = "You are eligible for this programme, but you are required to pass Bahasa Kebangsaan A before graduation";
        }
        updateResult();
      } else {
        console.log("You are not eligible for this programme");
        applyResultMsg = "You are not eligible for this programme";
      }
    } else if (
      qualification === qualifcationList[3] ||
      qualification === qualifcationList[4] ||
      qualification === qualifcationList[5] ||
      qualification === qualifcationList[6]
    ) {
      if (
        result.mathCredit === null &&
        result.bahaseInggerisCredit === null &&
        result.cgpaEnough
      ) {
        if (result.bahasaMelayuCredit) {
          console.log("You are eligible for this programme");
          applyResultMsg = "You are eligible for this programme";
        } else {
          console.log(
            "You are eligible for this programme, but you are required to pass Bahasa Kebangsaan A before graduation"
          );
          applyResultMsg = "You are eligible for this programme, but you are required to pass Bahasa Kebangsaan A before graduation";
        }
        updateResult();
      } else {
        console.log("You are not eligible for this programme");
        applyResultMsg = "You are not eligible for this programme";
      }
    } else if (
      qualification === qualifcationList[7] ||
      qualification === qualifcationList[8] ||
      qualification === qualifcationList[9] ||
      qualification === qualifcationList[10]
    ) {
      if (
        result.mathCredit &&
        result.bahaseInggerisCredit &&
        result.cgpaEnough === null
      ) {
        if (result.bahasaMelayuCredit) {
          console.log("You are eligible for this programme");
          applyResultMsg = "You are eligible for this programme";
        } else {
          console.log(
            "You are eligible for this programme, but you are required to pass Bahasa Kebangsaan A before graduation"
          );
          applyResultMsg = "You are eligible for this programme, but you are required to pass Bahasa Kebangsaan A before graduation";
        }
        updateResult();
      } else {
        console.log("You are not eligible for this programme");
        applyResultMsg = "You are not eligible for this programme";
      }
    } else {
      if (
        result.mathCredit &&
        result.bahaseInggerisCredit &&
        result.cgpaEnough
      ) {
        if (result.bahasaMelayuCredit) {
          console.log("You are eligible for this programme");
          applyResultMsg = "You are eligible for this programme";
        } else {
          console.log(
            "You are eligible for this programme, but you are required to pass Bahasa Kebangsaan A before graduation"
          );
          applyResultMsg = "You are eligible for this programme, but you are required to pass Bahasa Kebangsaan A before graduation";
        }
        updateResult();
      } else {
        console.log("You are not eligible for this programme");
        applyResultMsg = "You are not eligible for this programme";
      }
    }
  }
}

export default Application;
