import React, { Component } from 'react';
import { connect } from 'react-redux';
import mapStoreToProps from '../../redux/mapStoreToProps';
import ReportItem2 from '../ReportItem2/ReportItem2'
import {
    Table,
        } from 'react-bootstrap'
import { withStyles } from '@material-ui/core/styles';
import { ExportReactCSV } from '../ExportReactCSV/ExportReactCSV';
import { ExportCSV } from '../ExportCSV/ExportCSV';


import './ReportList2.css'

const styles = theme => ({
    container: {
        display: 'flex',
        flexWrap: 'wrap',
      },
    });

class ReportList2 extends Component {

    state = {
        fileName: 'Report2_Export'
    }
  
    async componentDidMount() {
        // Get's data to fill form, both Budget and Expense (prefills for ID grab)
        this.props.dispatch({type: 'FETCH_SPELLEDOUT_YEAR', recordFinder: {
            selectedYear: this.props.store.budgetReport.reportSelectedYear,
            }
        });
        this.props.dispatch({type: 'FETCH_BUDGETREPORT', recordFinder: {
            businessUnitId: this.props.store.user.id,
            selectedYear: this.props.store.budgetReport.reportSelectedYear,
            }
        });
    }
  
    
    render() {

        return (

            <div>

                <div className="buttonExportClass">
                    <ExportReactCSV csvData={this.props.store.budgetReport.reportBudgetReport} fileName={this.state.fileName} />
                    <ExportCSV csvData={this.props.store.budgetReport.reportBudgetReport} fileName={this.state.fileName} />
                </div>
                <div className="report1Class">
                    <h3>Report - 'Machine to Machine'  Buget totals for: {this.props.store.budgetReport.reportSelectedYearSpelledOut} </h3>
                    
                    <Table className="report1TableClass" bordered hover size="sm">
                        
                        <tbody>
                            {this.props.store.budgetReport.reportBudgetReport.map((lineItem) => {
                            return (
                                // JSON.stringify(lineItem)
                                <ReportItem2 key={lineItem.id} lineItem={lineItem} />
                                );
                            })}
                        </tbody>

                
                    </Table>
            </div>
         </div>
        )
    }
}

const putReduxStateOnProps = (reduxState) => ({
    reduxState
  })

export default connect(mapStoreToProps)(withStyles(styles)(ReportList2));
// export default connect(mapStoreToProps)(ReportList1);
 