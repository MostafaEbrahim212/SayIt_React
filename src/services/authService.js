import API from "./axiosInstance";

// تسجيل دخول
export const login = async (data) => {
  try {
    const res = await API.post("/auth/login", data);
    return res.data; // Return data to be handled by useAuth hook
  } catch (err) {
    const message = err.response?.data?.message || "Error logging in";
    throw new Error(message);
  }
};

// تسجيل مستخدم جديد
export const register = async (data) => {
  try {
    const res = await API.post("/auth/register", data);
    console.log(res.data)
    return res.data;
  } catch (err) {
    console.log(err)
    const message = err.response?.data?.message || "Error registering";
    throw new Error(message);
  }
};

export const logout = async () => {
  try {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("No token found");
    await API.post(
      "/auth/logout",
      {}, // body فاضية
      {
        headers: {
          authorization: `Bearer ${token}`, // التوكن يبعت صح
        },
      }
    );
    localStorage.removeItem("token");
    delete API.defaults.headers.common["Authorization"];
  } catch (err) {
    console.error("Logout failed:", err.message);
    alert(err.message);
  }
};