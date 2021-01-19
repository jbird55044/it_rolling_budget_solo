import React, { Component } from 'react';
import { connect } from 'react-redux';
import mapStoreToProps from '../../redux/mapStoreToProps';

import './ReportItem2.css'


class ReportItem2 extends Component {

    async componentDidMount() {
        // Get's data to fill form, both Budget and Expense (prefills for ID grab)
        // this.props.dispatch({type: 'FETCH_EXPENSEFILL', recordFinder: {
        //     recordId: this.props.lineItem.id,
        //     }
        // });
    }

    render() {
        return (
            <>
            <tr>
                <td>{this.props.lineItem.id}</td>
                <td>{this.props.lineItem.nomenclature}</td>
                <td>{this.props.lineItem.gl_account}</td>
                <td>{this.props.lineItem.gl_name}</td>
                <td>{this.props.lineItem.cost_center}</td>
                <td>{this.props.lineItem.description}</td>
                <td>{this.props.lineItem.life}</td>
                <td>{this.props.lineItem.amount}</td>
            </tr>
            </>
        )
    }
}


export default connect(mapStoreToProps)(ReportItem2);
 