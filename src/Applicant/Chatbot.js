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
      message: "Hi, I'm Tarumt Chatbot!",
      trigger: "intro2",
    },
    {
      id: "intro2",
      message: "I'm here to help you with your application.",
      trigger: "intro3",
    },
    {
      id: "intro3",
      message: "What's your name?",
      trigger: "name",
    },
    {
      id: "name",
      user: true,
      trigger: "intro4",
    },
    {
      id: "intro4",
      message: "Hi {previousValue}, what do you want to know?",
      trigger: "intro5",
    },
    {
      id: "intro5",
      options: [
        {
          value: 1,
          label: "Intakes & Programmes",
          trigger: "intake-programmes",
        },
        // { value: 2, label: "Application", trigger: "application" },
        // {
        //   value: 3,
        //   label: "Entry Requirements",
        //   trigger: "entry-requirements",
        // },
      ],
    },
    {
      id: "intake-programmes",
      options: [
        { value: 1, label: "Programmes Offered", trigger: "programmes" },
        // { value: 2, label: "Intakes", trigger: "intakes" },
        // { value: 3, label: "Programme Fees", trigger: "fees" },
        { value: 4, label: "Back", trigger: "intro5" },
      ],
    },
    {
      id: "programmes",
      message: () => {
        return (
          <div>
            The Bachelor Degree and Diploma programmes offered can be found at
            <a
              href="https://www.tarc.edu.my/admissions/programmes/programme-offered-a-z/undergraduate-programme/"
              target="_blank"
              rel="noopener noreferrer"
            >
              https://www.tarc.edu.my/admissions/programmes/programme-offered-a-z/undergraduate-programme/
            </a>
          </div>
        );
      },
      trigger: "programmes-2",
    },
    {
      id: "programmes-2",
      message:
        " The Foundation programmes offered can be found at https://www.tarc.edu.my/admissions/programmes/programme-offered-a-z/pre-university-programme/",
      trigger: "intake-programmes",
    },
  ];

  return (
    <ThemeProvider theme={theme}>
      <ChatBot floating={true} steps={steps} width="30%" />
    </ThemeProvider>
  );
};

export default Chatbot;
