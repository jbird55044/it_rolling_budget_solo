import React, { Component } from 'react';
import { connect } from 'react-redux';
import mapStoreToProps from '../../redux/mapStoreToProps';

import './ReportMenu.css'


class ReportMenu extends Component {
  
    componentDidMount() {
        console.log (`We are loaded: ReportMenu Page`);        
    }

  
    
    render() {
        return (
            <div className="homePageClass">
                <h1>Reporting Menu</h1>
            </div>
        );
    }
}

const putReduxStateOnProps = (reduxState) => ({
    reduxState
  })

export default connect(mapStoreToProps)(ReportMenu);
 