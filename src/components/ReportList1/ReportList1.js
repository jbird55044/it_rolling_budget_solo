import React, { Component } from 'react';
import { connect } from 'react-redux';
import mapStoreToProps from '../../redux/mapStoreToProps';
import ReportItem1 from '../ReportItem1/ReportItem1'
import {
    Table,
        } from 'react-bootstrap'
import { withStyles } from '@material-ui/core/styles';

import './ReportList1.css'

const styles = theme => ({
    container: {
        display: 'flex',
        flexWrap: 'wrap',
      },
    });

class ReportList1 extends Component {
  
    async componentDidMount() {
        // Get's data to fill form, both Budget and Expense (prefills for ID grab)
        this.props.dispatch({type: 'FETCH_BUDGETREPORT', recordFinder: {
            businessUnitId: this.props.store.user.id,
            selectedYear: this.props.store.budgetReport.reportSelectedYear,
            }
        });

        console.log ('selected', this.props.store.budgetReport.reportSelectedYear)
    }
  
    
    render() {
        return (
            <div className="report1Class">
                <h3>Report One - Human With Total for:</h3> {this.props.selectedYear}
                <Table className="report1TableClass" striped bordered hover size="sm">
                    <thead>
                        <tr><th>ID</th><th>Nomenclature</th><th>GL Account</th><th>GL Name</th><th>Cost Center</th><th>Description</th></tr>
                    </thead>
                    <tbody>
                        {this.props.store.budgetReport.reportBudgetReport.map((lineItem) => {
                        return (
                            // JSON.stringify(lineItem)
                            <ReportItem1 key={lineItem.id} lineItem={lineItem} />
                            );
                        })}
                    </tbody>

               
                </Table>
         </div>
        )
    }
}

const putReduxStateOnProps = (reduxState) => ({
    reduxState
  })

export default connect(mapStoreToProps)(withStyles(styles)(ReportList1));
// export default connect(mapStoreToProps)(ReportList1);
 