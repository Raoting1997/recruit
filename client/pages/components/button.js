import React, { Component } from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";

const Button = (props) => (
  <Detail>
    <Link to={props.url} className="link">{props.value}</Link>
  </Detail>
)

export default Button;

const Detail = styled.button`
  position: absolute;
  top: 30px;
  right: 30px;
  border: none;
  padding: 0;
  background: #38b447;
  color: #fff;
  outline-style: none;
  border-radius: 3px;
  overflow: hidden;

  .link {
    display: block;
    padding: 7px 10px;
    color: #fff;

    &:hover {
      background: #3ec74f;
      text-decoration: none;
    }
  }
`;