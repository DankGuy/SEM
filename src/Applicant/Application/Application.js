import { Spin, Select, Cascader, Button, message, Result } from "antd";
import React, { useState, useEffect } from "react";
import CGPA from "./Components/CGPA";
import UploadCert from "./Components/UploadCert";
import SoftwareEngineeringAssessment from "./Assessment Functions/SoftwareEngineering";
import ManagementMathematicsWithComputingAssessment from "./Assessment Functions/ManagementMath";
import EnterprisingAssessment from "./Assessment Functions/Enterprise";
import DiplomaComputerScienceAssessment from "./Assessment Functions/DiplomaComputerScience";
import DiplomaSoftwareEngineeringAssessment from "./Assessment Functions/DiplomaSoftwareEngineering";
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
  const [isApplied, setIsApplied] = useState(false);
  const [trigger, setTrigger] = useState(0);
  const [programmeOptions, setProgrammeOptions] = useState([]);
  const [successfullyMessage, setSuccessfullyMessage] = useState("");

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
  }, []);

  useEffect(() => {
    loggedUser = user;
    getProgrammeOptions();
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

  const qualificationOptionsForDiploma = [
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

  const getProgrammeOptions = async () => {
    try {
      console.log("applicationData", user.eligibilityList);

      let eligibilityList = user.eligibilityList;

      for (const key in eligibilityList) {
        if (eligibilityList.hasOwnProperty(key)) {
          console.log(`${key}: ${eligibilityList[key]}`);
        }
      }

      const trueKeys = Object.keys(eligibilityList).filter(
        (key) => eligibilityList[key] === true
      );

      console.log("trueKeys", trueKeys);

      // use those keys (id) to get programme name from programme table
      const { data, error } = await supabase
        .from("programme")
        .select("programme_name")
        .in("id", trueKeys);

      console.log("data", data);

      if (error) {
        console.log(error);
        return;
      }

      // use the data to set programme options
      const options = data.map((programme) => {
        return {
          label: programme.programme_name,
          value: programme.programme_name,
        };
      });

      setProgrammeOptions(options);
    } catch (error) {
      console.error("Error fetching program options:", error.message);

      // If there is an error, get the programme options from the database
      const { data, error: getError } = await supabase
        .from("programme")
        .select("programme_name");

      if (getError) {
        console.log(getError);
        return;
      }

      // use the data to set programme options
      const options = data.map((programme) => {
        return {
          label: programme.programme_name,
          value: programme.programme_name,
        };
      });

      setProgrammeOptions(options);
    }
  };

  useEffect(() => {
    // Fetch program options when the component mounts
    getProgrammeOptions();
  }, []);

  const handleProgrammeChange = (value) => {
    setProgramme(value);
    if (value.toString().includes("Management Mathematics with Computing")) {
      computingTrackA = false;
      computingTrackB = false;
      scienceTrackA = true;
    } else if (
      value.toString().includes("Data Science") ||
      value.toString().includes("Software Engineering") ||
      value.toString().includes("Interactive Software Technology")
    ) {
      computingTrackA = true;
      computingTrackB = false;
      scienceTrackA = false;
    } else if (
      value.toString().includes("Enterprise Information System") ||
      value.toString().includes("Internet Technology") ||
      value.toString().includes("Information Security")
    ) {
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

      if (user.eligibilityList === null) {
        if (
          qualification.includes(
            "Tunku Abdul Rahman University College (TARUMT)"
          )
        ) {
          setPreviousQualification("SPM");
        } else if (qualification.includes("UEC")) {
          setPreviousQualification("UEC");
        }
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
    } else {
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
    } else if (qualification.includes("SPM")) {
      return "SPM Certificate";
    } else if (qualification.includes("O-Level")) {
      return "O-Level Certificate";
    }
  };

  const getPrevCertName = (prevQualification) => {
    if (prevQualification.includes("SPM")) {
      return "SPM Certificate";
    } else if (prevQualification.includes("O-Level")) {
      return "O-Level Certificate";
    } else if (prevQualification.includes("UEC")) {
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
      type: "error",
      content: msg,
      duration: 2,
    });
  };

  const updateResultForAdyEligible = async () => {
    // get programme id from programme name
    const { data, error } = await supabase
      .from("programme")
      .select("id")
      .eq("programme_name", programme);

    console.log("programme id: " + data[0].id);

    // insert row to application table
    const {
      data: applicationData,
      error: applicationError,
    } = await supabase.from("application").insert([
      {
        applicant_id: loggedUser.applicant_id,
        programme_id: data[0].id,
      },
    ]);

    if (applicationError) {
      console.log(applicationError);
      return;
    }

    if (error) {
      console.log(error);
      return;

    }
    console.log("Successfully updated");

    setTrigger(trigger + 1);
  };

  const handleSubmit = async () => {
    setLoading(true);

    if (user.eligibilityList === null) {
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

        if (
          previousQualification.includes("SPM") ||
          qualification.includes("SPM")
        ) {
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

          if (subjectsAndGrades.length === 0) {
            sendMessage(
              "No subjects and grades found from your certificate. Please try to upload your certificates in the highest quality."
            );
          } else {
            assessment(
              qualification.toString(),
              subjectsAndGrades,
              cgpa,
              previousQualification,
              programme
            );
          }

          setLoading(false);
        } else if (
          previousQualification === "O-Level" ||
          qualification === "O-Level"
        ) {
          //only can scan add maths
          const regex = /(ENGLISH|ADDITIONAL MATHEMATICS)\s+([A-Z]+)/g;
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

          if (subjectsAndGrades.length === 0) {
            sendMessage(
              "No subjects found from your certificate. Please try to upload your certificates in the highest quality."
            );
          } else {
            assessment(
              qualification.toString(),
              subjectsAndGrades,
              cgpa,
              previousQualification,
              programme
            );
          }

          setLoading(false);
        } else if (previousQualification === "UEC" || qualification === "UEC") {
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

          if (subjectsAndGrades.length === 0) {
            sendMessage(
              "No subjects found from your certificate. Please try to upload your certificates in the highest quality."
            );
          } else {
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
    }
    else{
      updateResultForAdyEligible();
    }
  };

  async function fetchData() {
    try {
      // check if user exists in application table
      const { data: applicationData, error: applicationError } = await supabase
        .from("application")
        .select("*")
        .eq("applicant_id", user.applicant_id);

      if (applicationError) {
        console.log(applicationError);
        return;
      }

      if (applicationData.length > 0) {
        setIsApplied(true);

        // get programme name from programme id
        const { data, error } = await supabase
          .from("programme")
          .select("programme_name")
          .eq("id", applicationData[0].programme_id);

        if (error) {
          console.log(error);
          return;
        }

        // 2023-09-20T09:43:24.150346 convert to 20/09/2023 and 09:43:24
        const date = applicationData[0].date_applied.split("T")[0];

        setSuccessfullyMessage(
          "You have successfully applied for " +
            data[0].programme_name +
            " on " +
            date
        );
      }
    } catch (error) {
      console.error("Error fetching data:", error.message);
    }
  }

  //fetch data
  useEffect(() => {
    fetchData();
  }, [user, trigger]);

  const assessment = (
    qualification,
    previousQualificationSubjectsAndGrades,
    cgpa,
    previousQualification,
    programme
  ) => {
    const updateResult = async () => {
      // get programme id from programme name
      const { data, error } = await supabase
        .from("programme")
        .select("id")
        .eq("programme_name", programme);

      console.log("programme id: " + data[0].id);

      // insert row to application table
      const {
        data: applicationData,
        error: applicationError,
      } = await supabase.from("application").insert([
        {
          applicant_id: loggedUser.applicant_id,
          programme_id: data[0].id,
        },
      ]);

      if (applicationError) {
        console.log(applicationError);
        return;
      }

      if (error) {
        console.log(error);
        return;
      }
      console.log("Successfully updated");
      setTrigger(trigger + 1);
    };
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
      programme.toString().includes("Management Mathematics with Computing")
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
        //foundation tarc
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
            applyResultMsg =
              "You are eligible for this programme, but you are required to pass Bahasa Kebangsaan A before graduation";
          }
          updateResult();
        } else {
          console.log("You are not eligible for this programme");
          applyResultMsg = "You are not eligible for this programme";
        }
      } else if (
        //diploma tarc
        qualification === qualifcationList[3] ||
        qualification === qualifcationList[4] ||
        qualification === qualifcationList[5] ||
        qualification === qualifcationList[6]
      ) {
        if (result.cgpaEnough) {
          if (result.bahasaMelayuCredit) {
            console.log("You are eligible for this programme");
            applyResultMsg = "You are eligible for this programme";
          } else {
            console.log(
              "You are eligible for this programme, but you are required to pass Bahasa Kebangsaan A before graduation"
            );
            applyResultMsg =
              "You are eligible for this programme, but you are required to pass Bahasa Kebangsaan A before graduation";
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
          (result.bahaseInggerisCredit || result.bahaseInggerisPass)
        ) {
          if (result.bahasaMelayuCredit) {
            console.log("You are eligible for this programme");
            applyResultMsg = "You are eligible for this programme";
          } else {
            console.log(
              "You are eligible for this programme, but you are required to pass Bahasa Kebangsaan A before graduation"
            );
            applyResultMsg =
              "You are eligible for this programme, but you are required to pass Bahasa Kebangsaan A before graduation";
          }
          updateResult();
        } else {
          console.log("You are not eligible for this programme");
          applyResultMsg = "You are not eligible for this programme";
        }
      } else {
        if (
          result.mathCredit &&
          (result.bahaseInggerisCredit || result.bahaseInggerisPass) &&
          result.cgpaEnough
        ) {
          if (result.bahasaMelayuCredit) {
            console.log("You are eligible for this programme");
            applyResultMsg = "You are eligible for this programme";
          } else {
            console.log(
              "You are eligible for this programme, but you are required to pass Bahasa Kebangsaan A before graduation"
            );
            applyResultMsg =
              "You are eligible for this programme, but you are required to pass Bahasa Kebangsaan A before graduation";
          }
          updateResult();
        } else {
          console.log("You are not eligible for this programme");
          applyResultMsg = "You are not eligible for this programme";
        }
      }
    } else if (
      // Software Engineering
      programme.toString().includes("Software Engineering") ||
      programme.toString().includes("Data Science") ||
      programme.toString().includes("Interactive Software Technology")
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
            applyResultMsg =
              "You are eligible for this programme, but you are required to pass Bahasa Kebangsaan A before graduation";
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
        if (result.cgpaEnough) {
          if (result.bahasaMelayuCredit) {
            console.log("You are eligible for this programme");
            applyResultMsg = "You are eligible for this programme";
          } else {
            console.log(
              "You are eligible for this programme, but you are required to pass Bahasa Kebangsaan A before graduation"
            );
            applyResultMsg =
              "You are eligible for this programme, but you are required to pass Bahasa Kebangsaan A before graduation";
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
          (result.bahaseInggerisCredit || result.bahaseInggerisPass)
        ) {
          if (result.bahasaMelayuCredit) {
            console.log("You are eligible for this programme");
            applyResultMsg = "You are eligible for this programme";
          } else {
            console.log(
              "You are eligible for this programme, but you are required to pass Bahasa Kebangsaan A before graduation"
            );
            applyResultMsg =
              "You are eligible for this programme, but you are required to pass Bahasa Kebangsaan A before graduation";
          }
          updateResult();
        } else {
          console.log("You are not eligible for this programme");
          applyResultMsg = "You are not eligible for this programme";
        }
      } else {
        if (
          result.addMathCredit &&
          (result.bahaseInggerisCredit || result.bahaseInggerisPass) &&
          result.cgpaEnough
        ) {
          if (result.bahasaMelayuCredit) {
            console.log("You are eligible for this programme");
            applyResultMsg = "You are eligible for this programme";
          } else {
            console.log(
              "You are eligible for this programme, but you are required to pass Bahasa Kebangsaan A before graduation"
            );
            applyResultMsg =
              "You are eligible for this programme, but you are required to pass Bahasa Kebangsaan A before graduation";
          }
          updateResult();
        } else {
          console.log("You are not eligible for this programme");
          applyResultMsg = "You are not eligible for this programme";
        }
      }
    } else if (
      // Enterprise
      programme.toString().includes("Enterprise Information System") ||
      programme.toString().includes("Internet Technology") ||
      programme.toString().includes("Information Security")
    ) {
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
            applyResultMsg =
              "You are eligible for this programme, but you are required to pass Bahasa Kebangsaan A before graduation";
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
        if (result.cgpaEnough) {
          if (result.bahasaMelayuCredit) {
            console.log("You are eligible for this programme");
            applyResultMsg = "You are eligible for this programme";
          } else {
            console.log(
              "You are eligible for this programme, but you are required to pass Bahasa Kebangsaan A before graduation"
            );
            applyResultMsg =
              "You are eligible for this programme, but you are required to pass Bahasa Kebangsaan A before graduation";
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
        if (result.mathCredit && result.bahaseInggerisCredit) {
          if (result.bahasaMelayuCredit) {
            console.log("You are eligible for this programme");
            applyResultMsg = "You are eligible for this programme";
          } else {
            console.log(
              "You are eligible for this programme, but you are required to pass Bahasa Kebangsaan A before graduation"
            );
            applyResultMsg =
              "You are eligible for this programme, but you are required to pass Bahasa Kebangsaan A before graduation";
          }
          updateResult();
        } else {
          console.log("You are not eligible for this programme");
          applyResultMsg = "You are not eligible for this programme";
        }
      } else {
        if (
          result.mathCredit &&
          (result.bahaseInggerisCredit || result.bahaseInggerisPass) &&
          result.cgpaEnough
        ) {
          if (result.bahasaMelayuCredit) {
            console.log("You are eligible for this programme");
            applyResultMsg = "You are eligible for this programme";
          } else {
            console.log(
              "You are eligible for this programme, but you are required to pass Bahasa Kebangsaan A before graduation"
            );
            applyResultMsg =
              "You are eligible for this programme, but you are required to pass Bahasa Kebangsaan A before graduation";
          }
          updateResult();
        } else {
          console.log("You are not eligible for this programme");
          applyResultMsg = "You are not eligible for this programme";
        }
      }
    } else {
      // diploma programme
      if (programme.toString().includes("Diploma in Computer Science")) {
        const result = DiplomaComputerScienceAssessment(
          qualification,
          previousQualificationSubjectsAndGrades
        );

        if (
          result.addMathCredit &&
          (result.bahaseInggerisCredit || result.bahaseInggerisPass) &&
          result.bahasaMelayuPass
        ) {
          console.log("You are eligible for this programme");
          applyResultMsg = "You are eligible for this programme";
          updateResult();
        } else {
          console.log("You are not eligible for this programme");
          applyResultMsg = "You are not eligible for this programme";
        }
      } else {
        const result = DiplomaSoftwareEngineeringAssessment(
          qualification,
          previousQualificationSubjectsAndGrades
        );

        if (
          result.mathCredit &&
          (result.bahaseInggerisCredit || result.bahaseInggerisPass) &&
          result.bahasaMelayuPass
        ) {
          console.log("You are eligible for this programme");
          applyResultMsg = "You are eligible for this programme";
          updateResult();
        } else {
          console.log("You are not eligible for this programme");
          applyResultMsg = "You are not eligible for this programme";
        }
      }
    }
  };

  return (
    <>
      <div>
        <Result
          style={{
            display: isApplied ? "flex" : "none",
            height: "80vh",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
          }}
          status="success"
          title="Successfully Applied"
          subTitle={successfullyMessage}
        />
        <div
          style={{
            display: isApplied ? "none" : "block",
            padding: "5rem 15rem",
            margin: "auto",
          }}
        >
          <Spin spinning={loading} tip="Assessing">
            {contextHolder}
            <message message={message} />
            <div
              style={{
                marginBottom: "2rem",
              }}
            >
              <h3>Choose your desired programme</h3>
              <Select
                placeholder="Please select yor desired programme"
                onChange={handleProgrammeChange}
                options={programmeOptions}
                style={{
                  width: "100%",
                }}
              />
            </div>
            {programme !== "" && (
              <div
                style={{
                  marginBottom: "2rem",
                }}
              >
                <h3>Choose your qualifcation</h3>
                <Cascader
                  options={qualificationOptions}
                  onChange={handleQualificationChange}
                  placeholder="Please select your qualification"
                  style={{
                    display: programme.includes("Diploma") ? "none" : "block",
                    width: "100%",
                  }}
                  allowClear={false}
                />
                <Select
                  options={qualificationOptionsForDiploma}
                  onChange={handleQualificationChange}
                  placeholder="Please select your qualification"
                  style={{
                    display: programme.includes("Diploma") ? "block" : "none",
                    width: "100%",
                  }}
                  allowClear={false}
                />
              </div>
            )}

            {programme !== "" && !hideCgpa && (
              <div
                style={{
                  marginBottom: "2rem",
                }}
              >
                <h3>Enter your CGPA</h3>
                <CGPA value={cgpa} onChange={handleCgpaChange} />
              </div>
            )}
            {((programme !== "" && qualification !== "" && isCgpaEntered) ||
              (programme !== "" && qualification !== "" && hideCgpa)) && (
              <div
                style={{
                  marginBottom: "2rem",
                }}
              >
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
              !programme.includes("Diploma") &&
              user.eligibilityList === null &&
              fileListSize > 0 && (
                <div
                  style={{
                    marginBottom: "2rem",
                  }}
                >
                  <h3>Choose your previous qualifcation</h3>
                  <Select
                    placeholder="Please select your previous qualification"
                    onChange={handlePreviousQualificationChange}
                    options={previousQualificationOptions}
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
                <div
                  style={{
                    marginBottom: "2rem",
                  }}
                >
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
            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                marginTop: "1rem",
              }}
            >
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
                    prevFileListSize > 0) ||
                  (programme !== "" &&
                    programme.includes("Diploma") &&
                    qualification !== "" &&
                    fileListSize > 0) ||
                  (programme !== "" &&
                    qualification !== "" &&
                    user.eligibilityList !== null &&
                    fileListSize > 0)
                    ? false
                    : true
                }
                onClick={handleSubmit}
              >
                Submit
              </Button>
            </div>
          </Spin>
        </div>
      </div>
    </>
  );
};

export default Application;
