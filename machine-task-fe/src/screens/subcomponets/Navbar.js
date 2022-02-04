import React from "react";
import { Navbar, Nav, Container } from "react-bootstrap";

const AppNavbar = (props) => {
  return (
    <Navbar bg="primary" variant="dark" className="appnavbar w-100">
      <div className="d-flex">
        <Navbar.Brand href="">Machine Task</Navbar.Brand>
        {/* <Nav className="me-auto">
          <Nav.Link href="#home">Home</Nav.Link>
          <Nav.Link href="#features">Features</Nav.Link>
          <Nav.Link href="#pricing">Pricing</Nav.Link>
        </Nav> */}
      </div>
    </Navbar>
  );
};

export default AppNavbar;
