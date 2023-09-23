import React, { useState, useEffect } from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import { Button, CardActionArea, CardActions } from "@mui/material";
import { supabase } from "../../supabase-client";
import { Form, Input, Checkbox, List } from "antd";
import ProgrammeDetailsModal from "./details";
import "./programmeMain.css";
import ComparisonModal from "./comparisonModal";
import { createRoot } from "react-dom/client";
import { useNavigate } from "react-router-dom";

let loggedUser = null;

const ProgrammeMain = ({ searchTerm, filterType }) => {
  const [programmes, setProgrammes] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedProgramme, setSelectedProgramme] = useState(null);
  const [user, setUser] = useState(null);
  const [compareMode, setCompareMode] = useState(false);
  const [selectedForComparison, setSelectedForComparison] = useState([]);
  const [selectedProgrammeDetails, setSelectedProgrammeDetails] = useState([]);

  useEffect(() => {
    async function fetchProgrammes() {
      try {
        const { data, error } = await supabase.from("programme").select("*");
        if (error) {
          throw error;
        } else {
          setProgrammes(data);
        }
      } catch (error) {
        alert(error.message);
      }
    }
    fetchProgrammes();
  }, []);

  useEffect(() => {
    let filteredProgrammes = programmes;

    if (filterType) {
      filteredProgrammes = filteredProgrammes.filter(
        (item) => item.studyLevel.toLowerCase() === filterType.toLowerCase()
      );
    }

    if (searchTerm) {
      filteredProgrammes = filteredProgrammes.filter((item) =>
        item.programme_name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredData(filteredProgrammes);
  }, [searchTerm, programmes, filterType]);

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
  };

  useEffect(() => {
    setUser(getUser());
  }, []);

  useEffect(() => {
    loggedUser = user;
    console.log(loggedUser);
  }, [user]);

  useEffect(() => {
    async function fetchAdditionalData() {
      try {
        const { data, error } = await supabase.from("applicant").select("*");

        if (error) {
          throw error;
        } else {
          // Process the data here
          console.log(data);
          // Update state or do something with the data
        }
      } catch (error) {
        alert(error.message);
      }
    }

    fetchAdditionalData();
  }, []);

  console.log(programmes);

  const openModal = (programme) => {
    setSelectedProgramme(programme);
    setShowModal(true);
    console.log("modal opened");
    console.log(programme);
  };

  const closeModal = () => {
    setSelectedProgramme(null);
    setShowModal(false);
  };

  const toggleCompareMode = () => {
    setCompareMode(!compareMode);
    setSelectedForComparison([]);
  };

  const handleCheckboxChange = (programId) => {
    setSelectedForComparison((prev) => {
      if (prev.includes(programId)) {
        return prev.filter((id) => id !== programId);
      } else {
        // Limit the selection to 2 programs
        return prev.length < 2 ? [...prev, programId] : prev;
      }
    });
  };

  const compareProgrammes = () => {
    const modalRoot = document.getElementById("root");

    const modal = document.createElement("div");
    modal.className = "modal";
    modalRoot.appendChild(modal);
    modal.style.display = "block";

    createRoot(modal).render(
      <ComparisonModal
        selectedProgrammeDetails={selectedProgrammeDetails} // Pass the selected programme details
        onClose={() => modalRoot.removeChild(modal)}
      />
    );
  };

  // Function to fetch details of selected programmes
  const fetchSelectedProgrammeDetails = async () => {
    const details = await Promise.all(
      selectedForComparison.map(async (programId) => {
        const { data, error } = await supabase
          .from("programme")
          .select("*")
          .eq("id", programId);
        if (error) {
          console.error(error);
          return null;
        } else {
          return data[0];
        }
      })
    );
    setSelectedProgrammeDetails(details.filter(Boolean));
  };

  useEffect(() => {
    if (compareMode) {
      fetchSelectedProgrammeDetails();
    } else {
      setSelectedProgrammeDetails([]);
    }
  }, [compareMode, selectedForComparison]);

  return (
    <div className="container">
      <Button onClick={toggleCompareMode}>
        {compareMode ? "Exit Compare Mode" : "Compare Programmes"}
      </Button>
      <div className={compareMode ? "programme-row" : "card-container"}>
        {compareMode ? (
          <List
            dataSource={filteredData}
            renderItem={(programme) => (
              <List.Item>
                <Checkbox
                  checked={selectedForComparison.includes(programme.id)}
                  onChange={() => handleCheckboxChange(programme.id)}
                  disabled={
                    selectedForComparison.length >= 2 &&
                    !selectedForComparison.includes(programme.id)
                  }
                >
                  {programme.programme_name}
                </Checkbox>
              </List.Item>
            )}
          />
        ) : (
          filteredData.map((programme) => (
            <div className="card-item">
              <Card
                sx={{ maxWidth: 345, minHeight: 355 }}
                style={{ marginBottom: 50 }}
              >
                <CardActionArea>
                  <CardMedia
                    component="img"
                    height="140"
                    image={programme.programme_img}
                    alt={programme.programme_name}
                  />
                  <CardContent>
                    <Typography
                      gutterBottom
                      variant="h5"
                      component="div"
                      sx={{
                        fontSize: "18px", // Adjust the font size
                      }}
                    >
                      {programme.programme_name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {programme.shortDesc}
                    </Typography>
                  </CardContent>
                </CardActionArea>
                <CardActions>
                  <Button
                    size="small"
                    color="primary"
                    onClick={() => openModal(programme)}
                  >
                    Learn More
                  </Button>
                </CardActions>
              </Card>
            </div>
          ))
        )}
        {!compareMode && selectedProgramme && (
          <ProgrammeDetailsModal
            programDetails={selectedProgramme}
            closeModal={closeModal}
            showModal={showModal}
            eligibilityList={loggedUser.eligibilityList}
            selectedProgramId={selectedProgramme.id}
          />
        )}
        {compareMode && (
          <Button
            onClick={compareProgrammes}
            disabled={selectedForComparison.length !== 2}
          >
            Compare Programmes
          </Button>
        )}
      </div>
    </div>
  );
};

const SearchProgrammes = () => {
  const [form] = Form.useForm();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState(null); // Added this line
  const navigate = useNavigate();

  const handleSearchChange = (changedValues) => {
    setSearchTerm(changedValues.Name || ""); // Update searchTerm as user types
  };

  const handleFilterClick = (filterType) => {
    console.log(filterType);
    setFilterType(filterType);
  };

  const handleShowAllClick = () => {
    setFilterType(null);
  };

  return (
    <div className="container">
      <div>
        <Form
          form={form}
          onValuesChange={handleSearchChange}
          className="searchBox"
        >
          <Form.Item name={"Name"} style={{ width: "400px" }}>
            <Input placeholder="Search Programme" autoComplete="name" />
          </Form.Item>
        </Form>
        <div style={{ display: "flex" }} className="category">
          <Button onClick={() => handleFilterClick("bachelor")}>
            Bachelor
          </Button>
          <Button onClick={() => handleFilterClick("Diploma")}>Diploma</Button>
          <Button onClick={handleShowAllClick}>Show All Programmes</Button>
          <Button onClick={() => navigate(-1)}>Return Previous Page</Button>
        </div>
        <ProgrammeMain searchTerm={searchTerm} filterType={filterType} />
      </div>
    </div>
  );
};

export default SearchProgrammes;
