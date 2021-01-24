import React, { Component } from 'react';
import { connect } from 'react-redux';
import LogOutButton from '../LogOutButton/LogOutButton';
import mapStoreToProps from '../../redux/mapStoreToProps';
import './UserPage.css'

class UserPage extends Component {

  async componentDidMount() {
    // default reporting to current year
    this.props.dispatch({type: 'SET_SELECTEDYEAR', payload: this.getYear()});
  }

  getYear = () => {
    let today = new Date();
    let year = today.getFullYear();
    return year
}  // end of getYear fn

  // this component doesn't do much to start, just renders some user info to the DOM
  render() {
    return (
      <div className="userPageClass">
        <h1 id="welcome">Welcome, {this.props.store.user.full_name}!</h1>
        <p>Your ID is: {this.props.store.user.id}</p>
        <p>Your Business Group Code is: {this.props.store.user.business_unit}</p>
        <p>Your Business Group Description is: {this.props.store.user.bu_description}</p>
        <LogOutButton className="log-in" />
      </div>
    );
  }
}

// this allows us to use <App /> in index.js
export default connect(mapStoreToProps)(UserPage);
