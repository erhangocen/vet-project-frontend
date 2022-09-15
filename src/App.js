import React from 'react'
import LoginPage from "views/LoginPage";
import { ToastContainer } from "react-toastify";
import routes from "../src/routes";
import HomePage from "views/HomePage";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import AnimalsPage from 'views/Animals';
import MPanel from './layouts/MPanel';
import VetListPage from 'views/VetListPage';
import OwnerProfilePage from 'views/OwnerProfilePage';
import { Fab } from '@mui/material';
import AnimalOwnersPage from 'views/AnimalOwnersPage';
import NoPage from 'views/NoPage';

export default function App() {

  return (
    <BrowserRouter>
    <ToastContainer/>
     <Routes>
        <Route path="/" element={<HomePage/>}/>
        <Route path="/login" element={<LoginPage/>}/>
        <Route path="/mPanel" element={<MPanel/>}>
            <Route index element={<AnimalsPage />} />
            <Route path="ownerProfile/:id" element={<OwnerProfilePage/>}/>
            <Route path="owners/:pageNo" element={<AnimalOwnersPage/>}/>
            <Route path="animals/:pageNo" element={<AnimalsPage/>}/>
            <Route path="animals" element={<AnimalsPage/>}/>
            <Route path="vets" element={<VetListPage/>}/>
            {routes?.map((route)=>(
                <Route key={1} path={route.path} element={route.component}/>
            ))}
        </Route>
        <Route path='*' element={<NoPage/>}/>
    </Routes>
    
    
  </BrowserRouter>
  )
}
