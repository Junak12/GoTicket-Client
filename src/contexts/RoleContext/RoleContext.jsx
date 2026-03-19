import { createContext, useEffect, useState } from "react";
import useAxios from "../../hooks/Axios/useAxios.jsx";
import { useAuth } from "../../hooks/Auth/useAuth.jsx";

export const RoleContext = createContext("user");

export const RoleProvider = ({ children }) => {
  const { user } = useAuth;
  const [role, setRole] = useState("user");
  const instance = useAxios();;

  useEffect(() => {
    if (user?.email) {
      instance
        .get(`/users/${user.email}`)
        .then((res) => {
          if (res.data.success && res.data.role) setRole(res.data.role);
        })
        .catch((err) => console.error(err));
    }
  }, [user]);

  return <RoleContext.Provider value={role}>{children}</RoleContext.Provider>;
};
