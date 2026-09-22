import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
  MdPeople,
  MdHourglassEmpty,
  MdCheckCircle,
  MdCancel,
  MdVisibility,
  MdSearch,
} from "react-icons/md";
import Navbar from "../components/Navbar";
import API from "../api/axios";

const Dashboard = () => {
  const navigate = useNavigate();
  const [doctors, setDoctors] = useState([]);
  const [allDoctors, setAllDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("all");
  const [search, setSearch] = useState("");

  const fetchDoctors = async () => {
    setLoading(true);
    try {
      const { data } = await API.get("/admin/doctors");
      console.log("Doctors:", data);
      setAllDoctors(data.doctors || []);
      setDoctors(data.doctors || []);
    } catch (err) {
      console.error("Error:", err.response || err);
      toast.error("Failed to fetch doctors");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDoctors();
  }, []);

  useEffect(() => {
    let filtered = allDoctors;
    if (activeTab !== "all")
      filtered = filtered.filter((d) => d.status === activeTab);
    if (search)
      filtered = filtered.filter(
        (d) =>
          d.name.toLowerCase().includes(search.toLowerCase()) ||
          d.email.toLowerCase().includes(search.toLowerCase()),
      );
    setDoctors(filtered);
  }, [activeTab, search, allDoctors]);

  const counts = {
    all: allDoctors.length,
    pending: allDoctors.filter((d) => d.status === "pending").length,
    accepted: allDoctors.filter((d) => d.status === "accepted").length,
    rejected: allDoctors.filter((d) => d.status === "rejected").length,
  };

  const statusColors = {
    pending: { bg: "#FEF3C7", color: "#D97706" },
    accepted: { bg: "#D1FAE5", color: "#065F46" },
    rejected: { bg: "#FEE2E2", color: "#991B1B" },
  };

  const statCards = [
    {
      label: "Registered Doctors",
      value: counts.all,
      color: "#1E9E74",
      Icon: MdPeople,
    },
    {
      label: "Pending",
      value: counts.pending,
      color: "#D97706",
      Icon: MdHourglassEmpty,
    },
    {
      label: "Accepted",
      value: counts.accepted,
      color: "#065F46",
      Icon: MdCheckCircle,
    },
    {
      label: "Rejected",
      value: counts.rejected,
      color: "#991B1B",
      Icon: MdCancel,
    },
  ];

  const tabList = [
    { key: "all", label: "All", Icon: MdPeople, count: counts.all },
    {
      key: "pending",
      label: "Pending",
      Icon: MdHourglassEmpty,
      count: counts.pending,
    },
    {
      key: "accepted",
      label: "Verified Doctors",
      Icon: MdCheckCircle,
      count: counts.accepted,
    },
    {
      key: "rejected",
      label: "RejDeclined Applicationsected",
      Icon: MdCancel,
      count: counts.rejected,
    },
  ];

  return (
    <div style={{ minHeight: "100vh", background: "#F5F7FA" }}>
      <Navbar
        counts={counts}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />
      
      <div
        style={{
          marginLeft: "270px",
          padding: "32px 40px",
          minHeight: "100vh",
        }}
      >

             <div
style={{
display:'inline-flex',
alignItems:'center',
padding:'8px 16px',
borderRadius:'50px',
fontSize:'12px',
fontWeight:'600',
marginBottom:'16px',
background:'#ECFDF5',
border:'1px solid #A7F3D0',
color:'#1E9E74',
}}
>
🏥 Doctor Verification System
</div>
        <div style={{ marginBottom: "28px" }}>
          <h1
            style={{
              fontSize: "36px",
              fontWeight: "800",
              color: "#0F172A",
              marginBottom: "8px",
              letterSpacing: "-1px"
            }}
          >
           Doctor Verification Dashboard
          </h1>
          <p
            style={{
              fontSize: "15px",
              color: "#64748B",
            }}
          >
           Manage doctor onboarding, certificate verification and application approvals.
          </p>
        </div>
   

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4,1fr)",
            gap: "16px",
            marginBottom: "28px",
          }}
        >
          {statCards.map((s, i) => (
            <div
              key={i}
              style={{
     background: "#FFFFFF",
borderRadius: "16px",
border: "1px solid #E5E7EB",
boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
                display: "flex",
                alignItems: "center",
                gap: "16px",
              }}
            >
              <div
                style={{
                 width: "56px",
height: "56px",
borderRadius: "16px",
                  background: s.color + "18",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: s.color,
                }}
              >
                <s.Icon size={24} />
              </div>
              <div>
                <div
                  style={{
                    fontSize: "26px",
                    fontWeight: "700",
                    color: s.color,
                  }}
                >
                  {s.value}
                </div>
                <div
                  style={{ fontSize: "12px", color: "#64748B", fontWeight: "500" }}
                >
                  {s.label}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: "20px",
            flexWrap: "wrap",
            gap: "12px",
          }}
        >
          <div style={{ display: "flex", gap: "8px" }}>
            {tabList.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  padding: "8px 18px",
                  borderRadius: "20px",
                  border:
                    activeTab === tab.key ? "none" : "1.5px solid #e0e0e0",
                background:
activeTab === tab.key
? "linear-gradient(135deg,#1E9E74,#35C7A3)"
: "#fff",
                  color: activeTab === tab.key ? "#fff" : "#666",
                  fontSize: "13px",
                  fontWeight: "500",
                  cursor: "pointer",
                  transition: "all 0.2s",
                }}
              >
                <tab.Icon size={16} />
                {tab.label}
                <span
                  style={{
                    background:
                      activeTab === tab.key
                        ? "rgba(255,255,255,0.25)"
                        : "#f0f0f0",
                    color: activeTab === tab.key ? "#fff" : "#888",
                    borderRadius: "10px",
                    padding: "1px 7px",
                    fontSize: "11px",
                    fontWeight: "600",
                  }}
                >
                  {tab.count}
                </span>
              </button>
            ))}
          </div>
          <div style={{ position: "relative" }}>
            <MdSearch
              style={{
                position: "absolute",
                left: "12px",
                top: "50%",
                transform: "translateY(-50%)",
                color: "#aaa",
                fontSize: "18px",
              }}
            />
           <input
  placeholder="Search by name or email..."
  value={search}
  onChange={(e) => setSearch(e.target.value)}
  style={{
    padding: "9px 14px 9px 38px",
    border: "1px solid #DDEEE8",
    borderRadius: "14px",
    fontSize: "13px",
    outline: "none",
    width: "320px",
    background: "#fff",color: "#1a1a1a",
    boxShadow: "0 4px 12px rgba(30,158,116,0.06)",
    transition: "all 0.2s ease",
  }}
  onFocus={(e) => {
    e.target.style.borderColor = "#1E9E74";
    e.target.style.boxShadow =
      "0 0 0 4px rgba(30,158,116,0.15)";
  }}
  onBlur={(e) => {
    e.target.style.borderColor = "#DDEEE8";
    e.target.style.boxShadow = "none";
  }}
/>
          </div>
        </div>

        {loading ? (
          <div
            style={{
              textAlign: "center",
              padding: "60px",
              color: "#1E9E74",
              fontSize: "15px",
            }}
          >
            Loading...
          </div>
        ) : doctors.length === 0 ? (
          <div
            style={{
              textAlign: "center",
              padding: "60px",
              color: "#aaa",
              fontSize: "14px",
            }}
          >
            No doctors found
          </div>
        ) : (
          <div
            style={{
            background: "#FFFFFF",
borderRadius: "16px",
border: "1px solid #E5E7EB",
boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
              overflow: "hidden",
              transition: "all 0.25s ease"
            }}
          >
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ background: "#F6FCF9" }}>
                  {[
                    "#",
                    "Name",
                    "Email",
                    "Speciality",
                    "Reg. No.",
                    "Status",
                    "Action",
                  ].map((h) => (
                    <th
                      key={h}
                      style={{
                        padding: "13px 16px",
                        textAlign: "left",
                        fontSize: "11px",
                        fontWeight: "600",
                    color: "#64748B",
                        textTransform: "uppercase",
                        letterSpacing: "0.06em",
                        borderBottom: "1px solid #f0f0f0",
                      }}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {doctors.map((doc, i) => (
                  <tr
                    key={doc._id}
                    style={{
                      borderBottom: "1px solid #f9f9f9",
                      transition: "background 0.15s",
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.background = "#F3FCF8")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.background = "transparent")
                    }
                  >
                    <td
                      style={{
                        padding: "14px 16px",
                        fontSize: "13px",
                        color: "#999",
                      }}
                    >
                      {i + 1}
                    </td>
                    <td
                      style={{
                        padding: "14px 16px",
                        fontSize: "14px",
                        fontWeight: "500",
                        color: "#1a1a1a",
                      }}
                    >
                      {doc.name}
                    </td>
                    <td
                      style={{
                        padding: "14px 16px",
                        fontSize: "13px",
                        color: "#555",
                      }}
                    >
                      {doc.email}
                    </td>
                    <td
                      style={{
                        padding: "14px 16px",
                        fontSize: "13px",
                        color: "#555",
                      }}
                    >
                      {doc.speciality}
                    </td>
                    <td
                      style={{
                        padding: "14px 16px",
                        fontSize: "13px",
                        color: "#555",
                      }}
                    >
                      {doc.registrationNumber}
                    </td>
                    <td style={{ padding: "14px 16px" }}>
                      <span
                        style={{
                          display: "inline-block",
                          padding: "4px 12px",
                          borderRadius: "20px",
                          fontSize: "12px",
                          fontWeight: "600",
                          background: statusColors[doc.status]?.bg,
                          color: statusColors[doc.status]?.color,
                        }}
                      >
                        {doc.status}
                      </span>
                    </td>
                    <td style={{ padding: "14px 16px" }}>
                      <button
                        onClick={() => navigate("/doctor/" + doc._id)}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "5px",
                          padding: "7px 14px",
                       background: "#F3FCF8",
borderRadius: "12px",
boxShadow: "0 4px 10px rgba(30,158,116,0.08)",
                          color: "#1E9E74",
                          border: "1px solid #1E9E74",
                          fontSize: "12px",
                          fontWeight: "600",
                          cursor: "pointer",
                          transition: "all 0.2s",
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background = "#1E9E74";
                          e.currentTarget.style.color = "#fff";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = "#F3FCF8";
                          e.currentTarget.style.color = "#1E9E74";
                        }}
                      >
                        <MdVisibility style={{ fontSize: "15px" }} />
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
