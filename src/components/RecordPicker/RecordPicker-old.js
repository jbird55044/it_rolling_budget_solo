import React, { Component } from 'react';
import { connect } from 'react-redux';
import mapStoreToProps from '../../redux/mapStoreToProps';
import ReactDataGrid from 'react-data-grid';

import './RecordPicker.css'

const moneyFormatter = ({ value }) => {
    return <p>${value}</p>;
  };
  

const columns = [
    { key: 'id', name: 'ID', editable: false, width: 60 },
    { key: 'cost_center', name: 'cost_center', editable: false, width: 150 },
    { key: 'nomenclature', name: 'nomenclature', editable: false , width: 150 },
    { key: 'needs_review', name: 'needs_review', editable: false , width: 75},
    { key: 'gl_name', name: 'gl_name', editable: false, width: 75 },
    { key: 'frequency', name: 'frequency', editable: false },
    { key: 'total', name: 'total', editable: true, formatter: moneyFormatter, width: 150 },
    { key: 'detail', name: 'Detail', editable: false },
    ];
  

class RecordPicker extends Component {
    
    state = { 
        allRows: [],
        budgetId: 0,
        recordCount: 0,
        relitiveRecordId: 0,
    };
    
    // Stage Redux with up to date db info
      async componentDidMount() {
          this.props.dispatch({type: 'FETCH_BUDGETREPORT1', recordFinder: {
            businessUnitId: this.props.store.user.id,
            // selectedYear: this.props.store.budgetReport.reportSelectedYear,
            selectedYear: '2021',
            }
        });
        this.props.dispatch({type: 'FETCH_BUDGETREPORT1SUM', recordFinder: {
          businessUnitId: this.props.store.user.id,
          selectedYear: this.props.store.budgetReport.reportSelectedYear,
          }
        });
        
        let row = {};
        let stagedRow = {}
        let formattedRows = [];
        
        console.log (`Report 1`, this.props.store.budgetReport.reportBudgetReport1);
        for (row of this.props.store.budgetReport.reportBudgetReport1) {
            console.log (`row.id`, row.id);
            stagedRow.id = row.id; 
            stagedRow.cost_center = row.cost_center;
            stagedRow.nomenclature = row.nomenclature;
            stagedRow.needs_review = row.needs_review;
            stagedRow.gl_name= row.gl_name;
            stagedRow.frequency= row.frequency;
            stagedRow.total= row.total;
            stagedRow.detail= 'detail';
           
            formattedRows.push (stagedRow);
            stagedRow={};
        }
      
        this.setState ({
            allRows: formattedRows,
            recordCount: formattedRows.length
        })

      console.log (`In Expense Did Mount`, this.state.allRows);

    }

    convertNumToMoneyString = (number) => {
        // convert to money format
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
    
    
    
    cleanSqlDate = (fieldValue, fieldName) => {
        let year = fieldValue.slice(0, 4);
        let month = fieldValue.slice(5, 7);
        let day = fieldValue.slice(8, 10);
        return `${month}/${day}/${year}`
    };
    

    refreshExpenseTable = () => {
      this.props.dispatch({type: 'FETCH_BUDGETREPORT1', recordFinder: {
        businessUnitId: this.props.store.user.id,
        // selectedYear: this.props.store.budgetReport.reportSelectedYear,
        selectedYear: '2021',
        }
    });
    }
      
    
    
    render() {
        return (
            <div className="pageDivClass">
            <p>length: {this.state.allRows.length}</p>
            <p>sum: {this.props.store.budgetReport.reportBudgetReport1Sum}</p>

                  {this.state.allRows.map((lineItem) => {
                        return (
                            JSON.stringify(lineItem)
                            );
                     })}



                <div  className="datGridClass">
                    <button className="buttonClass" onClick={this.refreshExpenseTable}>Refresh</button>
                    <button className="buttonClass" onClick={this.saveGrid}>Save and Close</button> 

                    <ReactDataGrid
                        // rows={rows}
                        columns={columns}
                        rowGetter={i => this.state.allRows[i]}
                        rowsCount={this.state.recordCount}
                        onGridRowsUpdated={this.onGridRowsUpdated}
                        enableCellSelect={true}
                    />
                
                </div>
                
            </div>
             
        );
    }
}

  

export default connect(mapStoreToProps)(RecordPicker);
 