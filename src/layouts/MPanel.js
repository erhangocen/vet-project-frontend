import React, {useState, useEffect, useLocation} from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../components/Bars/Sidebar.js";
import Header from "components/Bars/Navbar.js";
import "../assets/css/photoUpdateStyle.css"
import styles from "../assets/css/mainPanelStyle.module.css"
import NoPage from "views/NoPage.js";
import ScrollTop from '../components/Navigators/ScrollToTop'

export default function MPanel(props) {
  const[token,setToken] = useState();
  useEffect(() => {
    setToken(localStorage.getItem("token"))
  },[token]);

  return (
    <div className="wrapper">
      {token?
      <div>
        <Sidebar/>
        <Header/>
      <div className={styles.main_panel +" main-panel d-flex justify-content-center"}>
          <Outlet/>
          <ScrollTop {...props}/>
      </div>
      </div>
      :<NoPage/>}
    </div>
  );
}
