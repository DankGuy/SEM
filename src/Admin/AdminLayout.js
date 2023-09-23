import React, { useState, useEffect } from 'react';
import {
  LaptopOutlined,
  NotificationOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { Breadcrumb, Layout, Menu, theme } from 'antd';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '../supabase-client';

const { Content, Sider, Footer } = Layout;

const items = [
  {
    key: '/admin/questions',
    label: 'Questions',
    style: {
      marginTop: '10px',
    },
  },
  {
    key: '/',
    label: 'Logout',
    style: {
      marginTop: '10px',
    },
  },
];

const AdminLayout = () => {
  const {
    token: { colorBgContainer },
  } = theme.useToken();

  const navigate = useNavigate();
  const location = useLocation();

  const [current, setCurrent] = useState(location.pathname);
  const [breadcrumb, setBreadcrumb] = useState([]);

  const signOut = async () => {
    await supabase.auth.signOut().then(() => {
      navigate('/');
    });
  };

  const handleClick = (e) => {
    setCurrent(e.key);
    if (e.key === '/') {
      localStorage.removeItem('current');
      signOut();
    } else {
      localStorage.setItem('current', e.key);
      navigate(e.key);
    }
  };

  // Define a breadcrumb data structure based on the current route
  const generateBreadcrumb = () => {
    const pathSegments = location.pathname
      .split('/')
      .filter((segment) => segment !== '');

    const breadcrumbData = [];

    // Generate breadcrumb items based on path segments
    let currentPath = '';
    for (const segment of pathSegments) {
      currentPath += `/${segment}`;
      const breadcrumbItem = items.find((item) => item.key === currentPath);
      if (breadcrumbItem) {
        breadcrumbData.push(breadcrumbItem);
      }
    }
    return breadcrumbData;
  };

  useEffect(() => {
    setBreadcrumb(generateBreadcrumb());
    setCurrent(localStorage.getItem('current'));
  }, [current]);

  useEffect(() => {
    setCurrent(location.pathname);
  }, []);

  return (
    <Layout>
      <Layout>
        <Sider
          width={200}
          style={{
            background: colorBgContainer,
            height: '100vh',
            position: 'fixed',
            left: 0,
            zIndex: 1,
          }}
        >
          <Menu
            mode='inline'
            theme='dark'
            onClick={handleClick}
            defaultSelectedKeys={current}
            style={{
              height: '100%',
              borderRight: 0,
            }}
            items={items}
          />
        </Sider>
        <Layout
          style={{
            padding: '0 24px 24px',
            marginLeft: 200,
          }}
        >
          <Breadcrumb
            style={{
              margin: '16px 0',
            }}
            items={breadcrumb.map((item) => ({
              key: item.key,
              title: item.label,
            }))}
          />
          <Content
            style={{
              padding: 24,
              margin: 0,
              minHeight: 280,
              background: colorBgContainer,
            }}
          >
            <Outlet />
          </Content>
          <Footer
            style={{
              textAlign: 'center',
            }}
          >
            TARUMT FOCS ©2023
          </Footer>
        </Layout>
      </Layout>
    </Layout>
  );
};
export default AdminLayout;
