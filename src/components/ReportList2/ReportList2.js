import React, { Component } from 'react';
import { connect } from 'react-redux';
import mapStoreToProps from '../../redux/mapStoreToProps';
import ReportItem2 from '../ReportItem2/ReportItem2'
import {
    Table,
        } from 'react-bootstrap'
import { withStyles } from '@material-ui/core/styles';
import { ExportReactCSV } from '../ExportReactCSV/ExportReactCSV';
import { ExportReactExcel } from '../ExportReactExcel/ExportReactExcel';


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
        
        this.props.dispatch({type: 'FETCH_BUDGETREPORT2', recordFinder: {
            businessUnitId: this.props.store.user.id,
            selectedYear: this.props.store.budgetReport.reportSelectedYear,
            }
        });
    }
  
    
    render() {

        return (

            <div>

                <div className="buttonExportDivClass">
                    <ExportReactCSV csvData={this.props.store.budgetReport.reportBudgetReport2} fileName={this.state.fileName} />
                    <ExportReactExcel csvData={this.props.store.budgetReport.reportBudgetReport2} fileName={this.state.fileName} />
                </div>
                <div className="report2Class">
                    <h3>Report - 'Machine to Machine'  Buget totals for: {this.props.store.budgetReport.reportSelectedYear} </h3>
                    
                    <Table className="report2TableClass" bordered hover size="sm">
                        
                        <tbody>
                            {this.props.store.budgetReport.reportBudgetReport2.map((lineItem, index) => {
                            return (
                                // JSON.stringify(lineItem)
                                <ReportItem2 key={index} lineItem={lineItem} />
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
 