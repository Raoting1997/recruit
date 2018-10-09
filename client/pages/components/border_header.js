import React, { Component } from "react";
import styled from 'styled-components';

class Header extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <BorderHeader {...this.props}><i></i> {this.props.children}</BorderHeader>
    )
  }
}

const BorderHeader = styled.div`
  font-weight: 700;
  font-size: 14px;

  i {
    display: inline-block;
    width: 0;
    height: 14px;
    vertical-align: -2px;
    border-left: 5px solid #38b447;
    margin-right: 5px;
  }

`;

export default Header;