import { createContext, useEffect, useState } from "react";
import useAxios from "../../hooks/Axios/useAxios.jsx";
import { useAuth } from "../../hooks/Auth/useAuth.jsx";


export const RoleContext = createContext("user");

export const RoleProvider = ({ children }) => {
  const { user } = useAuth();
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);
  const instance = useAxios();

  useEffect(() => {
    if (user?.email) {
      setLoading(true);
      instance
        .get(`/user/${user.email}`)
        .then((res) => {
          if (res.data.success && res.data.role) setRole(res.data.role);
        })
        .catch(console.error)
        .finally(() => setLoading(false));
    } else {
      setRole("user");
      setLoading(false);
    }
  }, [user?.email]);

  if (loading) return <div>Loading...</div>; 

  return <RoleContext.Provider value={role}>{children}</RoleContext.Provider>;
};
