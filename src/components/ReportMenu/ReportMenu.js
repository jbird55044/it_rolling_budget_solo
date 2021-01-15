import React, { Component } from 'react';
import { connect } from 'react-redux';
import mapStoreToProps from '../../redux/mapStoreToProps';
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
                    
                <Link className="reportListClass" to="/report1">Report 1</Link>
                
            </div>
        )
    }
}

const putReduxStateOnProps = (reduxState) => ({
    reduxState
  })

export default connect(mapStoreToProps)(ReportMenu);
 