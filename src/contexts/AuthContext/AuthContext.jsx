import React, { createContext, useEffect, useState } from "react";
import axios from "axios";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  GoogleAuthProvider,
  signInWithPopup,
  onAuthStateChanged,
  updateProfile,
} from "firebase/auth";
import app from "../../Firrbase/firebase.init";
import useAxios from "../../hooks/Axios/useAxios";

export const AuthContext = createContext();

const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const instance = useAxios();

  const createUser = async (name, email, password, photoFile) => {
    setLoading(true);

    try {
      const result = await createUserWithEmailAndPassword(
        auth,
        email,
        password,
      );

      let photoURL = "";

      if (photoFile) {
        const formData = new FormData();
        formData.append("image", photoFile);

        const imgbbApiKey = import.meta.env.VITE_IMGBB_API;
        const imgbbUrl = `https://api.imgbb.com/1/upload?key=${imgbbApiKey}`;

        try {
          const response = await axios.post(imgbbUrl, formData);
          photoURL = response.data.data.url;
        } catch (err) {
          console.log("Image upload failed, continuing...");
        }
      }

      await updateProfile(result.user, {
        displayName: name,
        photoURL,
      });

      return {
        user: {
          ...result.user,
          displayName: name,
          photoURL,
        },
      };
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signInUser = (email, password) => {
    setLoading(true);
    return signInWithEmailAndPassword(auth, email, password);
  };

  const googleLogin = () => {
    setLoading(true);
    return signInWithPopup(auth, googleProvider);
  };

  const logOut = () => {
    setLoading(true);
    return signOut(auth);
  };

  const updateUserProfile = async (name, photoFile) => {
    try {
      setLoading(true);
      let photoURL = user?.photoURL;
      if (photoFile) {
        const formData = new FormData();
        formData.append("image", photoFile);
        const imgbbApiKey = import.meta.env.VITE_IMGBB_API;
        const imgbbUrl = `https://api.imgbb.com/1/upload?key=${imgbbApiKey}`;
        const response = await axios.post(imgbbUrl, formData);
        if (!response.data.success) {
          throw new Error("Image upload failed");
        }
        photoURL = response.data.data.url;
      }

      await updateProfile(auth.currentUser, {
        displayName: name,
        photoURL,
      });

      setUser({
        ...auth.currentUser,
        displayName: name,
        photoURL,
      });

      await instance.patch(`/update-user/${user.email}`, {
        name,
        photo: photoURL,
      });
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const authInfo = {
    user,
    loading,
    createUser,
    signInUser,
    googleLogin,
    logOut,
    updateUserProfile,
  };

  return (
    <AuthContext.Provider value={authInfo}>{children}</AuthContext.Provider>
  );
};

export default AuthProvider;
