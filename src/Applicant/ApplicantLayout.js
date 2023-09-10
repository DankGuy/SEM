import React, { useEffect, useState } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { Breadcrumb, Layout, Menu, theme } from "antd";
import { supabase } from "../supabase-client";
import Loading from "../Components/Loading";
import TarumtPureLogo from "../images/tarumt-pure-logo.png";

const { Header, Content, Footer } = Layout;

const ApplicantLayout = () => {
  const {
    token: { colorBgContainer },
  } = theme.useToken();

  const navigate = useNavigate();
  const location = useLocation();

  const [current, setCurrent] = useState(location.pathname);
  const [breadcrumb, setBreadcrumb] = useState([]);

  const items = [
    {
      key: "/applicant",
      label: "Home",
    },
    {
      key: "/applicant/application",
      label: "Application",
    },
    {
      key: "/applicant/questions",
      label: "Questions",
    },
    {
      key: "/applicant/personalInformation",
      label: "Personal Information",
    },
    {
      key: "/",
      label: "Logout",
    },
  ];

  const signOut = async () => {
    await supabase.auth.signOut().then(() => {
      navigate("/");
    });
  };

  const handleClick = (e) => {
    setCurrent(e.key);
    if (e.key === "/") {
      localStorage.removeItem("current");
      signOut();
    } else {
      localStorage.setItem("current", e.key);
      navigate(e.key);
    }
  };

  // Define a breadcrumb data structure based on the current route
  const generateBreadcrumb = () => {
    const pathSegments = location.pathname
      .split("/")
      .filter((segment) => segment !== "");

    const breadcrumbData = [];

    // Generate breadcrumb items based on path segments
    let currentPath = "";
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
    setCurrent(localStorage.getItem("current"));
  }, [current]);

  useEffect(() => {
    setCurrent(location.pathname);
  }, []);

  return (
    <Layout className="layout">
      <Header
        style={{
          position: "sticky",
          top: 0,
          zIndex: 1,
          width: "100%",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            cursor: "pointer",
          }}
          onClick={() => {
            navigate("/applicant");
            setCurrent("/applicant");
          }}
        >
          <img src={TarumtPureLogo} alt="Logo" height="50px" />
        </div>
        <Menu
          theme="dark"
          mode="horizontal"
          onClick={handleClick}
          selectedKeys={[current]}
          items={items}
          style={{ width: "100%", display: "flex", justifyContent: "flex-end" }}
        />
      </Header>
      <Content
        style={{
          padding: "0 50px",
        }}
      >
        <Breadcrumb
          style={{
            margin: "16px 0",
          }}
          items={breadcrumb.map((item) => ({
            key: item.key,
            title: item.label,
          }))}
        />

        <div
          className="site-layout-content"
          style={{
            background: colorBgContainer,
          }}
        >
          <Outlet />
        </div>
      </Content>
      <Footer
        style={{
          textAlign: "center",
        }}
      >
        TARUMT FOCS ©2023
      </Footer>
    </Layout>
  );
};

export default ApplicantLayout;
