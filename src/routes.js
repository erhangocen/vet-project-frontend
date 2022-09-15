import AnimalTypesPage from "views/AnimalTypesPage.js";
import AnimalBreedsPage from "views/AnimalBreedsPage";
import {FaCat, FaHeartbeat, FaPaw, FaUserMd, FaWalking} from 'react-icons/fa';
import VetListPage from "views/VetListPage";
import AnimalOwnersPage from "views/AnimalOwnersPage";
import Animals from "views/Animals";

var id = 1;

var routes = [
  
  {
    path: `owners`,
    name: "Owners",
    icon: <FaWalking/>,
    component: <AnimalOwnersPage/>,
  },
  {
    path: "breeds",
    name: "Breeds",
    icon: <FaPaw/>,
    component: <AnimalBreedsPage/>,
  },
  {
    path: "types",
    name: "Types",
    icon: <FaCat/>,
    component: <AnimalTypesPage/>,
  }
];
export default routes;
