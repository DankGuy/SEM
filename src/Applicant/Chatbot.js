import ChatBot from "react-simple-chatbot";
import { ThemeProvider } from "styled-components";

const Chatbot = () => {
  const theme = {
    background: "#f5f8fb",
    fontFamily: "Helvetica Neue",
    headerBgColor: "#1677FF",
    headerFontColor: "#fff",
    headerFontSize: "15px",
    botBubbleColor: "#1677FF",
    botFontColor: "#fff",
    userBubbleColor: "#fff",
    userFontColor: "#4a4a4a",
  };

  const steps = [
    {
      id: "intro",
      message: "Hi, I'm TARUMT Chatbot!",
      trigger: "intro2",
      hideInput: true,
    },
    {
      id: "intro2",
      message: "What do you want to know?",
      trigger: "choose-category",
      hideInput: true,
    },
    {
      id: "choose-category",
      options: [
        {
          value: 1,
          label: "Intakes & Programmes",
          trigger: "intake-programmes",
        },
        { value: 2, label: "Application", trigger: "application" },
      ],
      hideInput: true,
    },
    {
      id: "intake-programmes",
      options: [
        { value: 1, label: "Programmes Offered", trigger: "programmes" },
        { value: 2, label: "Intakes", trigger: "intakes" },
        { value: 3, label: "Programme Fees", trigger: "fees" },
        { value: 4, label: "Back", trigger: "intro2" },
      ],
      hideInput: true,
    },
    {
      id: "programmes",
      component: (
        <div>
          The Bachelor Degree and Diploma programmes offered can be found at{" "}
          <a
            href="https://www.tarc.edu.my/admissions/programmes/programme-offered-a-z/undergraduate-programme/"
            target="_blank"
            rel="noopener noreferrer"
          >
            <i>Undergraduate Programme</i>
          </a>
          .<br />
          The Foundation programmes offered can be found at{" "}
          <a
            href="https://www.tarc.edu.my/admissions/programmes/programme-offered-a-z/pre-university-programme/"
            target="_blank"
            rel="noopener noreferrer"
          >
            <i>Pre-University Programme</i>
          </a>
          .
        </div>
      ),
      trigger: "intake-programmes",
    },
    {
      id: "intakes",
      component: (
        <div>
          Our intakes are in February, June, October and November. <br />
          The June Intake is the Main Intake. <br />
          Information on intakes, programmes offered, fees, financial aid,
          accommodation etc. can be found at <br />
          <a
            href="https://www.tarc.edu.my/admissions/a/intake-in-progress/"
            target="_blank"
            rel="noopener noreferrer"
          >
            <i>Intake in Progress</i>
          </a>
        </div>
      ),
      trigger: "intake-programmes",
    },
    {
      id: "fees",
      component: (
        <div>
          For details on fees, please click{" "}
          <a
            href="https://www.tarc.edu.my/bursary/content.jsp?cat_id=5AA0377F-4E7F-494A-8EB4-CEF5CE4DD7AE"
            target="_blank"
            rel="noopener noreferrer"
          >
            <i>here</i>
          </a>
        </div>
      ),
      trigger: "intake-programmes",
    },
    {
      id: "application",
      options: [
        { value: 1, label: "When & How to Apply", trigger: "procedure" },
        { value: 2, label: "Documents Needed", trigger: "documents" },
        { value: 3, label: "Back", trigger: "intro2" },
      ],
    },
    {
      id: "procedure",
      component: (
        <div>
          Applications are now open. You are to apply online at{" "}
          <a href="http://bit.ly/TARUCapps">http://bit.ly/TARUCapps</a> by
          registering as a new user (if you are a first time applicant). You may
          view the video on "Steps for online application"
          <br />
          <br />
          For application to <b>postgraduate</b> programmes, click at
          <br />
          <a href="https://www.tarc.edu.my/account/login.jsp?fappcode=cpsr">
            <i>https://www.tarc.edu.my/account/login.jsp?fappcode=cpsr</i>
          </a>
          <br />
          For international students' application, click at{" "}
          <a href="https://web.tarc.edu.my/portal/admintake/indexb.jsp">
            <i>https://web.tarc.edu.my/portal/admintake/indexb.jsp</i>
          </a>
        </div>
      ),
      trigger: "application",
    },
    {
      id: "documents",
      component: (
        <div>
          You are required to upload your MyKad (front and back), SPM/O
          Level/STPM/A Level/UEC/equivalent results and other relevant documents
          (where applicable)
          <br />
          <br />
          The documents you have to upload will be stated in the online
          application.
          <br />
          All documents uploaded must be{" "}
          <u>
            clear and scanned/snapped from the original documents and in colour.
          </u>
        </div>
      ),
      trigger: "application",
    },
  ];

  return (
    <ThemeProvider theme={theme}>
      <ChatBot
        floating={true}
        steps={steps}
        inputStyle={{ display: "none" }}
        hideSubmitButton
        width="25%"
        headerTitle="TARUMT Chatbot"
      />
    </ThemeProvider>
  );
};

export default Chatbot;
