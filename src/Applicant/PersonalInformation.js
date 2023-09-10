import React, { useEffect, useState } from "react";
import { Form, Input, Radio, Button, message } from "antd";
import { findPostcode } from "malaysia-postcodes";
import { supabase } from "../supabase-client";
import Loading from "../Components/Loading";

const PersonalInformation = () => {
  const [form] = Form.useForm();
  const [addressInfo, setAddressInfo] = useState(null);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const getAddressInfo = (e) => {
    const postcode = e.target.value;
    const addressInfo = findPostcode(postcode);
    setAddressInfo(addressInfo);

    // Set city and state fields when addressInfo changes
    if (addressInfo) {
      form.setFieldsValue({
        city: addressInfo.city || "",
        state: addressInfo.state || "",
      });
    }
  };

  const getUser = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (user) {
      let { data, error } = await supabase
        .from("applicant")
        .select("*")
        .eq("applicant_id", user.id);

      if (error) {
        console.log(error);
        return;
      }
      setUser(data[0]);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    setUser(getUser());
  }, []);

  const onFinish = async (values) => {
    let { data, error } = await supabase
      .from("applicant")
      .update([
        {
          name: values.name,
          mykad_no: values.mykadNo,
          gender: values.gender,
          phone_no: values.phone,
          address: values.address,
          postcode: values.postcode,
          city: values.city,
          state: values.state,
        },
      ])
      .eq("applicant_id", user.applicant_id);

    if (error) {
      console.log(error);
      return;
    }
    message.success("Personal information updated!");
  };

  return isLoading ? (
    <Loading />
  ) : (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Form
        style={{ width: "70%" }}
        layout="vertical"
        form={form}
        onFinish={onFinish}
      >
        <div className="header">
          <h3>Personal Information</h3>
          <p>
            Please ensure that the information provided is correct as it will be
            used for your registration and certificate purposes.
          </p>
        </div>
        <div
          className="form-container"
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-around",
          }}
        >
          <div className="personal-info" style={{ width: "40%" }}>
            <Form.Item
              label="Name (as in MyKad)"
              name="name"
              initialValue={user?.name}
              rules={[
                {
                  required: true,
                  message: "Please input your name!",
                },
                {
                  validator(_, value) {
                    if (
                      (value ?? "").length === 0 ||
                      (value ?? "").match(/^[a-zA-Z\s]*$/)
                    ) {
                      return Promise.resolve();
                    }
                    return Promise.reject(new Error("The name is invalid!"));
                  },
                },
              ]}
            >
              <Input placeholder="Name" />
            </Form.Item>
            <Form.Item
              label="MyKad No."
              name="mykadNo"
              initialValue={user?.mykad_no}
              rules={[
                {
                  required: true,
                  message: "Please input your MyKad number!",
                },
                {
                  validator(_, value) {
                    if (
                      (value ?? "").length === 0 ||
                      (value ?? "").match(/^[0-9]{6}-[0-9]{2}-[0-9]{4}$/)
                    ) {
                      return Promise.resolve();
                    }
                    return Promise.reject(
                      new Error("The MyKad number is invalid!")
                    );
                  },
                },
              ]}
            >
              <Input placeholder="999999-99-9999" />
            </Form.Item>
            <Form.Item
              label="Gender"
              name="gender"
              initialValue={user?.gender ? user.gender : "Male"}
            >
              <Radio.Group>
                <Radio.Button value="Male">Male</Radio.Button>
                <Radio.Button value="Female">Female</Radio.Button>
              </Radio.Group>
            </Form.Item>
            <Form.Item
              label="Phone Number"
              name="phone"
              initialValue={user?.phone_no}
              rules={[
                {
                  required: true,
                  message: "Please input your phone number!",
                },
                {
                  validator(_, value) {
                    if (
                      (value ?? "").length === 0 ||
                      (((value ?? "").length === 10 ||
                        (value ?? "").length === 11) &&
                        (value ?? "").match(/^[0-9]+$/))
                    ) {
                      return Promise.resolve();
                    }
                    return Promise.reject(
                      new Error("The phone number is invalid!")
                    );
                  },
                },
              ]}
            >
              <Input placeholder="Phone Number" />
            </Form.Item>
            <Form.Item label="Email" name="email" initialValue={user?.email}>
              <Input placeholder="Email" disabled />
            </Form.Item>
          </div>
          <div className="address-info" style={{ width: "40%" }}>
            <Form.Item
              label="Address"
              name="address"
              initialValue={user?.address}
              rules={[
                {
                  required: true,
                  message: "Please input your address!",
                },
              ]}
            >
              <Input placeholder="Address" />
            </Form.Item>
            <Form.Item
              label="Postcode"
              name="postcode"
              initialValue={user?.postcode}
              rules={[
                {
                  required: true,
                  message: "Please input your postcode!",
                },
                {
                  validator(_, value) {
                    if (
                      (value ?? "").length === 0 ||
                      ((value ?? "").match(/^[0-9]{5}$/) &&
                        findPostcode(value ?? "").found === true)
                    ) {
                      console.log(findPostcode(value ?? ""));
                      return Promise.resolve();
                    }
                    return Promise.reject(
                      new Error("The postcode is invalid!")
                    );
                  },
                },
              ]}
            >
              <Input placeholder="Postcode" onChange={getAddressInfo} />
            </Form.Item>
            <Form.Item label="City" name="city" initialValue={user?.city}>
              <Input placeholder="City" disabled />
            </Form.Item>
            <Form.Item label="State" name="state" initialValue={user?.state}>
              <Input placeholder="State" disabled />
            </Form.Item>
          </div>
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "flex-end",
            marginTop: "1rem",
          }}
        >
          <Form.Item>
            <Button
              htmlType="reset"
              style={{
                fontSize: "1rem",
                height: "auto",
                marginRight: "1rem",
              }}
            >
              Clear Form
            </Button>
          </Form.Item>
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              style={{
                fontSize: "1rem",
                height: "auto",
                marginRight: "2.75rem",
              }}
            >
              Update
            </Button>
          </Form.Item>
        </div>
      </Form>
    </div>
  );
};

export default PersonalInformation;
