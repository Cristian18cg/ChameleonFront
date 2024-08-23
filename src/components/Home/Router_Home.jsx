import React from 'react'
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { NavBar } from "./NavBar";
import {Landing_home} from './Landing_home'
export const Router_Home = () => {
  return (
    <>
     <Router>
            <NavBar />
            <Routes>
                <Route path="/" element={<Landing_home  />} />
               </Routes>
        </Router> 
    </>
  )
}

