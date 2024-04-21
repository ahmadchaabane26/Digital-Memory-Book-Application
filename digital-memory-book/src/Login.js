import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "./firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { db } from "./firebase";
import { collection, query, where, getDocs } from "firebase/firestore";
import "./Interactable.css";
import backgroundImage from './Photos/triangle-mosaic.png'

function Login({ setIsAuth }) {
  const [username, setUsername] = useState("");
  const [loginText, setLoginText] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const handleClick = () => {
    navigate("/registration");
  };

  const handleLogin = () => {
    // Simulate a login by checking the username and password.
    signInWithEmailAndPassword(auth, username, password)
      .then((userCredential) => {
        // Signed in
        localStorage.setItem("isAuth", true);
        localStorage.setItem("x", 1);
        localStorage.setItem("uid", userCredential.user.uid);
        setIsAuth(true);

        const userRef = collection(db, "/users");
        const q = query(userRef, where("uid", "==", userCredential.user.uid));

        getUsers(q);
      })
      .catch(() => {
        setLoginText(
          "The email/password you entered is invalid or does not exist."
        );
      });
  };

  const getUsers = async (q) => {
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      const ddata = doc.data();
      if (ddata.code != "") {
        localStorage.setItem("code", ddata.code);
        const famRef = collection(db, "families");
        const q2 = query(famRef, where("code", "==", ddata.code));

        getFamilies(q2);

        navigate("/timeline");
      } else {
        navigate("/timelinecreation");
      }
    });
  };

  const getFamilies = async (q) => {
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach(async (user) => {
      const dddata = user.data();
      localStorage.setItem("webName", dddata.name);
    });
  };

  return (
    <div className="page">
    <div className="Login">
      <div className="box">
        <div>
          <h2>Login</h2>
          <p>{loginText}</p>
          <div>
            <input
              style={{
                width: "100%",
                padding: "10px",
                border: "1px solid #ccc",
                borderRadius: "20px",
                boxSizing: "border-box",
              }}
              type="text"
              placeholder="Email"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div>
            <input
              style={{
                width: "100%",
                padding: "10px",
                border: "1px solid #ccc",
                borderRadius: "20px",
                boxSizing: "border-box",
              }}
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <br></br>
          <button onClick={handleLogin} className="login-button">
            Login
          </button>
          <button onClick={handleClick} className="register-button">
            Register
          </button>
        </div>
      </div>
    </div>
    </div>
  );
}

export default Login;
