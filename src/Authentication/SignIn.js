import React from "react";
import { Button, Form, Input, Card, message } from "antd";
import { useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../supabase-client";
import TarumtLogo from "../images/tarumt-logo.png";
import LoginIllustration from "../images/login-illustration.jpg";
import "./auth.css";

const formItemLayout = {
  wrapperCol: {
    xs: {
      span: 18,
    },
    sm: {
      span: 24,
    },
  },
};

const SignIn = () => {
  const [form] = Form.useForm();

  const [isHovered, setIsHovered] = useState(false);
  const hoverStyle = {
    color: isHovered ? "#430f58" : "#6643b5",
  };

  const signIn = async (values) => {
    const { email, password } = values;
    const { error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    });
    if (error) {
      message.error(error.message);
    } else {
      message.success("Signed in successfully!");
    }
  };

  return (
    <div
      className="signin-container"
      style={{
        backgroundColor: "#FFFFFF",
        minHeight: "100vh",
        maxWidth: "100vw",
        height: "auto",
        width: "100vw",
        display: "flex",
        padding: "0",
        margin: "0",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div
        className="signin-left-container"
        style={{
          height: "100vh",
          maxHeight: "100vh",
          width: "50vw",
          display: "flex",
          flexDirection: "column",
          marginRight: "150px",
        }}
      >
        <div
          className="logo-container"
          style={{
            width: "100%",
            height: "30%",
            backgroundImage: `url(${TarumtLogo})`,
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
          }}
        ></div>
        <div
          className="illustration-container"
          style={{
            width: "100%",
            height: "70%",
            backgroundImage: `url(${LoginIllustration})`,
            backgroundSize: "55vw 100vh",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
          }}
        ></div>
      </div>
      <div
        className="signin-card"
        style={{
          height: "auto",
          width: "30vw",
          marginTop: "40px",
          marginBottom: "40px",
          marginLeft: "0",
          marginRight: "0",
          display: "flex",
          alignItems: "center",
          flexDirection: "column",
          justifyContent: "center",
          padding: "20px",
          borderRadius: "10px",
          overflow: "auto",
          maxWidth: "100%",
        }}
      >
        <Card
          bordered
          style={{
            width: "100%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Form
            {...formItemLayout}
            form={form}
            name="signIn"
            scrollToFirstError
            colon={true}
            onFinish={signIn}
          >
            <h1 style={{ textAlign: "center" }}>Sign In</h1>
            <Form.Item
              name="email"
              rules={[
                {
                  required: true,
                  message: "Please input your E-mail!",
                },
              ]}
            >
              <Input placeholder="E-mail" autoComplete="true"/>
            </Form.Item>
            <Form.Item
              name="password"
              rules={[
                {
                  required: true,
                  message: "Please input your password!",
                },
              ]}
            >
              <Input.Password placeholder="Password" />
            </Form.Item>

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                style={{
                  backgroundColor: "#0062D1",
                  borderColor: "#0062D1",
                  marginTop: "5px",
                  width: "20vw",
                  fontSize: "1.2rem",
                  height: "auto",
                }}
              >
                Sign In
              </Button>
            </Form.Item>
          </Form>
          <Link
            to="/signUp"
            style={hoverStyle}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            Don't have an account? Register here
          </Link>
        </Card>
      </div>
    </div>
  );
};

export default SignIn;
