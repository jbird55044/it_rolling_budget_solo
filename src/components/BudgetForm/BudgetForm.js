import React, { Component } from 'react';
import mapStoreToProps from '../../redux/mapStoreToProps';
import { connect } from 'react-redux';
import './BudgetForm.css'
import ExpenditureForm from '../ExpenditureForm/ExpenditureForm'

import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Input from '@material-ui/core/Input';
import InputAdornment from '@material-ui/core/InputAdornment';
import MenuItem from '@material-ui/core/MenuItem';
import classNames from 'classnames';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Slide from '@material-ui/core/Slide';



const styles = theme => ({
    container: {
        display: 'flex',
        flexWrap: 'wrap',
      },
      formControl: {
        margin: theme.spacing.unit,
      },
      margin: {
        margin: theme.spacing.unit - 3,
        paddingTop: theme.spacing.unit - 2,
        paddingBottom: theme.spacing.unit - 2,
      },
        textField: {
        flexBasis: 200,
      },
      buttons: {
        boxSizing: 'border-box',
        width: 400,
        float: 'left'
      },
      bcolor1: {
          backgroundColor: '#99AC5D',
      },
      bcolor2: {
        backgroundColor: '#778745',
      },
      headerClass: {
        display: 'box',
        boxSizing: 'none',
        width: '100%',
        float: 'right',
        backgroundColor: 'white',
      }
    });
 
  
    function Transition(props) {
        return <Slide direction="up" {...props} />;
      }
      


class BudgetForm extends Component {
    
    state = {
        editForm: {
            id: 1,
            cost_center_fk: 0,
            point_person_fk: 0,
            gl_code_fk: 0,
            nomenclature: '',
            manufacturer: '',
            frequency_fk: 1,
            capitalizable_candidate: false,
            capitalize_life_fk: 1,
            expenditure_type_fk: 1,
            credit_card_use: false,
            needs_review: false,
            notes: '',
            last_update: '',
            total: 0
        },
        relitiveRecordId: 1,
        comingFromPicker: false,
        recordEditMode: false,
        recordAddMode: false,
        deleteConfirmDialog: false,
        expenseWindowOpen: false
    }
    
    // Stage Redux with up to date db info
    async componentDidMount() {
        //refresh relative record number w/ correct row based on passed Record ID (if passed)
        if (this.props.store.budgetForm.passedRecordId > 0) {
            this.props.dispatch({type: 'FETCH_RECORD_CORRELATION_ROW', recordFinder: {
                    recordId: this.props.store.budgetForm.passedRecordId
                }
            });    
            this.setState ({
                comingFromPicker: true
            })
       }
       
        // Get's data to fill form, both Budget and Expense (prefills for ID grab)
        this.props.dispatch({type: 'FETCH_BUDGETFORM', recordFinder: {
            businessUnitId: this.props.store.user.id,
            relitiveRecordId: this.state.relitiveRecordId,
            recordId: this.props.store.budgetForm.passedRecordId
            }
        });
     
        // grab tlist for pull-down populations
        this.props.dispatch({type: 'FETCH_TLIST_GLCODE'});
        this.props.dispatch({type: 'FETCH_TLIST_BUSINESSUNIT'});
        this.props.dispatch({type: 'FETCH_TLIST_FREQUENCY'});
        this.props.dispatch({type: 'FETCH_TLIST_COSTCENTER', recordFinder: {
            businessUnitId: this.props.store.user.id,
            }
        });
        this.props.dispatch({type: 'FETCH_TLIST_POINTPERSON', recordFinder: {
            businessUnitId: this.props.store.user.id,
            }
        });
        this.props.dispatch({type: 'FETCH_TLIST_CAPITALIZEDLIFE'});
        this.props.dispatch({type: 'FETCH_TLIST_EXPENDITURETYPE', recordFinder: {
            businessUnitId: this.props.store.user.id,
            }
        });

        // clear incoming record ID if passed for first record start next time in
        this.props.dispatch({type: 'SET_PASSEDRECORDID', payload: 0 });

        this.updateState();

    }

    // new record staging, get record from DB and put in REDUX
    updateState = () => {
        let lastUpdateGrabber = this.getDate()
        console.log (`in update State`, lastUpdateGrabber);
        this.props.store.budgetForm.budgetFormFillList.map((currentBudgetRecord, index) => {
            console.log (`in budgetFormFillList map2`, currentBudgetRecord);
            this.setState({
                editForm: {
                    id: currentBudgetRecord.id,
                    cost_center_fk: currentBudgetRecord.cost_center_fk,
                    point_person_fk: currentBudgetRecord.point_person_fk,
                    gl_code_fk: currentBudgetRecord.gl_code_fk,
                    nomenclature: currentBudgetRecord.nomenclature,
                    manufacturer: currentBudgetRecord.manufacturer || '',
                    frequency_fk: currentBudgetRecord.frequency_fk,
                    capitalizable_candidate: currentBudgetRecord.capitalizable_candidate,
                    capitalize_life_fk: currentBudgetRecord.capitalize_life_fk,
                    expenditure_type_fk: currentBudgetRecord.expenditure_type_fk,
                    credit_card_use: currentBudgetRecord.credit_card_use,
                    needs_review: currentBudgetRecord.needs_review,
                    notes: currentBudgetRecord.notes,
                    last_update: lastUpdateGrabber
                },
                
            });
        })
        return
    }

    editRecord = () => {
        console.log (`In editRecord`);
        this.updateState();
        this.setState ({
            recordEditMode: true
        })
        return
    }

    cancelEdit = () => {
        this.setState ({
            recordEditMode: false,
            recordAddMode: false,
            deleteConfirmDialog: false
        })
    }
    
    saveEdit = () => {
        console.log (`In saveEdit`, this.getDate());
       
        if (this.state.recordAddMode) {
            // do a POST to move populated form to db NEW record number
            console.log (`In Add Record, RelitiveRecordId:`, this.state.relitiveRecordId );
            this.props.dispatch({type: 'ADD_NEW_BUDGETFORM', payload: {
                editForm: this.state.editForm,
                businessUnitId: this.props.store.user.id,
                relitiveRecordId: this.state.relitiveRecordId,
                }
            });
            this.props.dispatch({type: 'FETCH_BUDGET_RECORD_COUNT', recordFinder: {
                businessUnitId: this.props.store.user.id,
                }
            });
        } else {
            // do a PUT to move populated form to db current record number
            this.props.dispatch({type: 'UPDATE_BUDGETFORM', payload: {
                editForm: this.state.editForm,
                businessUnitId: this.props.store.user.id,
                relitiveRecordId: this.state.relitiveRecordId,
                }
            });
        }
    }

    deleteConfirm = () => {
        this.setState ({
            deleteConfirmDialog: true
        });
    }
    
    deleteRecord = () => {
        if (!this.state.recordEditMode) {
            alert ('need to be in edit mode to delete record');
            return;
        }
        console.log (`In Delete Form`);
        // TODO - confirmation of delete
        // Call Saga to delete - passing values to update record as well
        this.props.dispatch({type: 'DELETE_BUDGETFORM', payload: {
            deleteRecordId : this.state.editForm.id,
            businessUnitId: this.props.store.user.id,
            relitiveRecordId: this.state.relitiveRecordId,
            }
        });
        this.clearState();
    }

    addRecord = () => {
        this.clearState();
        this.setState ({
            relitiveRecordId: this.props.store.budgetForm.budgetFormCount - 1,
            recordEditMode: true,
            recordAddMode: true
        })
        console.log (`in add record - record # from store:`, this.props.store.budgetForm.budgetFormCount);
        console.log (`in add record - record # from state:`, this.state.relitiveRecordId);
    }


    clearState = () => {
        let lastUpdateGrabber = this.getDate()
        console.log (`In clearState`, lastUpdateGrabber);
        this.setState({
            editForm: {
                id: 1,
                cost_center_fk: 0,
                point_person_fk: 0,
                gl_code_fk: 0,
                nomenclature: '',
                manufacturer: '',
                frequency_fk: 1,
                capitalizable_candidate: false,
                capitalize_life_fk: 1,
                expenditure_type_fk: 1,
                credit_card_use: false,
                needs_review: false,
                notes: '',
                last_update: lastUpdateGrabber,
                total: 0
            },
            recordEditMode: false,
            recordAddMode: false,
            deleteConfirmDialog:false,
        });
    }

    handleChange = (event, name, type='editForm') => {
        console.log (`in Handle Change, name:`, name, 'event', event, 'type', type);
        if (type === 'binary') {
            console.log (`in binary, value:`, event.target.value);
            if (event.target.value === 'true') {
                this.setState({
                    editForm: {
                        ...this.state.editForm,
                        [name]: false 
                    },
                });
            } else if (event.target.value === 'false'){
                this.setState({
                    editForm: {
                        ...this.state.editForm,
                        [name]: true 
                    },
                });
            }
        } else if (type === 'controlInt') {
            this.setState({
                    ...this.state,
                    [name]: parseInt(event.target.value) 
            });
        } else {
            this.setState({
                editForm: {
                    ...this.state.editForm,
                    [name]: event.target.value 
                },
            });
        }
    }
    
    moveRecord = (recordMove) => {
        console.log ('Move Reord, relitiveRecordId type:', typeof(this.state.relitiveRecordId), this.state.relitiveRecordId)
        
        if (this.state.recordEditMode === true) {
            this.saveEdit();
        }
        if (recordMove === 'back') {
            if (this.state.relitiveRecordId > 1 ) {
                this.setState ({
                    relitiveRecordId: this.state.relitiveRecordId -= 1,
                    recordEditMode: false,
                    recordAddMode: false
                })
            } else {
                this.setState ({
                    relitiveRecordId: this.state.relitiveRecordId = 1,
                    recordEditMode: false,
                    recordAddMode: false
                })
            }
        } else if (recordMove === 'next') {
            
            if (this.state.relitiveRecordId < this.props.store.budgetForm.budgetFormCount ) {
                this.setState ({
                    relitiveRecordId: this.state.relitiveRecordId += 1,
                    recordEditMode: false,
                    recordAddMode: false
                })
            } else {
                this.setState ({
                    relitiveRecordId: this.props.store.budgetForm.budgetFormCount,
                    recordEditMode: false,
                    recordAddMode: false
                })
            }
        } else if (recordMove === 'last') {
            this.setState ({
                relitiveRecordId: this.props.store.budgetForm.budgetFormCount,
                recordEditMode: false,
                recordAddMode: false
            })
            console.log (`Record move last`, this.props.store.budgetForm.budgetFormCount);
        } else {
            this.setState ({
                relitiveRecordId: parseInt(recordMove),
                recordEditMode: false,
                recordAddMode: false
            })
        }
       this.refreshDom();
       
    };  //end of moveRecord
    
// // check for specific user input criteria 
// function isValidString(str) {  
//     if ( typeof str != "string" ) return false  
//     if ( str.trim().length < 3 ) return false
//     return true
// };  //end of isValidString fn
    

//   // check for specific user input criteria 
//   function isValidNumber(str) {
//     if (typeof str != "string") return false //Process as string  
//     if ( str.length < 3 ) return false
//     return !isNaN(str) && !isNaN(parseFloat(str)) 
//   }; // end of isValidNumber fn


    refreshDom = () => {
        if (this.state.comingFromPicker) {
            this.setState ({
                relitiveRecordId: this.props.store.budgetForm.recordCorrelationRow
            });
            this.setState ({
                comingFromPicker: false
            });
        };
        this.props.dispatch({type: 'FETCH_BUDGETFORM', recordFinder: {
            businessUnitId: this.props.store.user.id,
            relitiveRecordId: this.state.relitiveRecordId,
            }
        });
    }

    toggleExpense = (recordId) => {
        this.setState({
            expenseWindowOpen: !this.state.expenseWindowOpen,
        })
    }

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
    

    valueNominclature = (fieldValue, fieldName) => {
        let returnValue='';
        if (this.state.recordEditMode) {
            returnValue = this.state.editForm.nomenclature
        } else {
            returnValue = fieldValue
        }
        if (returnValue === null) return ''
        return returnValue;
    }

    valueManufacturer = (fieldValue, fieldName) => {
        let returnValue='';
        if (this.state.recordEditMode) {
            returnValue = this.state.editForm.manufacturer
        } else {
            returnValue = fieldValue
        }
        if (returnValue === null) return ''
        return returnValue;
    }

    valueNotes = (fieldValue, fieldName) => {
        let returnValue='';
        if (this.state.recordEditMode) {
            returnValue = this.state.editForm.notes
        } else {
            returnValue = fieldValue
        }
        if (returnValue === null) return ''
        return returnValue;
    }
    
    
    render() {
        const { classes } = this.props;
        return (
            
        <div className="pageDivClass">
            <h3>Budget Form List:</h3>
            

            {this.props.store.budgetForm.budgetFormFillList.map((currentBudgetRecord, index) => {
                return (
                <div key={index}>
                    <div  className={classes.headerClass} noValidate autoComplete="off">
                        <p>Last Update: {this.cleanSqlDate(currentBudgetRecord.last_update, 'last_update')}</p>
                        <p>&nbsp;</p>
                        <p> ID: {this.state.recordEditMode? this.state.editForm.id : currentBudgetRecord.id} </p>
                    </div>
                    <div  className={classes.headerClass} noValidate autoComplete="off">
                        {/* <p>Budget Information STATE: {this.state.editForm.id} </p> */}
                        {/* <p>Relative Record ID {this.state.relitiveRecordId}</p> */}
                        {/* <p>Budget Raw Info: {currentBudgetRecord.cost_center_fk} </p> */}
                        {/* <p>Budget State Info: {this.state.editForm.cost_center_fk} </p> */}
                        <p>-------------------------------------------</p>
                    </div>

                    <form className={classes.container, classes.bcolor1} noValidate autoComplete="off">

                        <TextField
                            select style = {{minWidth: 100}}
                            label="Cost Center"
                            className={classNames(classes.margin, classes.textField)}
                            value={this.state.recordEditMode? this.state.editForm.cost_center_fk : currentBudgetRecord.cost_center_fk}
                            onChange={(event)=>this.handleChange(event, 'cost_center_fk')}
                            // InputProps={{startAdornment: <InputAdornment position="start">-</InputAdornment>,}}
                            >
                            <MenuItem value="">
                                <em>None</em>
                                </MenuItem>
                                    {this.props.store.tlist.tlistCostCenter.map(records => (
                                        <MenuItem key={records.id} value={records.id}>
                                        {records.cost_center} - {records.cost_center_description}
                                        </MenuItem>
                                    ))}
                        </TextField>

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
                    <hr/>
                    </form>
                    {/* ----------- */}
                    
                    <form className={classes.container, classes.bcolor2} noValidate autoComplete="off">

                        <TextField
                            select style = {{minWidth: 800}}
                            label="GL Code"
                            className={classNames(classes.margin, classes.textField)}
                            value={this.state.recordEditMode? this.state.editForm.gl_code_fk : currentBudgetRecord.gl_code_fk}
                            onChange={(event)=>this.handleChange(event, 'gl_code_fk')}
                            // InputProps={{startAdornment: <InputAdornment position="start">-</InputAdornment>,}}
                            >
                            <MenuItem value="">
                                <em>None</em>
                                </MenuItem>
                                    {this.props.store.tlist.tlistGlcode.map(records => (
                                        <MenuItem key={records.id} value={records.id}>
                                        {records.gl_account} - {records.gl_name} - {records.gl_type}- {records.gl_examples}
                                        </MenuItem>
                                    ))}
                        </TextField>
                        <p></p>

                        <TextField
                            label="Nomenclature"
                            style = {{minWidth: 400}}
                            className={classNames(classes.margin, classes.textField)}
                            value = {this.valueNominclature(currentBudgetRecord.nomenclature, 'nomenclature')}
                            onChange={(event)=>this.handleChange(event,'nomenclature')}  
                            ></TextField>

                        <TextField
                            label="Manufacturer"
                            style = {{minWidth: 400}}
                            className={classNames(classes.margin, classes.textField)}
                            value = {this.valueManufacturer(currentBudgetRecord.manufacturer, 'manufacturer')}
                            onChange={(event)=>this.handleChange(event,'manufacturer')}  
                            ></TextField>
                    <hr/>
                    </form>
                    {/* ----------- */}

                    <form className={classes.container, classes.bcolor1} noValidate autoComplete="off">
                        <TextField
                            select style = {{minWidth: 250}}
                            label="Frequency"
                            className={classNames(classes.margin, classes.textField)}
                            value={this.state.recordEditMode? this.state.editForm.frequency_fk : currentBudgetRecord.frequency_fk}
                            onChange={(event)=>this.handleChange(event, 'frequency_fk')}
                            // InputProps={{startAdornment: <InputAdornment position="start">-</InputAdornment>,}}
                            >
                            <MenuItem value="">
                                <em>None</em>
                                </MenuItem>
                                    {this.props.store.tlist.tlistFrequency.map(records => (
                                        <MenuItem key={records.id} value={records.id}>
                                        {records.frequency} - {records.description}
                                        </MenuItem>
                                    ))}
                        </TextField>
            
                        <FormControlLabel
                            className={classes.margin}
                            control={
                                <Checkbox
                                checked={this.state.recordEditMode? this.state.editForm.credit_card_use : currentBudgetRecord.credit_card_use}
                                onChange={(event)=>this.handleChange(event,'credit_card_use', 'binary')}
                                value={this.state.recordEditMode? this.state.editForm.credit_card_use : currentBudgetRecord.credit_card_use}
                                color="primary"
                                />
                            }
                            label="Credit Card?"
                        />
                        <FormControlLabel
                            className={classes.margin}
                            control={
                                <Checkbox
                                checked={this.state.recordEditMode? this.state.editForm.capitalizable_candidate : currentBudgetRecord.capitalizable_candidate}
                                onChange={(event)=>this.handleChange(event,'capitalizable_candidate', 'binary')}
                                value={this.state.recordEditMode? this.state.editForm.capitalizable_candidate : currentBudgetRecord.capitalizable_candidate}
                                color="primary"
                                />
                            }
                            label="Capitalized Candidate"
                        />
                        {currentBudgetRecord.capitalizable_candidate || this.state.recordEditMode?
                            <TextField
                                select style = {{minWidth: 100}}
                                label="Capitalized Life"
                                className={classNames(classes.margin, classes.textField)}
                                value={this.state.recordEditMode? this.state.editForm.capitalize_life_fk : currentBudgetRecord.capitalize_life_fk}
                                onChange={(event)=>this.handleChange(event, 'capitalize_life_fk')}
                                // InputProps={{startAdornment: <InputAdornment position="start">-</InputAdornment>,}}
                                >
                                <MenuItem value="">
                                    <em>None</em>
                                    </MenuItem>
                                        {this.props.store.tlist.tlistCapitalizedLife.map(records => (
                                            <MenuItem key={records.id} value={records.id}>
                                            {records.life_nominclature} 
                                            </MenuItem>
                                        ))}
                            </TextField>:
                        <p></p>}

                            <p></p>
                            <TextField
                                select style = {{minWidth: 400}}
                                label="Expenditure Type"
                                className={classNames(classes.margin, classes.textField)}
                                value={this.state.recordEditMode? this.state.editForm.expenditure_type_fk : currentBudgetRecord.expenditure_type_fk}
                                onChange={(event)=>this.handleChange(event, 'expenditure_type_fk')}
                                // InputProps={{startAdornment: <InputAdornment position="start">-</InputAdornment>,}}
                                >
                                <MenuItem value="">
                                    <em>None</em>
                                    </MenuItem>
                                        {this.props.store.tlist.tlistExpenditureType.map(records => (
                                            <MenuItem key={records.id} value={records.id}>
                                            {records.expenditure_type} - {records.expenditure_description}
                                            </MenuItem>
                                        ))}
                            </TextField>

                        <FormControlLabel
                            className={classes.margin}
                            control={
                                <Checkbox
                                checked={this.state.recordEditMode? this.state.editForm.needs_review : currentBudgetRecord.needs_review}
                                onChange={(event)=>this.handleChange(event,'needs_review', 'binary')}
                                value={this.state.recordEditMode? this.state.editForm.needs_review : currentBudgetRecord.needs_review}
                                color="primary"
                                />
                            }
                            label="Tentative Entry"
                        />
                        <TextField
                            label="Notes"
                            variant="outlined"
                            style = {{minWidth: 600}}
                            className={classNames(classes.margin, classes.textField)}
                            value = {this.valueNotes(currentBudgetRecord.notes, 'notes')}
                            onChange={(event)=>this.handleChange(event,'notes')}  
                        ></TextField>

                        {this.state.recordEditMode?
                            <p></p> :
                            <button className="buttonClass" onClick={()=>this.toggleExpense(currentBudgetRecord.id)}>Expenditure: ${this.convertNumToMoneyString(this.props.store.budgetForm.expenseSum)}
                            </button>}
                        {this.state.expenseWindowOpen?
                            <ExpenditureForm currentBudgetId={currentBudgetRecord.id} 
                                relitiveRecordId={this.state.relitiveRecordId} toggleExpense={this.toggleExpense}/>:
                            <p></p>}

                    </form>
                </div>
                );
            })}

           <hr/>

            <div className={classes.buttons}>
                {this.state.recordEditMode?
                <button className="buttonClass" onClick={()=>this.moveRecord('back')}>Save Record</button>:
                <button className="buttonClass" onClick={()=>this.moveRecord('back')}>Back Record</button>
                }
                {this.state.recordEditMode?
                <p></p>:
                <button className="buttonClass" onClick={()=>this.moveRecord('next')}>Next Record</button>
                }
                 {this.state.recordEditMode?
                <p></p>:
                <button className="buttonClass" onClick={()=>this.moveRecord('last')}>Last Record</button>
                }
                {this.state.recordEditMode?
                <p></p>:
                <button className="buttonClass" onClick={()=>this.refreshDom()}>Refresh</button>
                }
                <p></p>
                {!this.state.recordAddMode?
                <button className="buttonClass" onClick={()=>this.editRecord()}>Edit Record</button>:
                <p></p>}

                {this.state.recordEditMode && !this.state.recordAddMode?
                <button className="buttonClass" onClick={()=>this.cancelEdit()}>Cancel Edit</button>:
                <p></p>}

                {this.state.recordEditMode && this.state.recordAddMode?
                <button className="buttonClass" onClick={()=>this.cancelEdit()}>Cancel Add</button>:
                <p></p>}
                
                {this.state.recordEditMode && !this.state.recordAddMode?
                <button className="buttonClass" onClick={()=>this.deleteConfirm()}>DELETE</button>:
                <p></p>}

                {!this.state.recordAddMode && !this.state.recordEditMode?
                <button className="buttonClass" onClick={()=>this.addRecord()}>Add New Record</button>:
                <p></p>}  

                <TextField
                    label="Record"
                    variant="outlined"
                    style = {{width: 80}}
                    className={classNames(classes.margin, classes.intField)}
                    value = {this.state.relitiveRecordId}
                    onChange={(event)=>this.handleChange(event,'relitiveRecordId', 'controlInt')}  
                ></TextField>

            </div>
            
            <div>
            <Dialog
                open={this.state.deleteConfirmDialog}
                TransitionComponent={Transition}
                keepMounted
                onClose={this.handleClose}
                aria-labelledby="alert-dialog-slide-title"
                aria-describedby="alert-dialog-slide-description"
                >
                <DialogTitle id="alert-dialog-slide-title">
                    {"Delete Record?"}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-slide-description">
                    Would you like to delete record: {this.state.editForm.id} ?.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={this.cancelEdit} color="primary">
                    Cancel
                    </Button>
                    <Button onClick={this.deleteRecord} color="secondary">
                    Delete
                    </Button>
                </DialogActions>
                </Dialog>
            </div>
            
        </div>
        );
    }
}

BudgetForm.propTypes = {
    classes: PropTypes.object.isRequired,
};
  

export default connect(mapStoreToProps)(withStyles(styles)(BudgetForm));
 