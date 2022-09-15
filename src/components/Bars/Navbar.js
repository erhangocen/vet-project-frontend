import React, {useEffect, useState} from "react";
import {
  Collapse,
  Navbar,
  NavbarToggler,
  NavbarBrand,
  Nav,
  NavItem,
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  Container,
  InputGroup,
  InputGroupText,
  InputGroupAddon,
  Input,
  Accordion
} from "reactstrap";
import Avatar from '@mui/material/Avatar';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Tooltip from '@mui/material/Tooltip';
import PersonAdd from '@mui/icons-material/PersonAdd';
import Settings from '@mui/icons-material/Settings';
import Logout from '@mui/icons-material/Logout';
import jwt from 'jwt-decode'

import routes from "routes.js";
import { Person, PersonOff } from "@mui/icons-material";
import jwtDecode from "jwt-decode";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export default function Header() {

  const [anchorEl, setAnchorEl] = useState(null);
  const [userName, setUserName] = useState();
  const [userRole, setUserRole] = useState([]);

  let navigate = useNavigate();

  useEffect(() => {
    var token = localStorage.getItem("token");
    var decodedToken = jwtDecode(token)
    var role = decodedToken.authorities[0].authority;
    var username = decodedToken.sub
    setUserRole(role);
    setUserName(username);
  }, []);

  const open = Boolean(anchorEl);
  
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const logOut = () => {
    localStorage.removeItem("token")
    toast.warn("exiting", {
      position: toast.POSITION.TOP_RIGHT,
      autoClose: 1000,
    })
    setTimeout(()=>{navigate("/login")},1000)
  }

  return (
    <Navbar>
      <Container fluid>
      <div className="d-flex align-content-center align-items-center" style={{"float":"right"}}>
        <div className="mt-3">{userName}</div>
       </div>
            <Tooltip disableHoverListener disableTouchListener>
              <IconButton
                onClick={handleClick}
                className="mt-1 mr-2"
                style={{"float":"right"}}
                size="small"
                sx={{ ml: 2 }}
                aria-controls={open ? 'account-menu' : undefined}
                aria-haspopup="true"
                aria-expanded={open ? 'true' : undefined}
              >
            <Avatar sx={{ width: 43, height: 43 }}>
            </Avatar>
          </IconButton>
        </Tooltip>
        <Menu
        anchorEl={anchorEl}
        id="account-menu"
        open={open}
        onClose={handleClose}
        onClick={handleClose}
        PaperProps={{
          elevation: 0,
          sx: {
            overflow: 'visible',
            filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
            mt: 1.5,
            '& .MuiAvatar-root': {
              width: 32,
              height: 32,
              ml: -0.5,
              mr: 1,
            },
            '&:before': {
              content: '""',
              display: 'block', 
              position: 'absolute',
              top: 0,
              right: 14,
              width: 10,
              height: 10,
              bgcolor: 'background.paper',
              transform: 'translateY(-50%) rotate(45deg)',
              zIndex: 0,
            },
          },
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <MenuItem>
          <Avatar /> {userName}
        </MenuItem>
        <Divider />
        <MenuItem>
          <ListItemIcon>
            <Person fontSize="small" />
          </ListItemIcon>
           {userRole}
        </MenuItem>
        <MenuItem onClick={()=>{logOut()}}>
          <ListItemIcon>
            <Logout fontSize="small" />
          </ListItemIcon>
          Logout
        </MenuItem>
      </Menu>

        </Container>

        
    </Navbar>
  );
}

