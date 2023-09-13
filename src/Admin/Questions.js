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
  Pagination,
} from "antd";
import {
  CommentOutlined,
  QuestionCircleOutlined,
  InfoCircleOutlined,
} from "@ant-design/icons";
import { supabase } from "../supabase-client";
import Loading from "../Components/Loading";

const Questions = () => {
  const [question, setQuestion] = useState([]);
  const [quesID, setQuesID] = useState(null);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [fetchTrigger, setFetchTrigger] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10); // Set your desired page size
  const [modalVisibility, setModalVisibility] = useState({});

  const { Text } = Typography;
  const { form } = Form.useForm();

  const getUser = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (user) {
      let { data, error } = await supabase
        .from("admin")
        .select("*")
        .eq("admin_id", user.id);

      if (error) {
        console.log(error);
        return;
      }
      setUser(data[0]);
    }
    setIsLoading(false);
  };

  const paginateData = (data, page, size) => {
    const startIndex = (page - 1) * size;
    const endIndex = startIndex + size;
    return data.slice(startIndex, endIndex);
  };

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

      setQuestion(sortedListings);
      setIsLoading(false);
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleSubmission = async (values) => {
    const { error } = await supabase
      .from("question")
      .update([
        {
          answer: values.answer,
          status: "answered",
          answered_at: new Date().toISOString(),
          answer_by: user.admin_id,
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
    setUser(getUser());
  }, []);

  useEffect(() => {
    fetchData();
  }, [user, fetchTrigger]);

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
          {paginateData(question, currentPage, pageSize).map((item, index) => {
            return (
              <Col key={item.question_id} xs={24} sm={12}>
                <Card
                  title={
                    <Text
                      ellipsis={{
                        tooltip: item.question,
                      }}
                      style={{ fontSize: "1rem" }}
                    >
                      <span style={{ marginRight: "10px" }}>
                        <Tooltip title="Question">
                          <QuestionCircleOutlined />
                        </Tooltip>
                      </span>
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
                        // Open the modal for the selected question
                        setModalVisibility({
                          ...modalVisibility,
                          [item.question_id]: true,
                        });
                        setQuesID(item.question_id);
                      }}
                      {...(item.status === "answered" && { disabled: true })}
                    >
                      <CommentOutlined />
                      Answer
                    </Button>,
                  ]}
                  headStyle={{
                    backgroundColor: "#D5DEF5",
                    padding: "0.5em 1em",
                  }}
                  bodyStyle={{
                    backgroundColor: "#F0F5FF",
                    padding: "1em",
                  }}
                >
                  <span
                    style={{
                      marginRight: "10px",
                      marginLeft: "2px",
                      fontSize: "1rem",
                    }}
                  >
                    <Tooltip title="Answer">
                      <InfoCircleOutlined />
                    </Tooltip>
                  </span>
                  {item.answer}
                </Card>
                <Modal
                  title={item.question}
                  open={modalVisibility[item.question_id] || false}
                  onCancel={() => {
                    // Close the modal for the selected question
                    setModalVisibility({
                      ...modalVisibility,
                      [item.question_id]: false,
                    });
                    setQuesID(null); // Clear the question ID when the modal is closed
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
                              // Close the modal for the selected question
                              setModalVisibility({
                                ...modalVisibility,
                                [item.question_id]: false,
                              });
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
                              setModalVisibility({
                                ...modalVisibility,
                                [item.question_id]: false,
                              });
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
        <Pagination
          current={currentPage}
          pageSize={pageSize}
          total={question?.length}
          onChange={handlePageChange}
          style={{
            display: "flex",
            justifyContent: "flex-end",
            marginTop: "1rem",
          }}
        />
      </div>
    </div>
  );
};

export default Questions;
