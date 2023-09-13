import React, { useState, useEffect } from "react";
import {
  Col,
  Row,
  Card,
  Button,
  Badge,
  Tooltip,
  Typography,
  Modal,
  Form,
  Input,
  message,
} from "antd";
import { CommentOutlined } from "@ant-design/icons";
import { supabase } from "../supabase-client";
import Loading from "../Components/Loading";

const Questions = () => {
  const [question, setQuestion] = useState(null);
  const [quesID, setQuesID] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [modalVisibilities, setModalVisibilities] = useState([]);
  const [fetchTrigger, setFetchTrigger] = useState(0);

  const { Text } = Typography;
  const { form } = Form.useForm();

  const fetchData = async () => {
    const { data, error } = await supabase
      .from("question")
      .select("*")
      .order("created_at", { ascending: false })
      .order("answered_at", { ascending: false });

    if (error) {
      console.log(error);
      return;
    } else {
      // Manually sort the data based on the "status" column
      const sortedListings = data.sort((a, b) => {
        const statusOrder = {
          pending: 1,
          answered: 2,
        };

        return statusOrder[a.status] - statusOrder[b.status];
      });

      const listingsWithModalVisibility = sortedListings.map((listing) => ({
        ...listing,
        isModalVisible: false,
      }));

      setQuestion(listingsWithModalVisibility);
      setIsLoading(false);
    }
  };

  const handleSubmission = async (values) => {
    const { error } = await supabase
      .from("question")
      .update([
        {
          answer: values.answer,
          status: "answered",
          answered_at: new Date().toISOString(),
        },
      ])
      .eq("question_id", quesID);

    if (error) {
      console.log(error);
      message.error(
        "Failed to post answer due to technical error! Contact support to assist you."
      );
      return;
    } else {
      message.success("Question posted successfully!");
      setFetchTrigger(fetchTrigger + 1);
    }
  };

  useEffect(() => {
    fetchData();
  }, [fetchTrigger]);

  return isLoading ? (
    <Loading />
  ) : (
    <div
      style={{
        height: "auto",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <div style={{ padding: "20px" }}>
        <Row gutter={[16, 16]}>
          {question?.map((item, index) => {
            return (
              <Col key={item.question_id} xs={24} sm={12}>
                <Card
                  title={
                    <Text
                      ellipsis={{
                        tooltip: item.question,
                      }}
                    >
                      {item.question}
                    </Text>
                  }
                  bordered
                  extra={
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "row",
                        justifyContent: "space-between",
                      }}
                    >
                      <div style={{ marginRight: "10px" }}>
                        <span style={{ fontSize: "0.8rem" }}>
                          <i>
                            {item.status === "pending" ? (
                              <span>Created At: {item.created_at}</span>
                            ) : (
                              <span>Answered At: {item.answered_at}</span>
                            )}
                          </i>
                        </span>
                      </div>
                      <Tooltip title={item.status.toUpperCase()}>
                        <Badge
                          status={
                            item.status === "pending" ? "error" : "success"
                          }
                        />
                      </Tooltip>
                    </div>
                  }
                  actions={[
                    <Button
                      type="link"
                      onClick={() => {
                        const updatedListings = question.map((l) =>
                          l.question_id === item.question_id
                            ? { ...l, isModalVisible: true }
                            : l
                        );
                        setQuestion(updatedListings);
                      }}
                      {...(item.status === "answered" && { disabled: true })}
                    >
                      <CommentOutlined />
                      Answer
                    </Button>,
                  ]}
                >
                  {item.answer}
                </Card>
                <Modal
                  title={item.question}
                  open={item.isModalVisible} // Use the index to determine the visibility
                  onCancel={() => {
                    // Update the isModalVisible property for this listing
                    const updatedListings = question.map((l) =>
                      l.question_id === item.question_id
                        ? { ...l, isModalVisible: false }
                        : l
                    );
                    setQuestion(updatedListings);
                  }}
                  footer={null}
                >
                  <Form.Provider
                    onFormFinish={(name, { values, forms }) => {
                      if (name === "answer-form") {
                        forms["answer-form"].resetFields();
                      }
                    }}
                  >
                    <Form
                      form={form}
                      onFinish={(values) => {
                        handleSubmission(values);
                      }}
                      name="answer-form"
                      layout="vertical"
                    >
                      <Form.Item
                        name="answer"
                        label="Answer"
                        rules={[
                          {
                            required: true,
                            message: "Please input your question!",
                          },
                        ]}
                      >
                        <Input.TextArea rows={4} placeholder="Answer" />
                      </Form.Item>
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "row",
                          justifyContent: "flex-end",
                        }}
                      >
                        <Form.Item>
                          <Button
                            htmlType="reset"
                            onClick={() => {
                              // Update the isModalVisible property for this listing
                              const updatedListings = question.map((l) =>
                                l.question_id === item.question_id
                                  ? { ...l, isModalVisible: false }
                                  : l
                              );
                              setQuestion(updatedListings);
                            }}
                          >
                            Cancel
                          </Button>
                        </Form.Item>
                        <Form.Item>
                          <Button
                            type="primary"
                            htmlType="submit"
                            style={{ marginLeft: "10px" }}
                            onClick={() => {
                              setQuesID(item.question_id);
                            }}
                          >
                            Submit
                          </Button>
                        </Form.Item>
                      </div>
                    </Form>
                  </Form.Provider>
                </Modal>
              </Col>
            );
          })}
        </Row>
      </div>
    </div>
  );
};

export default Questions;
