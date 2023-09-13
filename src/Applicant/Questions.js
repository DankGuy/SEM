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
import { QuestionCircleOutlined, InfoCircleOutlined } from "@ant-design/icons";
import { supabase } from "../supabase-client";
import Loading from "../Components/Loading";

const Questions = () => {
  const [question, setQuestion] = useState(null);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [fetchTrigger, setFetchTrigger] = useState(0);

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10); // Set your desired page size
  const [displayedQuestions, setDisplayedQuestions] = useState([]);

  const { Text } = Typography;
  const { form } = Form.useForm();

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

  const paginateData = (data, page, size) => {
    const startIndex = (page - 1) * size;
    const endIndex = startIndex + size;
    return data.slice(startIndex, endIndex);
  };

  const fetchData = async () => {
    if (!user?.applicant_id) {
      // Handle the case when applicant_id is not defined
      return;
    }

    const { data, error } = await supabase
      .from("question")
      .select("*")
      .order("created_at", { ascending: false })
      .order("answered_at", { ascending: false })
      .eq("author", user.applicant_id);

    if (error) {
      console.log(error);
      return;
    } else {
      // Manually sort the data based on the "status" column
      data.sort((a, b) => {
        const statusOrder = {
          pending: 2,
          answered: 1,
        };

        return statusOrder[a.status] - statusOrder[b.status];
      });

      const paginatedData = paginateData(data, currentPage, pageSize);

      setQuestion(data);
      setDisplayedQuestions(paginatedData);
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    // Update displayedQuestions when the page changes
    const paginatedData = paginateData(question, page, pageSize);
    setDisplayedQuestions(paginatedData);
  };

  const handleSubmission = async (values) => {
    const { data, error } = await supabase.from("question").insert([
      {
        question: values.question,
        author: user.applicant_id,
      },
    ]);

    if (error) {
      console.log(error);
      message.error(
        "Failed to post answer due to technical error! Contact support to assist you."
      );
      return;
    }

    setIsModalVisible(false);
    message.success("Question posted!");
    setFetchTrigger(fetchTrigger + 1);
  };

  useEffect(() => {
    setUser(getUser());
  }, []);

  useEffect(() => {
    fetchData();
  }, [user, fetchTrigger, currentPage, pageSize]);

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
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "flex-end",
          alignItems: "center",
          width: "100%",
          padding: "20px",
        }}
      >
        <Button type="primary" onClick={() => setIsModalVisible(true)}>
          Post Question
        </Button>
      </div>

      <div style={{ padding: "20px" }}>
        <Row gutter={[16, 16]}>
          {displayedQuestions?.map((item, index) => {
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
              </Col>
            );
          })}
        </Row>
        <Pagination
          current={currentPage}
          pageSize={pageSize}
          total={question?.length} // Total number of questions
          onChange={handlePageChange}
          style={{
            display: "flex",
            justifyContent: "flex-end",
            marginTop: "1rem",
          }}
        />
      </div>
      <Modal
        title="Post Question"
        open={isModalVisible}
        onCancel={handleCancel}
        footer={null}
      >
        <Form.Provider
          onFormFinish={(name, { values, forms }) => {
            if (name === "question-form") {
              forms["question-form"].resetFields();
            }
          }}
        >
          <Form
            form={form}
            name="question-form"
            layout="vertical"
            onFinish={handleSubmission}
          >
            <Form.Item
              name="question"
              label="Question"
              rules={[
                {
                  required: true,
                  message: "Please input your question!",
                },
              ]}
            >
              <Input.TextArea rows={4} placeholder="Question" />
            </Form.Item>
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "flex-end",
                marginBottom: "-20px",
              }}
            >
              <Form.Item>
                <Button
                  htmlType="reset"
                  onClick={handleCancel}
                  style={{
                    marginRight: "10px",
                    fontSize: "1rem",
                    height: "auto",
                  }}
                >
                  Cancel
                </Button>
              </Form.Item>
              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  style={{
                    marginRight: "10px",
                    fontSize: "1rem",
                    height: "auto",
                  }}
                >
                  Post
                </Button>
              </Form.Item>
            </div>
          </Form>
        </Form.Provider>
      </Modal>
    </div>
  );
};

export default Questions;
