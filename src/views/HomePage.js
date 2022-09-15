import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import styles from "../assets/css/homePageStyle.module.css"

export default function HomePage() {
 
  const [token, setToken] = useState();
  useEffect(() => {
    setToken(localStorage.getItem("token"))
  });

  return (
    <main className={styles.main}>
      <div className={styles.islands}>
        <div className={styles.islands__container + " " + styles.bd_container + " bd-container"}>
          <div className={styles.islands__data}>
            <h2 className={styles.islands__subtitle}>veterinerproject.tk</h2>
            <h1 className={styles.islands__title}>FOR VETERINARY</h1>
            <p className={styles.islands__description}>
            Are you ready to experience an advanced veterinary app?
            </p>
            <Link to={token?"mPanel":"login"} className={styles.islands__button}>
              Login to System ➜
            </Link>
          </div>
        </div>
      </div>
    </main>   
  );
}
