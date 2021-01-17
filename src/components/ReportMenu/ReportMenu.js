import React, { Component } from 'react';
import { connect } from 'react-redux';
import mapStoreToProps from '../../redux/mapStoreToProps';
import TextField from '@material-ui/core/TextField';
import MenuItem from '@material-ui/core/MenuItem';
import classNames from 'classnames';
import { withStyles } from '@material-ui/core/styles';
import InputAdornment from '@material-ui/core/InputAdornment';



import {
    HashRouter as Router,
    Route,
    Link,
  } from 'react-router-dom';

import './ReportMenu.css'

const styles = theme => ({
    container: {
        display: 'flex',
        flexWrap: 'wrap',
      },
      margin: {
        margin: theme.spacing.unit - 3,
        paddingTop: theme.spacing.unit - 2,
        paddingBottom: theme.spacing.unit - 2,
      },
      textField: {
        flexBasis: 200,
      },
      });

class ReportMenu extends Component {

    state = {
        selectedYear: 0,
    };
  
    async componentDidMount() {
        // Get's data to populate year pull-down
        this.props.dispatch({type: 'FETCH_TLIST_YEAR'});
    }

    handleChange = (event, name) => {
        this.setState({
            ...this.state.editForm,
            [name]: event.target.value 
        });
        this.props.dispatch({type: 'SET_SELECTEDYEAR', payload: event.target.value});
    }
    
    render() {
        const { classes } = this.props;

        return (
            <>

            <TextField
                select style = {{minWidth: 100}}
                label=""
                className={classNames(classes.margin, classes.textField)}
                value={this.props.store.budgetReport.reportSelectedYear}
                onChange={(event)=>this.handleChange(event, 'selectedYear')}
                InputProps={{startAdornment: <InputAdornment position="start">Report Year:</InputAdornment>,}}
                >
                <MenuItem value="">
                    </MenuItem>ß
                        {this.props.store.tlist.tlistYear.map(records => (
                            <MenuItem key={records.id} value={records.id}>
                            {records.year}
                            </MenuItem>
                        ))}
            </TextField>

            <div className="menuBoxClass">
                <h2>Rolling Budget Reports:</h2>

                {this.state.selectedYear > 0?    
                <Link selectedYear={this.state.selectedYear} className="reportSelectorClass" to="/report1">Report 1 - Human</Link>:
                <p>Report 1 - Human (please select year first)</p>}
                <p></p>
                {this.state.selectedYear > 0 ?  
                <Link className="reportSelectorClass" to="/report2">Report 2 - Machine</Link>:
                <p>Report 2 - Machine (please select year first)</p>}
                
            </div>
            </>
        )
    }
}



export default connect(mapStoreToProps)(withStyles(styles)(ReportMenu));
// export default connect(mapStoreToProps)(ReportMenu);
 