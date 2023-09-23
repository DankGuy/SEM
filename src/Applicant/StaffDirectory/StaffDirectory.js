import StaffCategory from "./StaffCategory";
import SearchBar from "./SearchBar";
import { supabase } from "../../supabase-client";
import { useEffect, useState } from "react";
import { Skeleton } from "antd";

function StaffDirectory() {
  const [fetchError, setFetchError] = useState(null);
  const [allStaffDetails, setAllStaffDetails] = useState();
  const [staffDetails, setStaffDetails] = useState();
  const [departments, setDepartments] = useState();
  const [role, setRole] = useState(null);
  const [specialization, setSpecialization] = useState(null);
  const [areaOfInterest, setAreaOfInterest] = useState(null);

  useEffect(() => {
    const fetchStaffDetails = async () => {
      const { data, error } = await supabase.from("staffdetails").select();

      if (error) {
        setFetchError("could not fetch staff details");
        setStaffDetails(null);
        setAllStaffDetails(null);
        console.log(error);

        return;
      }
      if (data) {
        setStaffDetails(data);
        setAllStaffDetails(data);
        setFetchError(null);
      }
    };

    const fetchDepartments = async () => {
      const { data, error } = await supabase.from("department").select();

      if (error) {
        setFetchError("could not fetch department data");
        setDepartments(null);
        console.log(error);

        return;
      }
      if (data) {
        setDepartments(data);
        setFetchError(null);
      }
    };

    const fetchRole = async () => {
      const { data, error } = await supabase.from("rolefilter").select();

      if (error) {
        setFetchError("could not fetch role data");
        setRole(null);
        console.log(error);

        return;
      }
      if (data) {
        setRole(data);
        setFetchError(null);
      }
    };

    const fetchSpecialization = async () => {
      const { data, error } = await supabase
        .from("specializationfilter")
        .select();

      if (error) {
        setFetchError("could not fetch Specialization data");
        setSpecialization(null);
        console.log(error);

        return;
      }
      if (data) {
        setSpecialization(data);
        setFetchError(null);
      }
    };

    const fetchAreaOfInterest = async () => {
      const { data, error } = await supabase.from("interestfilter").select();

      if (error) {
        setFetchError("could not fetch interest data");
        setAreaOfInterest(null);
        console.log(error);

        return;
      }
      if (data) {
        setAreaOfInterest(data);
        setFetchError(null);
      }
    };

    fetchStaffDetails();
    fetchDepartments();
    fetchRole();
    fetchSpecialization();
    fetchAreaOfInterest();
  }, []);

  const filterObjectArr = [
    {
      filterType: "Role",
      filterData: role,
    },
    {
      filterType: "Area of Interest",
      filterData: areaOfInterest,
    },
    {
      filterType: "Specialization",
      filterData: specialization,
    },
  ];

  const onSearch = (value) => {
    let newStaffDetails = allStaffDetails;
    if (value.Name) {
      newStaffDetails = allStaffDetails.filter((staff) => {
        return staff.name.toLowerCase().includes(value.Name.toLowerCase());
      });
    }

    if (value.Role) {
      newStaffDetails = newStaffDetails.filter((staff) => {
        const match = staff.roleid.map((roleid, index, arr) => {
          if (value.Role.includes(roleid)) {
            return true;
          } else if (index === arr.length - 1) {
            return false;
          }
        });
        return match.includes(true);
      });
    }

    if (value.Specialization) {
      newStaffDetails = newStaffDetails.filter((staff) => {
        const match = staff.specializationid.map(
          (specializationid, index, arr) => {
            if (value.Specialization.includes(specializationid)) {
              return true;
            } else if (index === arr.length - 1) {
              return false;
            }
          }
        );
        return match.includes(true);
      });
    }

    if (value["Area of Interest"]) {
      newStaffDetails = newStaffDetails.filter((staff) => {
        const match = staff.interestid.map((interestid, index, arr) => {
          if (value["Area of Interest"].includes(interestid)) {
            return true;
          } else if (index === arr.length - 1) {
            return false;
          }
        });
        return match.includes(true);
      });
    }

    setStaffDetails(newStaffDetails);
  };

  return (
    <div className="staffDirectoryContainer" style={{ padding: "30px" }}>
      <div style={{ flex: 1 }}>
        {fetchError && <p>{fetchError}</p>}
        {staffDetails ? (
          <StaffCategory department={departments} staff={staffDetails} />
        ) : (
          <Skeleton active />
        )}
      </div>
      <div style={{ width: 400 }}>
        <SearchBar filterObjectArr={filterObjectArr} onSearch={onSearch} />
      </div>
    </div>
  );
}

export default StaffDirectory;
