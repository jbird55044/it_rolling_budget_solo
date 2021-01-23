import React, { Component } from 'react';
import { connect } from 'react-redux';
import mapStoreToProps from '../../redux/mapStoreToProps';

import './LandingPage.css';

// CUSTOM COMPONENTS
import RegisterForm from '../RegisterForm/RegisterForm';

class LandingPage extends Component {
  state = {
    heading: 'Rolling Budget',
  };

  onLogin = (event) => {
    this.props.history.push('/login');
  };

  render() {
    return (
      <div className="container">
        <h2>{this.state.heading}</h2>

        <div className="grid">
          <div className="grid-col grid-col_8">
            <h3>Reports</h3>
            <p>
              A selection of pre-established reports that allow for record
              viewing as well as jumping into record editing.
            </p>

            <h3>Expense Form</h3>
            <p>
              The main edit page for budget items
            </p>

            <h3>Admin</h3>
            <p>
              The area to go to administrate the application.  Here you can set associations
              between login id's and business areas.
            </p>

            <h3>Purchase Orders</h3>
            <p>
              Future development of the Purchase Order system.
            </p>
          </div>
          <div className="grid-col grid-col_4">
            <RegisterForm />

            <center>
              <h4>Already a Member?</h4>
              <button className="btn btn_sizeSm" onClick={this.onLogin}>
                Login
              </button>
            </center>
          </div>
        </div>
      </div>
    );
  }
}

export default connect(mapStoreToProps)(LandingPage);
