import React, { Component } from 'react';
import { connect } from 'react-redux';
import mapStoreToProps from '../../redux/mapStoreToProps';
import ReportItem1 from '../ReportItem1/ReportItem1'

import './ReportList1.css'


class ReportList1 extends Component {
  
    async componentDidMount() {
        // Get's data to fill form, both Budget and Expense (prefills for ID grab)
        this.props.dispatch({type: 'FETCH_BUDGETCOLLECTION', recordFinder: {
            businessUnitId: this.props.store.user.id,
            relitiveRecordId: this.state.recordNumber,
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
            <div className="homePageClass">
                <h1>Report List 1</h1>

                <ul>
                {/* {this.props.store.budgetCollection.budgetFormFillList.map((basketItem) => {
                    return (
                        <ReportItem1 key={basketItem.id} basketItem={basketItem} />
                    );
                })} */}
            </ul>
         </div>
        )
    }
}

const putReduxStateOnProps = (reduxState) => ({
    reduxState
  })

export default connect(mapStoreToProps)(ReportList1);
 