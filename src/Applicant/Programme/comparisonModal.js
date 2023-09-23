import { Descriptions, Row, Col } from 'antd';

const ComparisonModal = ({
  selectedProgrammeDetails,
  onClose,
  eligibilityList,
}) => {
  const modalStyle = {
    display: 'block',
  };

  const programContainerStyle = {
    display: 'flex', // Use flexbox for the container
    borderRadius: '20px',
  };

  const programStyle = {
    flex: 1, // Each programme takes up equal width
    padding: '0 10px', // Add some padding between programmes
  };

  const renderDescriptions = (programme) => (
    <Descriptions column={1} bordered>
      <Descriptions.Item label='Programme Name'>
        {programme.programme_name}
      </Descriptions.Item>
      <Descriptions.Item label='Programme Overview'>
        {programme.programme_overview}
      </Descriptions.Item>
      <Descriptions.Item label='Programme Duration'>
        {programme.duration}
      </Descriptions.Item>
      <Descriptions.Item label='Intake'>
        {programme.intake ? (
          <ul style={{ paddingLeft: 0, listStyleType: 'none' }}>
            {programme.intake.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        ) : (
          '-'
        )}
      </Descriptions.Item>
      <Descriptions.Item label='Programme Outline'>
        {programme.programme_outline ? (
          <ul style={{ paddingLeft: 0, listStyleType: 'none' }}>
            {programme.programme_outline.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        ) : (
          '-'
        )}
      </Descriptions.Item>
      <Descriptions.Item label='Programme Elective'>
        {programme.elective_1 ? (
          <ul style={{ paddingLeft: 0, listStyleType: 'none' }}>
            {programme.elective_1.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        ) : (
          '-'
        )}
      </Descriptions.Item>
      <Descriptions.Item label='Other Courses'>
        {programme.otherCourses ? (
          <ul style={{ paddingLeft: 0, listStyleType: 'none' }}>
            {programme.otherCourses.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        ) : (
          '-'
        )}
      </Descriptions.Item>
      <Descriptions.Item label='Career Prospects'>
        {programme.careerProspects ? (
          <ul style={{ paddingLeft: 0, listStyleType: 'none' }}>
            {programme.careerProspects.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        ) : (
          '-'
        )}
      </Descriptions.Item>
      <Descriptions.Item label='Local Fee'>
        {programme.local_fee || '-'}
      </Descriptions.Item>
      <Descriptions.Item label='International Fee'>
        {programme.international_fee || '-'}
      </Descriptions.Item>
      {/* Add other details as needed */}
    </Descriptions>
  );

  return (
    <div className='modal' style={modalStyle}>
      <div className='modal-content'>
        <span className='close' onClick={onClose}>
          &times;
        </span>
        <Row gutter={16}>
          {selectedProgrammeDetails.map((programme, index) => (
            <Col span={12} key={index}>
              {renderDescriptions(programme)}
            </Col>
          ))}
        </Row>
      </div>
    </div>
  );
};

export default ComparisonModal;
