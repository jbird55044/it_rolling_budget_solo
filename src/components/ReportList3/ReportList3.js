import React, { Component } from 'react';
import { connect } from 'react-redux';
import mapStoreToProps from '../../redux/mapStoreToProps';
import ReportItem3 from '../ReportItem3/ReportItem3'
import {
    Table,
        } from 'react-bootstrap'
import { withStyles } from '@material-ui/core/styles';

import './ReportList3.css'

const styles = theme => ({
    container: {
        display: 'flex',
        flexWrap: 'wrap',
      },
    });

class ReportList3 extends Component {
  
    async componentDidMount() {
        // Get's data to fill form, both Budget and Expense (prefills for ID grab)
        this.props.dispatch({type: 'FETCH_BUDGETREPORT3', recordFinder: {
            businessUnitId: this.props.store.user.id,
            selectedYear: this.props.store.budgetReport.reportSelectedYear,
            }
        });
    }
  
    
    render() {
        return (
            <div className="report3Class">
                <h3>Report - Tentitive Entries for Review for: {this.props.store.budgetReport.reportSelectedYear} </h3>
                
                <Table className="report3TableClass" striped bordered hover size="sm">
                    <thead>
                        <tr><th>ID</th><th>Nomenclature</th><th>GL Account</th><th>GL Name</th><th>Cost Center</th><th>Notes</th></tr>
                    </thead>
                    <tbody>
                        {this.props.store.budgetReport.reportBudgetReport3.map((lineItem) => {
                        return (
                            // JSON.stringify(lineItem)
                            <ReportItem3 key={lineItem.id} lineItem={lineItem} />
                            );
                        })}
                    </tbody>

               
                </Table>
         </div>
        )
    }
}


export default connect(mapStoreToProps)(withStyles(styles)(ReportList3));
// export default connect(mapStoreToProps)(ReportList1);
 