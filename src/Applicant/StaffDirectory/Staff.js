import { Descriptions, Skeleton } from "antd";
import { Link, useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "../../supabase-client";
import "./Staff.css";

function Staff() {
  const [fetchStaffError, setFetchStaffError] = useState(null);
  const [staffDetail, setStaffDetail] = useState(null);
  const [searchParams, setSearchParams] = useSearchParams();
  const id = searchParams.get("id");

  useEffect(() => {
    const fetchStaffDetail = async () => {
      const { data, error } = await supabase.rpc("searchstaff", { idarg: id });

      if (error) {
        setFetchStaffError("could not fetch staff details");
        setStaffDetail(null);
        console.log(error);

        return;
      }
      if (data) {
        console.log(data);
        data[0]["roleSplit"] = data[0].role.split(", ");
        setStaffDetail(data[0]);
        setFetchStaffError(null);
      }
    };

    fetchStaffDetail();
  }, [id]);

  let items = null;
  if (staffDetail) {
    console.log(staffDetail);

    let i = 1;
    items = [
      {
        key: "1",
        children: (
          <div>
            {staffDetail.roleSplit.map((role) => {
              return (
                <div key={i++} className="role">
                  {role}
                </div>
              );
            })}
          </div>
        ),
      },
      {
        key: "2",
        label: "Department",
        children: <div>{staffDetail.department}</div>,
      },
      {
        key: "3",
        label: "Education",
        children: <div>{staffDetail.education}</div>,
      },
      {
        key: "4",
        label: "Contact",
        children: (
          <a href={`mailto:${staffDetail.contact}`}>{staffDetail.contact}</a>
        ),
      },
      {
        key: "5",
        label: "Specialization",
        children: <div>{staffDetail.specialization}</div>,
      },
      {
        key: "6",
        label: "Area of Interest",
        children: <div>{staffDetail["areaOfInterest"]}</div>,
      },
    ];
  }

  console.log("hi");

  return (
    <div style={{ padding: "40px" }}>
      <div className="staffDetailContainer">
        {fetchStaffError && <p>{fetchStaffError}</p>}
        {staffDetail ? (
          <div style={{ padding: "40px" }}>
            <div className="staffDescriptionContainer">
              <Descriptions
                title={<strong>{staffDetail.name}</strong>}
                layout="horizontal"
                items={items}
                column={1}
              />
              <div id="staffImageDiv">
                <img src={staffDetail.imageUrl} alt="Staff" />
              </div>
            </div>
          </div>
        ) : (
          <div className="staffDescriptionContainer">
            <Skeleton active style={{ marginRight: 20 }} />
            <Skeleton.Image active style={{ height: "100%", width: 120 }} />
          </div>
        )}
      </div>
    </div>
  );
}

export default Staff;
