import 'boxicons';

const ProgrammeDetailsModal = ({
  programDetails,
  closeModal,
  showModal,
  eligibilityList,
  selectedProgramId,
}) => {
  const modalStyle = {
    display: showModal ? 'block' : 'none',
    fontFamily: 'roboto, sans-serif',
  };

  const modalContentStyle = {
    borderRadius: '20px',
  };

  const imageStyle = {
    display: 'block',
    margin: 'auto', // Center-align the image
    maxWidth: '40%',
    maxHeight: '100%',
    borderRadius: '15px',
  };

  const eligibilityStatus = eligibilityList
    ? eligibilityList[selectedProgramId]
    : null;

  const eligibilityStyle = {
    color: eligibilityStatus ? 'green' : 'red',
    fontWeight: 'bold',
    width: '75%',
    margin: '0 auto',
  };

  const nameStyle = {
    textAlign: 'center',
    width: '80%',
    margin: '0 auto',
    paddingTop: '30px',
    color: '#5050DB',
    fontSize: '26px',
  };

  const overviewStyle = {
    width: '75%',
    margin: '0 auto',
    fontWeight: 'light',
    marginTop: '20px',
    color: '#5A5A5A',
    fontWeight: 'lighter',
    fontSize: '15px',
  };

  const titleStyle = {
    width: '80%',
    margin: '0 auto',
    color: '#5050DB',
    marginTop: '20px',
    marginBottom: '20px',
    fontSize: '18px',
  };

  const programmeTypeStyle = {
    width: '75%',
    margin: '0 auto',
    color: '#5A5A5A',
    fontWeight: 'lighter',
  };

  const imgStyle = {
    display: 'block',
    margin: 'auto',
    maxWidth: '40%', // Adjust the max width as needed
    height: 'auto', // Maintain aspect ratio
  };

  console.log(programDetails.elective_1);

  return (
    <div className='modal' style={modalStyle}>
      <div className='modal-content' style={modalContentStyle}>
        <span className='close' onClick={closeModal}>
          &times;
        </span>

        {/* programme image */}
        {programDetails && programDetails.programme_img && (
          <img
            src={programDetails.programme_img}
            alt={programDetails.programme_name}
            style={imageStyle} // Apply the imageStyle here
          />
        )}

        {/* show programme name */}
        {programDetails && programDetails.programme_name && (
          <h2 style={nameStyle}>{programDetails.programme_name}</h2>
        )}

        {/* show programme overview  */}
        <h4 style={titleStyle}>
          <box-icon
            type='solid'
            name='book'
            style={{ width: '15px', height: '15px' }}
          ></box-icon>{' '}
          Programme Overview
        </h4>
        {programDetails && programDetails.programme_overview && (
          <p style={overviewStyle}>{programDetails.programme_overview}</p>
        )}

        <div
          className='flex-container'
          style={{ display: 'flex', justifyContent: 'space-between' }}
        >
          <div
            className='left-column'
            style={{ flex: 1, marginRight: '20px', marginLeft: '80px' }}
          >
            {/* show programme type */}
            <h4 style={titleStyle}>
              <box-icon
                type='solid'
                name='bookmark'
                style={{ width: '15px', height: '15px' }}
              ></box-icon>{' '}
              Degree Type
            </h4>
            {programDetails && programDetails.programme_type && (
              <p style={programmeTypeStyle}>{programDetails.programme_type}</p>
            )}

            {/* show programme duration  */}
            <h4 style={titleStyle}>
              <box-icon
                type='solid'
                name='time'
                style={{ width: '15px', height: '15px' }}
              ></box-icon>{' '}
              Duration
            </h4>
            {programDetails && programDetails.duration && (
              <p style={overviewStyle}>{programDetails.duration} years</p>
            )}
          </div>

          <div className='right-column' style={{ flex: 1, marginLeft: '80px' }}>
            {/* show programme location */}
            <h4 style={titleStyle}>
              <box-icon
                type='solid'
                name='location-plus'
                style={{ width: '15px', height: '15px' }}
              ></box-icon>{' '}
              Location
            </h4>
            {programDetails && programDetails.location && (
              <ul style={overviewStyle}>
                {programDetails.location.map((location, index) => (
                  <li key={index}>{location}</li>
                ))}
              </ul>
            )}

            {/* show programme intake */}
            <h4 style={titleStyle}>
              <box-icon
                type='solid'
                name='calendar-alt'
                style={{ width: '15px', height: '15px' }}
              ></box-icon>{' '}
              Intake
            </h4>
            {programDetails && programDetails.intake && (
              <ul style={overviewStyle}>
                {programDetails.intake.map((elective, index) => (
                  <li key={index}>{elective}</li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* show programme outline */}
        <h4 style={titleStyle}>
          <box-icon
            name='list-ul'
            style={{ width: '15px', height: '15px' }}
          ></box-icon>{' '}
          Programme Outline
        </h4>
        {programDetails && programDetails.programme_outline && (
          <ul style={overviewStyle}>
            {programDetails.programme_outline.map((elective, index) => (
              <li key={index}>{elective}</li>
            ))}
          </ul>
        )}

        {/* show programme elective */}
        <h4 style={titleStyle}>
          <box-icon
            name='list-ul'
            style={{ width: '15px', height: '15px' }}
          ></box-icon>{' '}
          Elective
        </h4>
        {programDetails && programDetails.elective_1 && (
          <ul style={overviewStyle}>
            {programDetails.elective_1.map((elective, index) => (
              <li key={index}>{elective}</li>
            ))}
          </ul>
        )}

        {/* show programme other courses */}
        <h4 style={titleStyle}>
          <box-icon
            name='list-ul'
            style={{ width: '15px', height: '15px' }}
          ></box-icon>{' '}
          Language, Mata Pelajaran Pengajian Umum (MPU) and Co-curricular
          Courses
        </h4>
        {programDetails && programDetails.otherCourses && (
          <ul style={overviewStyle}>
            {programDetails.otherCourses.map((elective, index) => (
              <li key={index}>{elective}</li>
            ))}
          </ul>
        )}

        {/* show programme career prospect */}
        <h4 style={titleStyle}>
          <box-icon
            type='solid'
            name='briefcase'
            style={{ width: '15px', height: '15px' }}
          ></box-icon>{' '}
          Career Prospects
        </h4>
        {programDetails && programDetails.careerProspects && (
          <ul style={overviewStyle}>
            {programDetails.careerProspects.map((elective, index) => (
              <li key={index}>{elective}</li>
            ))}
          </ul>
        )}

        <h4 style={titleStyle}>
          <box-icon
            type='solid'
            name='briefcase'
            style={{ width: '15px', height: '15px' }}
          ></box-icon>{' '}
          Minimum Entry Requirement
        </h4>
        <img
          src='https://www.tarc.edu.my/files/focs/mer202305/8B7CEFC7-9F45-459A-B6D5-301BF0E2E806.png'
          style={imgStyle}
        ></img>

        {/* eligibility status of the current user */}
        {eligibilityStatus !== null && (
          <p style={eligibilityStyle}>
            {' '}
            <box-icon
              name='check'
              style={{ width: '15px', height: '15px' }}
            ></box-icon>
            Are You Eligible: {`${eligibilityStatus ? 'Yes' : 'No'}`}
          </p>
        )}
      </div>
    </div>
  );
};

export default ProgrammeDetailsModal;
