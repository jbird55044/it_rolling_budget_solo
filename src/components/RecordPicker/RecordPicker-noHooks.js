import React, { Component, useState } from 'react';
import { connect } from 'react-redux';
import mapStoreToProps from '../../redux/mapStoreToProps';
import ReactDataGrid from 'react-data-grid';
import TextField from '@material-ui/core/TextField';
import MenuItem from '@material-ui/core/MenuItem';
import classNames from 'classnames';
import { withStyles } from '@material-ui/core/styles';
import InputAdornment from '@material-ui/core/InputAdornment';

import './RecordPicker.css'

const styles = theme => ({
    container: {
        display: 'flex',
        flexWrap: 'wrap',
      },
      margin: {
        margin: theme.spacing.unit,
        paddingTop: theme.spacing.unit,
        paddingBottom: theme.spacing.unit,
      },
      textField: {
        flexBasis: 200,
      },
      });


const moneyFormatter = ({ value }) => {
    return <p>${value}</p>;
  };
  

const columns = [
    { key: 'id', name: 'ID', editable: false, width: 60 },
    { key: 'cost_center', name: 'CC', editable: false, filterable: true, width: 75 },
    { key: 'nomenclature', name: 'Nomenclature', editable: false , filterable: true, width: 150 },
    { key: 'needs_review', name: 'Review', editable: false , filterable: true, width: 75},
    { key: 'gl_name', name: 'GL Name', editable: false, filterable: true, width: 125 },
    { key: 'frequency', name: 'Frequency', editable: false },
    { key: 'total', name: 'Total', editable: true, filterable: true, formatter: moneyFormatter, width: 150 },
    { key: 'detail', name: 'Detail', editable: false },
    ];

const handleFilterChange = filter => filters => {
    const newFilters = { ...filters };
    if (filter.filterTerm) {
        newFilters[filter.column.key] = filter;
    } else {
        delete newFilters[filter.column.key];
    }
    return newFilters;
    };


 
class RecordPicker extends Component {
  
    state = { 
        selectedYear: '2021',
        allRows: [],
        budgetId: 0,
        recordCount: 0,
        relitiveRecordId: 0,
    };

    async componentDidMount() {
        this.props.dispatch({type: 'FETCH_TLIST_YEAR'});
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
    
       
       
    }  // end of componentDidMount fn


    refreshExpenseTable = () => {
        let row = {};
        let stagedRow = {}
        let formattedRows = [];
        
        console.log (`Report 1`, this.props.store.budgetReport.reportBudgetReport1);
        for (row of this.props.store.budgetReport.reportBudgetReport1) {
            stagedRow.id = row.id; 
            stagedRow.cost_center = row.cost_center;
            stagedRow.nomenclature = row.nomenclature;
            if (row.needs_review) {stagedRow.needs_review = 'Review'}
            stagedRow.gl_name= row.gl_name;
            stagedRow.frequency= row.frequency;
            stagedRow.total= row.total;
            stagedRow.detail= 'detail';
            
            console.log (`stagedRow.id`, stagedRow.id ,stagedRow.needs_review);
            
            formattedRows.push (stagedRow);
            stagedRow={};
            
        }
      
        this.setState ({
            allRows: formattedRows,
            recordCount: formattedRows.length
        })

      console.log (`In Expense Did Mount`, this.state.allRows);
    }

    handleChange = (event, name) => {
        console.log ('value 1:', event.target.value)
        this.props.dispatch({type: 'SET_SELECTEDYEAR', payload: event.target.value});
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

    getRows =(rows, filters) => {
        return selectors.getRows({ rows, filters });
      }

    
    render() {
        const { classes } = this.props;
        const [filters, setFilters] = useState({});
        const filteredRows = getRows(rows, filters);
        return (
            <div className="pageDivClass">
                <TextField
                    select style = {{minWidth: 100}}
                    variant="outlined"
                    label=""
                    className={classNames(classes.margin, classes.textField)}
                    value={this.props.store.budgetReport.reportSelectedYear}
                    onChange={(event)=>this.handleChange(event, 'selectedYear')}
                    InputProps={{startAdornment: <InputAdornment position="start">Budget Year:</InputAdornment>,}}
                    >
                    <MenuItem value="">
                        </MenuItem>
                            {this.props.store.tlist.tlistYear.map(records => (
                                <MenuItem key={records.id} value={records.year}>
                                {records.year}
                                </MenuItem>
                            ))}
                </TextField>

                {/* <p>length: {this.props.store.budgetReport.reportBudgetReport1.length}</p> */}
                {/* <p>sum: {this.props.store.budgetReport.reportBudgetReport1Sum}</p> */}
                    

                    <div  className="datGridClass">
                        <button className="buttonClass" onClick={this.refreshExpenseTable}>Refresh</button>
                        {/* <button className="buttonClass" onClick={this.saveGrid}>Save and Close</button>  */}

                        <ReactDataGrid
                            // rows={rows}
                            columns={columns}
                            rowGetter={i => this.state.allRows[i]}
                            rowsCount={this.state.recordCount}
                            onGridRowsUpdated={this.onGridRowsUpdated}
                            enableCellSelect={true}
                            onAddFilter={filter => setFilters(handleFilterChange(filter))}
                            onClearFilters={() => setFilters({})}
                        />
                    
                    </div>
                
            </div>
        )
    }
}


export default connect(mapStoreToProps)(withStyles(styles)(RecordPicker));
 