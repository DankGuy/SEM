const Assessment = (
  qualification,
  cgpa,
  previousQualification,
  previousQualificationSubjectsAndGrades
) => {
  let bahasaMelayuCredit = false;
  let bahaseInggerisCredit = false;
  let bahaseInggerisPass = false;
  let addMathCredit = false;
  let cgpaEnough = false;

  console.log(typeof previousQualificationSubjectsAndGrades);

  if (
    qualification.toString() ===
      "Tunku Abdul Rahman University College (TARUMT),Foundation,Foundation In Computing Track A" ||
    qualification.toString() ===
      "Tunku Abdul Rahman University College (TARUMT),Foundation,Foundation In Computing Track B" ||
    qualification.toString() ===
      "Tunku Abdul Rahman University College (TARUMT),Foundation,Foundation In Science Track A"
  ) {
    previousQualificationSubjectsAndGrades.forEach(({ subject, grade }) => {
      console.log("subject", subject);
      console.log("grade", grade);
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
        bahasaMelayuCredit = true;
      }
      bahaseInggerisCredit = null;
      bahaseInggerisPass = null;
      cgpaEnough = null;
      addMathCredit = null;
    });
  } else if (
    qualification.toString() ===
      "Tunku Abdul Rahman University College (TARUMT),Diploma,Diploma in Information Systems" ||
    qualification.toString() ===
      "Tunku Abdul Rahman University College (TARUMT),Diploma,Diploma in Information Technology" ||
    qualification.toString() ===
      "Tunku Abdul Rahman University College (TARUMT),Diploma,Diploma in Software Engineering" ||
    qualification.toString() ===
      "Tunku Abdul Rahman University College (TARUMT),Diploma,Diploma in Computer Science"
  ) {
    previousQualificationSubjectsAndGrades.forEach(({ subject, grade }) => {
      console.log("subject", subject);
      console.log("grade", grade);
      if (
        subject === "BAHASA MELAYU" &&
        (grade === "C" ||
          grade === "C+" ||
          grade === "B-" ||
          grade === "B" ||
          grade === "B+" ||
          grade === "A-" ||
          grade === "A" ||
          grade === "A+") &&
        cgpa >= 2.5
      ) {
        bahasaMelayuCredit = true;
        cgpaEnough = true;
      }
      bahaseInggerisCredit = null;
      bahaseInggerisPass = null;
      addMathCredit = null;
    });
  } else if (
    qualification === "Pre-University,STPM" ||
    qualification === "Pre-University,A-Level" ||
    qualification === "Pre-University,UEC" ||
    qualification ===
      "Other Institution of Higher Learning (IHL),IHL Foundation"
  ) {
    if (previousQualification === "SPM") {
      bahaseInggerisCredit = null;
      previousQualificationSubjectsAndGrades.forEach(({ subject, grade }) => {
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
          bahasaMelayuCredit = true;
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
        cgpaEnough = null;
      });
    } else if (previousQualification === "O-Level") {
      bahaseInggerisCredit = null;
      previousQualificationSubjectsAndGrades.forEach(({ subject, grade }) => {
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
          bahasaMelayuCredit = true;
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
        cgpaEnough = null;
      });
    } else if (previousQualification === "UEC") {
      bahaseInggerisPass = null;
      previousQualificationSubjectsAndGrades.forEach(({ subject, grade }) => {
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
          bahasaMelayuCredit = true;
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
          bahaseInggerisCredit = true;
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
        cgpaEnough = null;
      });
    }
  }

  const result = {
    bahasaMelayuCredit,
    bahaseInggerisCredit,
    bahaseInggerisPass,
    addMathCredit,
    cgpaEnough,
  };
  return result;
};

export default Assessment;
