import React, { Component } from 'react';
import { connect } from 'react-redux';
import mapStoreToProps from '../../redux/mapStoreToProps';
import ReportList1 from '../ReportList1/ReportList1'
import {
    HashRouter as Router,
    Route,
    Link,
  } from 'react-router-dom';

import './ReportMenu.css'


class ReportMenu extends Component {
  
   
    
    render() {
        return (
            <div className="homePageClass">
                <h1>Reporting Menu Jim</h1>

           

            <Router>

                <div>
                <Link className="reportListClass" to="/report1">Report 1</Link>
                </div>

                <Route
                    // shows AboutPage at all times (logged in or not)
                    exact
                    path="/report1"
                    component={ReportList1}
                />
            </Router>    

            </div>
        )
    }
}

const putReduxStateOnProps = (reduxState) => ({
    reduxState
  })

export default connect(mapStoreToProps)(ReportMenu);
 