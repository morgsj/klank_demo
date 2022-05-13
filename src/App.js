import React from "react";
import {
  BrowserRouter,
  Route,
  Routes
} from "react-router-dom";
import Navigator from "./components/Navigator";
import 'bootstrap/dist/css/bootstrap.min.css';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element = {<Navigator />}>
          <Route path="dashboard" element={<Home />} />
          <Route path="about" element={<About />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

function Home() {
  return <h2>Home</h2>;
}

function About() {
  return <h2>About</h2>;
}