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
  
    state = {
        grandTotal: 0
    }

    async componentDidMount() {
        // Get's data to fill form, both Budget and Expense (prefills for ID grab)
        this.props.dispatch({type: 'FETCH_BUDGETREPORT1', recordFinder: {
            businessUnitId: this.props.store.user.id,
            selectedYear: this.props.store.budgetReport.reportSelectedYear,
            }
        });
        this.props.dispatch({type: 'FETCH_BUDGETREPORT1SUM', recordFinder: {
            businessUnitId: this.props.store.user.id,
            selectedYear: this.props.store.budgetReport.reportSelectedYear,
            }
        });
    }

    convertNumToMoneyString = (number) => {
        // convert to money format
        if (number < 1 || number === null) return;
        let charNumberNew = '';
        let charNumberOld = '';
        let cents= null;
        charNumberOld = number.toString();
        if ( charNumberOld.indexOf('.') > 0 ) {
            cents = charNumberOld.slice(charNumberOld.indexOf('.'));
            charNumberOld = charNumberOld.slice( 0, charNumberOld.indexOf('.'));
        }
        // reverses string and adds ',' every third location
        let c=0;
        charNumberOld = reverseString(charNumberOld);
        for ( c = 0; c < charNumberOld.length; c += 1 ) {
            if (  (c !== 0) && (c % 3) === 0 ) {
            charNumberNew += (',')
            }
            charNumberNew += charNumberOld[c]
        };
        charNumberNew = reverseString(charNumberNew);
        if ( cents === null ) cents = '.00'
        // charNumberNew += cents
        return charNumberNew;
    
        function reverseString(str) {
            return str.split("").reverse().join("");
        }
    }  // end of convertNumToMoneyString fn

     
    render() {
        return (
            <div className="report1Class">
                <h3>Report - 'Human'  Buget totals for: {this.props.store.budgetReport.reportSelectedYear} </h3>
                
                <Table className="report1TableClass" striped bordered hover size="sm">
                    <thead>
                        <tr><th>ID</th><th>Nomenclature</th><th>GL Account</th><th>GL Name</th><th>Cost Center</th><th>Description</th></tr>
                    </thead>
                    <tbody>
                        {this.props.store.budgetReport.reportBudgetReport1.map((lineItem) => {
                        return (
                            // JSON.stringify(lineItem)
                            <ReportItem1 key={lineItem.id} lineItem={lineItem} />
                            );
                        })}
                    </tbody>
                    
               
                </Table>
                <h3>Total Budget: ${this.convertNumToMoneyString(this.props.store.budgetReport.reportBudgetReport1Sum)} </h3> 
         </div>
        )
    }
}


export default connect(mapStoreToProps)(withStyles(styles)(ReportList1));
// export default connect(mapStoreToProps)(ReportList1);
 