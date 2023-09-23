import React from 'react';
import { Link } from 'react-router-dom';
import { useEffect } from 'react';
import { Carousel } from 'antd';
import { theme } from 'antd';

const contentStyle = {
  height: '390px',
  color: '#000',
  lineHeight: '390px',
  textAlign: 'center',
  background: '#364d79',
};

const App = () => {
  const [IPAddress, setIPAddress] = React.useState('');

  const {
    token: { colorBgContainer },
  } = theme.useToken();

  useEffect(() => {
    fetch('https://api.ipify.org?format=json')
      .then((response) => response.json())
      .then((data) => setIPAddress(data.ip))
      .catch((error) => console.log(error));
  }, []);

  return (
    <>
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          paddingTop: '20px',
          fontSize: '15px',
          color: 'rgba(0, 0, 0, 0.85)',
        }}
      >
        User IP address: {IPAddress}
      </div>
      <Carousel dotPosition='left' autoplay>
        <div>
          <h3
            style={{
              height: '390px',
              color: '#fff',
              lineHeight: '390px',
              textAlign: 'center',
              backgroundImage: `url(/banner-1.jpeg)`,
              backgroundRepeat: 'no-repeat',
              objectFit: 'fill',
            }}
          ></h3>
        </div>
        <div>
          <h3
            style={{
              height: '390px',
              color: '#fff',
              lineHeight: '390px',
              textAlign: 'center',
              backgroundImage: `url(/banner-2.jpeg)`,
              backgroundRepeat: 'no-repeat',
              objectFit: 'fill',
            }}
          ></h3>
        </div>

        <div>
          <h3
            style={{
              height: '390px',
              color: '#fff',
              lineHeight: '390px',
              textAlign: 'center',
              backgroundImage: `url(/banner-5.jpeg)`,
              backgroundRepeat: 'no-repeat',
              objectFit: 'fill',
            }}
          ></h3>
        </div>
      </Carousel>
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          marginTop: '20px',
          paddingBottom: '60px',
        }}
      >
        <a
          href='/applicant/application'
          style={{
            textDecoration: 'none',
            color: 'rgba(0, 0, 0, 0.88)',
            fontSize: '15px',
          }}
        >
          <img
            src='/application.png'
            alt='Application Logo'
            style={{ display: 'block' }}
          />
          <span
            style={{
              display: 'block',
              position: 'relative',
              textAlign: 'center',
            }}
          >
            Application
          </span>
        </a>
        <a
          href='/Programme'
          style={{
            textDecoration: 'none',
            color: 'rgba(0, 0, 0, 0.88)',
            fontSize: '15px',
          }}
        >
          <img
            src='/programme.png'
            alt='Programme Logo'
            style={{ display: 'block' }}
          />
          <span
            style={{
              display: 'block',
              position: 'relative',
              textAlign: 'center',
            }}
          >
            Programme
          </span>
        </a>
        <a
          href='/applicant/questions'
          style={{
            textDecoration: 'none',
            color: 'rgba(0, 0, 0, 0.88)',
            fontSize: '15px',
          }}
        >
          <img
            src='/question.png'
            alt='Question Logo'
            style={{ display: 'block' }}
          />
          <span
            style={{
              display: 'block',
              position: 'relative',
              textAlign: 'center',
            }}
          >
            Questions
          </span>
        </a>
        <a
          href='/applicant/personalInformation'
          style={{
            textDecoration: 'none',
            color: 'rgba(0, 0, 0, 0.88)',
            fontSize: '15px',
          }}
        >
          <img
            src='/personal_information.png'
            alt='Question Logo'
            style={{ display: 'block' }}
          />
          <span
            style={{
              display: 'block',
              position: 'relative',
              textAlign: 'center',
            }}
          >
            Personal Information
          </span>
        </a>
        <a
          href='/staffDirectory'
          style={{
            textDecoration: 'none',
            color: 'rgba(0, 0, 0, 0.88)',
            fontSize: '15px',
          }}
        >
          <img
            src='/staff_directory.png'
            alt='Question Logo'
            style={{ display: 'block' }}
          />
          <span
            style={{
              display: 'block',
              position: 'relative',
              textAlign: 'center',
            }}
          >
            Staff Directory
          </span>
        </a>
      </div>
    </>
  );
};

export default App;
