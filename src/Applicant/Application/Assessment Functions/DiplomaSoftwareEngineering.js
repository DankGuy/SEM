const Assessment = (qualification, qualificationSubjectsAndGrades) => {
  let bahasaMelayuPass = false;
  let bahaseInggerisPass = false;
  let mathCredit = false;

  console.log(typeof qualificationSubjectsAndGrades);

  if (qualification.toString().includes("SPM")) {
    qualificationSubjectsAndGrades.forEach(({ subject, grade }) => {
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
        mathCredit = true;
      }
    });
  } else if (qualification === "O-Level") {
    qualificationSubjectsAndGrades.forEach(({ subject, grade }) => {
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
        mathCredit = true;
      }
    });
  } else if (qualification === "UEC") {
    qualificationSubjectsAndGrades.forEach(({ subject, grade }) => {
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
        mathCredit = true;
      }
    });
  }
  const result = {
    bahasaMelayuPass,
    bahaseInggerisPass,
    mathCredit,
  };
  return result;
};

export default Assessment;
