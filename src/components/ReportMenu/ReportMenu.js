import React, { Component } from 'react';
import { connect } from 'react-redux';
import mapStoreToProps from '../../redux/mapStoreToProps';
import {
    Nav,

        } from 'react-bootstrap'
import {
    HashRouter as Router,
    Route,
    Link,
  } from 'react-router-dom';

import './ReportMenu.css'


class ReportMenu extends Component {
  
    async componentDidMount() {
        // Get's data to populate year pull-down
        this.props.dispatch({type: 'FETCH_TLIST_YEAR'});
    }
    
    render() {
        return (
            <>

            <TextField
                select style = {{minWidth: 400}}
                label="Point Person"
                className={classNames(classes.margin, classes.textField)}
                value={this.state.recordEditMode? this.state.editForm.point_person_fk : currentBudgetRecord.point_person_fk}
                onChange={(event)=>this.handleChange(event, 'point_person_fk')}
                // InputProps={{startAdornment: <InputAdornment position="start">-</InputAdornment>,}}
                >
                <MenuItem value="">
                    <em>None</em>
                    </MenuItem>
                        {this.props.store.tlist.tlistPointPerson.map(records => (
                            <MenuItem key={records.id} value={records.id}>
                            {records.point_person} - {records.pp_email_address}
                            </MenuItem>
                        ))}
            </TextField>

            {JSON.stringify(this.props.store.tlist.tlistYear)}
            <Nav defaultActiveKey="/reportmenu" className="flex-column menuBoxClass">
                <h2>Reporting Menu</h2>
                <Link className="reportSelectorClass" to="/report1">Report 1 - Human</Link>
                <p></p>
                <Link className="reportSelectorClass" to="/report2">Report 2 - Machine</Link>
            </Nav>
            
            <div className="menuBoxClass">
                <h2>Reporting Menu</h2>
                    
                <Link className="reportSelectorClass" to="/report1">Report 1 - Human</Link>
                <p></p>
                <Link className="reportSelectorClass" to="/report2">Report 2 - Machine</Link>
                
            </div>
            </>
        )
    }
}

const putReduxStateOnProps = (reduxState) => ({
    reduxState
  })

export default connect(mapStoreToProps)(ReportMenu);
 