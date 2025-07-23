
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function Logout() {
  const navigate = useNavigate();

  useEffect(() => {
    const logout = async () => {
      try {
        const customer = JSON.parse(localStorage.getItem("customer"));
        const admin = JSON.parse(localStorage.getItem("admin"));
        const email = customer?.email || admin?.email;

        if (email) {
          await axios.post("http://localhost:8080/api/customers/logout", { email });
        }

        localStorage.removeItem("customer");
        localStorage.removeItem("admin");
        navigate("/login");
      } catch (e) {
        console.error("Logout failed:", e);
        navigate("/login");
      }
    };

    logout();
  }, [navigate]);

  return null; 
}
