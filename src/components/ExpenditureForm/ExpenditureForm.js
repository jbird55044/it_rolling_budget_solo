import React, { Component } from 'react';
import mapStoreToProps from '../../redux/mapStoreToProps';
import { connect } from 'react-redux';
import ReactDataGrid from 'react-data-grid';

import './ExpenditureForm.css'

const moneyFormatter = ({ value }) => {
    return <p>${value}</p>;
  };
  

const columns = [
    { key: 'id', name: 'ID', editable: false, width: 50 },
    { key: 'period', name: 'period', editable: true , width: 75 },
    { key: 'year', name: 'year', editable: true , width: 75},
    { key: 'amount', name: 'amount', editable: true, formatter: moneyFormatter, width: 150 },
    { key: 'expense_note', name: 'expense_note', editable: true },
    ];
  

class ExpenditureForm extends Component {
    
    state = { 
        allRows: [],
        expenseId: 0,
    };
    
    // Stage Redux with up to date db info
    async componentDidMount() {
        let row = {};
        let stagedRow = {}
        let formattedRows = [];
        
        this.setState ({
            expenseId: this.props.recordId
          })
        for (row of this.props.expenseList) {
            stagedRow.id = row.id; 
            stagedRow.period = row.period;
            stagedRow.year = row.year;
            stagedRow.amount = this.convertNumToMoneyString(row.amount);
            stagedRow.expense_note= row.expense_note;
           
            formattedRows.push (stagedRow)
        }
        console.log (`Formatted Rows`, formattedRows);

      this.setState ({
        allRows: formattedRows
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
        charNumberNew += cents
        return charNumberNew;
    
        function reverseString(str) {
            return str.split("").reverse().join("");
        }
    }  // end of convertNumToMoneyString fn
    
    
    

    getDate = () => {
        let today = new Date();
        let date = (today.getMonth()+1)+'/'+today.getDate()+'/'+today.getFullYear();
        return date
    }  // end of getDate fn

    cleanSqlDate = (fieldValue, fieldName) => {
        let year = fieldValue.slice(0, 4);
        let month = fieldValue.slice(5, 7);
        let day = fieldValue.slice(8, 10);
        return `${month}/${day}/${year}`
    };
    
    onGridRowsUpdated = ({ fromRow, toRow, updated }) => {
        this.setState(state => {
            const allRows = state.allRows.slice();
            for (let i = fromRow; i <= toRow; i++) {
                allRows[i] = { ...allRows[i], ...updated };
            }
            return { allRows };
        });
        console.log('')
    };
      
    saveGrid = () => {
        console.log (`In Save Grid`);
        

    }
    
    render() {
        return (
            <div className="pageDivClass">
            <p>length: {this.state.allRows.length}</p>

                <div  className="datGridClass">
                    <button>Add Row</button>
                    <button>Save</button>
                    <button onClick={this.props.toggleExpense}>Close</button>

                    <ReactDataGrid
                        // rows={rows}
                        columns={columns}
                        rowGetter={i => this.state.allRows[i]}
                        rowsCount={this.state.allRows.length}
                        onGridRowsUpdated={this.onGridRowsUpdated}
                        enableCellSelect={true}
                    />
                
                </div>
                
            </div>
             
        );
    }
}

  

export default connect(mapStoreToProps)(ExpenditureForm);
 