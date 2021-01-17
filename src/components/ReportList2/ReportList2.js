import React, { Component } from 'react';
import { connect } from 'react-redux';
import mapStoreToProps from '../../redux/mapStoreToProps';
import ReportItem1 from '../ReportItem1/ReportItem1'
import { withStyles } from '@material-ui/core/styles';

import './ReportList2.css'

const styles = theme => ({
    container: {
        display: 'flex',
        flexWrap: 'wrap',
      },
    });

class ReportList2 extends Component {
  
    async componentDidMount() {
        // Get's data to fill form, both Budget and Expense (prefills for ID grab)
        this.props.dispatch({type: 'FETCH_BUDGETCOLLECTION', recordFinder: {
            businessUnitId: this.props.store.user.id,
            }
        });
        this.props.dispatch({type: 'FETCH_BUDGET_RECORD_COUNT', recordFinder: {
            businessUnitId: this.props.store.user.id,
            }
        });
        // this.updateState();
    }
  
    
    render() {
        return (
            <div className="report1Class">
                <h1>Report Two</h1>
                <table className="report1TableClass">
                    <thead>
                        <tr><th>ID</th><th>nomenclature</th><th>gl_account</th><th>gl_name</th><th>cost_center</th><th>description</th><th>Cap_life</th></tr>
                    </thead>
                    <tbody>
                        {this.props.store.budgetCollection.reportBudgetCollection.map((lineItem) => {
                        return (
                            // JSON.stringify(lineItem)
                            <ReportItem1 key={lineItem.id} lineItem={lineItem} />
                            );
                        })}
                    </tbody>

               
                </table>
         </div>
        )
    }
}

const putReduxStateOnProps = (reduxState) => ({
    reduxState
  })

export default connect(mapStoreToProps)(withStyles(styles)(ReportList2));
// export default connect(mapStoreToProps)(ReportList1);
 