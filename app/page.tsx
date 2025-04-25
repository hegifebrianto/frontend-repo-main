"use client";
import { useEffect, useState } from "react";
import { UserAPI } from "../apis/userApi";
import { useRouter } from "next/navigation";

interface UserData {
  uid: string;
  displayName: string;
  email: string;
  phoneNumber: string;
  photoUrl: string;
  name: string;
  password: string;
  lastUpdated: {
    _seconds: number;
    _nanoseconds: number;
  };
}

export default function MainPage() {
  const router = useRouter();
  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(false);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      const storedToken = localStorage.getItem("token");
      const storedUid = localStorage.getItem("uid");

      if (!storedToken || !storedUid) {
        console.log("User not logged in or token missing");
        return;
      }

      setToken(storedToken);

      try {
        const response = await UserAPI.fetchUser(storedUid, storedToken);
        setUser({ ...response.data, uid: storedUid });
      } catch (error) {
        console.error("Error fetching user:", error);
      }
    };

    fetchData();
  }, []);

  const handleUpdate = async () => {
    if (!user || !token) return;

    setLoading(true);
    try {
      await UserAPI.updateUser(user, token);
      alert(" Profile updated!");
    } catch (err) {
      console.error(" Failed to update user:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!user) return;
    const { name, value } = e.target;
    setUser({ ...user, [name]: value });
  };

  return (
    <div style={{ padding: "2rem", fontFamily: "Arial, sans-serif" }}>
      <h1 style={{ textAlign: "center" }}>User Dashboard</h1>
      <div style={{ textAlign: "center", marginBottom: "1.5rem" }}>
        <button
          onClick={() => router.push("/login")}
          style={{
            background: "#ccc",
            border: "none",
            padding: "8px 16px",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          NAVIGATE TO LOGIN
        </button>
      </div>

      {user && (
        <div
          style={{
            margin: "0 auto",
            maxWidth: "400px",
            border: "1px solid #ddd",
            borderRadius: "8px",
            padding: "24px",
            background: "#f9f9f9",
          }}
        >
          <div style={{ textAlign: "center", marginBottom: "16px" }}>
            <img
              src={user.photoUrl}
              alt="User"
              width={100}
              height={100}
              style={{ borderRadius: "50%" }}
            />
          </div>

          {[
            { label: "Name", key: "name" },
            { label: "Display Name", key: "displayName" },
            { label: "Email", key: "email", type: "email" },
            { label: "Phone", key: "phoneNumber" },
            { label: "Photo URL", key: "photoUrl" },
          ].map(({ label, key, type }) => (
            <div key={key} style={{ marginBottom: "12px" }}>
              <label style={{ fontWeight: 600, display: "block", marginBottom: "4px" }}>
                {label}
              </label>
              <input
                type={type || "text"}
                name={key}
                value={(user as never)[key]}
                onChange={handleChange}
                style={{
                  width: "100%",
                  padding: "8px",
                  borderRadius: "4px",
                  border: "1px solid #ccc",
                  fontSize: "14px",
                }}
              />
            </div>
          ))}

          <button
            onClick={handleUpdate}
            disabled={loading}
            style={{
              width: "100%",
              marginTop: "1rem",
              padding: "10px",
              backgroundColor: "#0070f3",
              color: "#fff",
              border: "none",
              borderRadius: "5px",
              fontWeight: "bold",
              cursor: loading ? "not-allowed" : "pointer",
              opacity: loading ? 0.7 : 1,
              transition: "0.3s",
            }}
          >
            {loading ? "Saving..." : "Save Changes"}
          </button>
        </div>
      )}
    </div>
  );
}
