import { Spin, Select, Cascader, message } from "antd";
import React, { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";
import SelectField from "./Components/SelectField";
import CGPA from "./Components/CGPA";
import UploadCert from "./Components/UploadCert";
import PrimaryBtn from "./Components/PrimaryBtn";
import SecondaryBtn from "./Components/SecondaryBtn";
import SoftwareEngineeringAssessment from "./Assessment Functions/SoftwareEngineering";
import ManagementMathematicsWithComputingAssessment from "./Assessment Functions/ManagementMath";
import SecurityAssessment from "./Assessment Functions/Security";
import { supabase} from "../../supabase-client";


let bahasaMelayuCredit = false;
let cgpaEnough = false;
let disablePrevQualificationSelectField = false;

let computingTrackA = false;
let computingTrackB = false;
let scienceTrackA = false;

let reqsForSPM = [];

const submitBtnDesign = {
  backgroundColor: "#1890ff",
  borderColor: "#1890ff",
  color: "#ffffff",
  borderRadius: "5px",
};

const Application = () => {
  const T = require("tesseract.js");

  const [qualification, setQualification] = useState("");
  const [previousQualification, setPreviousQualification] = useState(
    "Please select your previous qualification"
  );
  const [cert, setCert] = useState(null);
  const [prevCert, setPrevCert] = useState(null);
  const [fileName, setFileName] = useState("");
  const [assessmentResult, setAssessmentResult] = useState("");
  const [cgpa, setCgpa] = useState(0.0);

  const [programme, setProgramme] = useState("");

  //ui
  const [loading, setLoading] = useState(false);
  const [hideCgpa, setHideCgpa] = useState(true);
  const [message, setMessage] = useState("");
  const [
    disablePrevQualificationSelectField,
    setDisablePrevQualificationSelectField,
  ] = useState(false);
  const [hidePrevQualificationField, setHidePrevQualificationField] =
    useState(false);

  const handleQualificationChange = (value) => {
    setQualification(value);

    console.log("value: " + value);

    const isCgpaVisible =
    value &&
      [
        "Tunku Abdul Rahman University College (TARUMT),Diploma,Diploma in Information Systems",
        "Tunku Abdul Rahman University College (TARUMT),Diploma,Diploma in Information Technology",
        "Tunku Abdul Rahman University College (TARUMT),Diploma,Diploma in Software Engineering",
        "Tunku Abdul Rahman University College (TARUMT),Diploma,Diploma in Computer Science",
        "Other Institution of Higher Learning (IHL),IHL Diploma",
      ].includes(value);

    // Check if the selected qualification is "TARUMT xxx" and update the state accordingly
    if (
      value &&
      value.includes("Tunku Abdul Rahman University College (TARUMT)")
    ) {
      setDisablePrevQualificationSelectField(true);
      setPreviousQualification("SPM");

    } else {
      setDisablePrevQualificationSelectField(false);
    }

    console.log("isCgpaVisible: " + isCgpaVisible);

    
    if(isCgpaVisible){
      setHideCgpa(!isCgpaVisible);
    }
    else{
      setHideCgpa(isCgpaVisible);
    }

  };

  const handlePreviousQualificationChange = (value) => {
    setPreviousQualification(value);
  };

  const handleCgpaChange = (value) => {
    setCgpa(value);
  };

  const handleCertificateUpload = async (info) => {
    // 'info' contains information about the uploaded file
    if (info.fileList.length > 0) {
      const uploadedFile = info.fileList[0].originFileObj;
      setCert(uploadedFile);

      // Extract the file name
      setFileName(uploadedFile.name);
      setHidePrevQualificationField(true);
      console.log("Uploaded certificate file name: " + fileName);
    }

    return info.fileList; // Return the fileList to update the Form.Item
  };

  const handlePrevCertificateUpload = async (info) => {
    // 'info' contains information about the uploaded file
    if (info.fileList.length > 0) {
      const uploadedFile = info.fileList[0].originFileObj;
      setPrevCert(uploadedFile);

      // Extract the file name
      setFileName(uploadedFile.name);
      console.log("Uploaded previous certificate file name: " + fileName);
    }

    return info.fileList; // Return the fileList to update the Form.Item
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

    console.log("url: " + url);

    T.recognize(url).then(({ data: { text } }) => {
      console.log("text: " + text);

      if (previousQualification === "SPM") {
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

        console.log("Programme: " + programme);
        console.log("SUB: " + subjectsAndGrades);
        assessment(
          qualification.toString(),
          subjectsAndGrades,
          cgpa,
          previousQualification,
          programme
        );
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

        console.log("Programme: " + programme);
        console.log("SUB: " + subjectsAndGrades);
        assessment(
          qualification.toString(),
          subjectsAndGrades,
          cgpa,
          previousQualification,
          programme
        );
        setLoading(false);
      }
    });
  };

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
          label: "STPM",
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

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <div
        style={{
          width: "80%",
        }}
      >
        <SelectField
          label="Programme"
          name="programme"
          value={programme}
          onChange={handleProgrammeChange}
          options={programmeOptions}
        />
      </div>

      <Spin spinning={loading} tip="Assessing">
        <div
          style={{
            fontSize: "20px",
            textAlign: "center",
            margin: "50px 0 50px 0",
            fontFamily: "sans-serif",
          }}
        >
          <h3
            style={{
              marginBottom: "20px",
            }}
          >
            Choose your qualifcation
          </h3>
          <Cascader
            options={qualificationOptions}
            onChange={handleQualificationChange}
            placeholder="Please select your qualification"
            style={{
              width: "100%",
            }}
            allowClear={false}
          />
        </div>
        <div
          style={{
            fontSize: "20px",
            textAlign: "center",
            margin: "50px 0 50px 0",
            fontFamily: "sans-serif",
            display: hideCgpa ? "none" : "block",
          }}
        >
          <h3
            style={{
              marginBottom: "20px",
            }}
          >
            CGPA during your Diploma
          </h3>
          <CGPA value={cgpa} onChange={handleCgpaChange} />
        </div>
        {qualification !== "" && (
          <UploadCert
            name="cert"
            handleUpload={handleCertificateUpload}
            certName={`${getCertName(qualification)}`}
          />
        )}
        <div>
          <div
            style={{
              fontSize: "20px",
              textAlign: "center",
              margin: "50px 0 50px 0",
              fontFamily: "sans-serif",
            }}
          >
            <h3
              style={{
                marginBottom: "20px",
              }}
            >
              Choose your previous qualifcation
            </h3>
            <Select
              placeholder="Please select your previous qualification"
              onChange={handlePreviousQualificationChange}
              style={{
                width: "100%",
              }}
              disabled={
                disablePrevQualificationSelectField || qualification === ""
              }
              options={previousQualificationOptions}
              value={previousQualification}
            />
          </div>

          {cert !== null && (
            <UploadCert
              name="cert"
              handleUpload={handlePrevCertificateUpload}
              certName={getCertType(qualification, previousQualification)}
            />
          )}
        </div>

        <SecondaryBtn name="Back" onClick={() => {}} />
        <PrimaryBtn
          name="Submit"
          onClick={handleSubmit}
          style={submitBtnDesign}
        />
      </Spin>
    </div>
  );
};

function getCertType(qualification, previousQualification) {
  let qualifcationString = qualification.toString();
  const isTarumt =
    qualifcationString &&
    [
      "Tunku Abdul Rahman University College (TARUMT),Diploma,Diploma in Information Systems",
      "Tunku Abdul Rahman University College (TARUMT),Diploma,Diploma in Information Technology",
      "Tunku Abdul Rahman University College (TARUMT),Diploma,Diploma in Software Engineering",
      "Tunku Abdul Rahman University College (TARUMT),Diploma,Diploma in Computer Science",
      "Tunku Abdul Rahman University College (TARUMT),Foundation,Foundation In Computing Track A",
      "Tunku Abdul Rahman University College (TARUMT),Foundation,Foundation In Computing Track B",
      "Tunku Abdul Rahman University College (TARUMT),Foundation,Foundation In Science Track A",
    ].includes(qualifcationString);

  if (isTarumt || previousQualification === "SPM") {
    return "SPM Certificate";
  } else {
  }
  if (previousQualification === "O-Level") {
    return "O-Level Certificate";
  } else if (previousQualification === "UEC") {
    return "UEC Certificate";
  }
}

function assessment(
  qualification,
  previousQualificationSubjectsAndGrades,
  cgpa,
  previousQualification,
  programme
) {
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
    "Other Institution of Higher Learning (IHL),IHL Diploma",
  ];

  console.log("programme: " + programme);

  if (
    programme === "Bachelor of Science in Management Mathematics with Computing"
  ) {
    ManagementMathematicsWithComputingAssessment(
      qualification,
      cgpa,
      previousQualification,
      previousQualificationSubjectsAndGrades
    );
  } else if (
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
        } else {
          console.log(
            "You are eligible for this programme, but you are required to pass Bahasa Kebangsaan A before graduation"
          );
        }
      } else {
        console.log("You are not eligible for this programme");
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
        } else {
          console.log(
            "You are eligible for this programme, but you are required to pass Bahasa Kebangsaan A before graduation"
          );
        }
      } else {
        console.log("You are not eligible for this programme");
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
        } else {
          console.log(
            "You are eligible for this programme, but you are required to pass Bahasa Kebangsaan A before graduation"
          );
        }
      } else {
        console.log("You are not eligible for this programme");
      }
    } else {
      if (
        result.addMathCredit &&
        result.bahaseInggerisCredit &&
        result.cgpaEnough
      ) {
        if (result.bahasaMelayuCredit) {
          console.log("You are eligible for this programme");
        } else {
          console.log(
            "You are eligible for this programme, but you are required to pass Bahasa Kebangsaan A before graduation"
          );
        }
      } else {
        console.log("You are not eligible for this programme");
      }
    }
  } else {
    SecurityAssessment(
      qualification,
      cgpa,
      previousQualification,
      previousQualificationSubjectsAndGrades
    );
  }
}
export default Application;
