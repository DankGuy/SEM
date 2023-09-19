import React from "react";
import { Button, Form, Input, Card, message } from "antd";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
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

const SignUp = () => {
  const [form] = Form.useForm();

  const [isHovered, setIsHovered] = useState(false);
  const hoverStyle = {
    color: isHovered ? "#430f58" : "#6643b5",
  };

  const navigate = useNavigate();

  const signUp = async (e) => {
    let emailIsTaken = false;

    let { data, errorMessage } = await supabase.auth.signUp({
      email: e.email,
      password: e.password,
      options: {
        data: {
          userType: "applicant",
        },
      },
    });

    emailIsTaken = data.user && data.user.identities?.length === 0;
    if (emailIsTaken) {
      message.error("Email is already taken!");
    }
    if (errorMessage) {
      message.error(errorMessage);
      console.log(errorMessage);
      return;
    }

    if (!emailIsTaken) {
      message.success("Please check your E-mail for account confirmation");
      setTimeout(() => {
        navigate("/signIn");
      }, 2000);
    }
  };

  return (
    <div
      className="signup-container"
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
        className="signup-card"
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
            name="signup"
            scrollToFirstError
            colon={true}
            onFinish={signUp}
          >
            <h1 style={{ textAlign: "center" }}>Sign Up</h1>
            <Form.Item
            hasFeedback
              name="email"
              rules={[
                {
                  type: "email",
                  message: "The input is not valid e-mail!",
                },
                {
                  required: true,
                  message: "Please input your e-mail!",
                },
              ]}
            >
              <Input placeholder="E-mail" />
            </Form.Item>
            <Form.Item
              name="password"
              rules={[
                {
                  required: true,
                  message: "Please input your password!",
                },
                {
                  validator(_, value) {
                    if (
                      ((value ?? "").length >= 8 &&
                        (value ?? "").match(
                          /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/
                        )) ||
                      (value ?? "").length === 0
                    ) {
                      return Promise.resolve();
                    }
                    return Promise.reject(
                      new Error(
                        "The password must be at least 8 characters, one uppercase letter, one lowercase letter and one number!"
                      )
                    );
                  },
                },
              ]}
              hasFeedback
            >
              <Input.Password placeholder="Password" />
            </Form.Item>

            <Form.Item
              name="confirm"
              dependencies={["password"]}
              hasFeedback
              rules={[
                {
                  required: true,
                  message: "Please confirm your password!",
                },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue("password") === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(
                      new Error(
                        "The new password that you entered do not match!"
                      )
                    );
                  },
                }),
              ]}
            >
              <Input.Password placeholder="Confirm Password" />
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
                Register
              </Button>
            </Form.Item>
          </Form>
          <Link
            to="/signIn"
            style={hoverStyle}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            Already have an account? Login here
          </Link>
        </Card>
      </div>
      <div
        className="signup-right-container"
        style={{
          height: "100vh",
          maxHeight: "100vh",
          width: "50vw",
          display: "flex",
          flexDirection: "column",
          marginLeft: "150px",
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
    </div>
  );
};

export default SignUp;
