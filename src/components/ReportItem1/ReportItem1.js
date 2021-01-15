import React, { Component } from 'react';
import { connect } from 'react-redux';
import mapStoreToProps from '../../redux/mapStoreToProps';

import './ReportItem1.css'


class ReportItem1 extends Component {
  
    
    render() {
        return (
            <tr>
                <td>{this.props.lineItem.id}</td>
                <td>{this.props.lineItem.nomenclature}</td>
                <td>{this.props.lineItem.gl_account}</td>
                <td>{this.props.lineItem.gl_name}</td>
                <td>{this.props.lineItem.cost_center}</td>
                <td>{this.props.lineItem.description}</td>
                <td>{this.props.lineItem.life_nominclature}</td>
            </tr>
        )
    }
}

const putReduxStateOnProps = (reduxState) => ({
    reduxState
  })

export default connect(mapStoreToProps)(ReportItem1);
 