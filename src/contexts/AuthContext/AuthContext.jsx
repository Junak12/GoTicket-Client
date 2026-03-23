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

export const AuthContext = createContext();

const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);


  const createUser = async (name, email, password, photoFile) => {
    if (!photoFile) throw new Error("Profile photo is required");

    setLoading(true);

    const result = await createUserWithEmailAndPassword(auth, email, password);

    const formData = new FormData();
    formData.append("image", photoFile);

    const imgbbApiKey = import.meta.env.VITE_IMGBB_API;
    const imgbbUrl = `https://api.imgbb.com/1/upload?key=${imgbbApiKey}`;

    const response = await axios.post(imgbbUrl, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    if (!response.data.success) throw new Error("Image upload failed");

    const photoURL = response.data.data.url;

    await updateProfile(result.user, {
      displayName: name,
      photoURL,
    });

    setLoading(false);
    return result;
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
  };

  return (
    <AuthContext.Provider value={authInfo}>{children}</AuthContext.Provider>
  );
};

export default AuthProvider;
