import React, { useEffect, useState } from "react";
import { NavLink, useParams, useLocation } from "react-router-dom";
import { Nav } from "reactstrap";
import styles from "../../assets/css/sidebarStyle.module.css";
import logo from "../../assets/img/paw-icon.png";
import routes from "routes";
import { FaHeartbeat, FaUserMd } from "react-icons/fa";
import jwtDecode from "jwt-decode";

function Sidebar(props) {
  const [userRole, setUserRole] = useState();
  const [sidebarStyle, setSidebarStyle] = useState();
  const [iconStyle, setIconStyle] = useState();
  const [sideBarActive, setSideBarActive] = useState(false);

  const location = useLocation();
  const path = location.pathname.split("/")[2];

  const toggleSideBar = () => {
    setSideBarActive(!sideBarActive);
  };

  useEffect(() => {
    if (sideBarActive) {
      setSidebarStyle(styles.show_menu);
      setIconStyle(styles.rotate_icon);
    } else {
      setSidebarStyle(null);
      setIconStyle(null);
    }
  }, [sideBarActive]);

  useEffect(() => {
    var token = localStorage.getItem("token");
    var decodedToken = jwtDecode(token);
    var role = decodedToken.authorities[0].authority;
    setUserRole(role);
  });

  const linkActive = (e) => {
    if(path == e){
      return styles.active_link
    }
  }


  return (
    <div className={styles.body} onMouseOver={()=>{setSideBarActive(true)}} onMouseLeave={()=>{setSideBarActive(false)}}>
      <div className={styles.nav + " " + sidebarStyle} id="nav">
        <nav className={styles.nav__content}>
          <div
            className={styles.nav__toggle + " " + iconStyle}
            id="nav_toggle"
            onClick={() => {
              toggleSideBar();
            }}
          >
            <i className={styles.bx + " bx bx-chevron-right"}></i>
          </div>

            
               <a href="#" style={{"width":"200px"}} className={styles.nav__logo}>
            <div>
              <img src={logo} width={30}/>
            </div>
{
              sideBarActive?
            <span className={styles.nav__logo_name}>{userRole === "ROLE_VET" ? "VET PANEL" : userRole === "ROLE_ADMIN" ? "ADMIN PANEL":""}</span>:""}
          </a>
            
         
          <div className="d-flex justify-content-center align-items-center">
            <div className={styles.nav__list}>
            <NavLink
              to={"animals"}
              className={linkActive("animals") + " " + styles.nav__link}
            >
              <i>
                <FaHeartbeat />
              </i>
              {sideBarActive?<span className={styles.nav__name}>Animals</span>:""}
            </NavLink>
            {routes.map((prop,key) => {
              return (
                  <NavLink
                  key={key}
                    to={prop.path}
                    className={linkActive(prop.path) + " " + styles.nav__link}
                  >
                    <i>{prop.icon}</i>
                  {sideBarActive?  <span className={styles.nav__name}> {prop.name}</span>:""}
                  </NavLink>
              );
            })}
            {
              userRole=="ROLE_ADMIN"?
              <NavLink
              to={"vets"}
              className={linkActive("vets") + " " + styles.nav__link}
            >
              <i>
                <FaUserMd/>
              </i>
              {sideBarActive?<span className={styles.nav__name}>Vets</span>:""}
            </NavLink>:""
            } 
          </div>
          </div>
          
        </nav>
      </div>
    </div>
  );
}

export default Sidebar;
