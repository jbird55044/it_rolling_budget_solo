import React, { Component } from 'react';
import mapStoreToProps from '../../redux/mapStoreToProps';
import { connect } from 'react-redux';
import './BudgetForm.css'
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import FormControl from '@material-ui/core/FormControl';
import MenuItem from '@material-ui/core/MenuItem';
import InputLabel from '@material-ui/core/InputLabel';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Input from '@material-ui/core/Input';
import InputAdornment from '@material-ui/core/InputAdornment';
import classNames from 'classnames';



const styles = theme => ({
    root: {
        display: 'flex',
        flexWrap: 'wrap',
      },
      margin: {
        margin: theme.spacing.unit,
      },
      withoutLabel: {
        marginTop: theme.spacing.unit * 3,
      },
      textField: {
        flexBasis: 200,
      },
    });
 
  
   


class BudgetForm extends Component {
    
    state = {
        editForm: {
            id: 1,
            cost_center_fk: 0,
            point_person_fk: 0,
            gl_code_fk: 0,
            nomenclature: '',
            manufacturer: '',
            frequency_fk: 0,
            capitalizable_candidate: false,
        },
        recordNumber: 1,
        recordEditMode: false
    }
    
    // Stage Redux with up to date db info
    async componentDidMount() {
        // Get's data to fill form, both Budget and Expense (prefills for ID grab)
        this.props.dispatch({type: 'FETCH_BUDGETFORM', recordFinder: {
            businessUnitId: this.props.store.user.id,
            recordId: this.state.recordNumber,
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
        this.updateState();
    }

    // new record staging, get record from DB and put in REDUX
    updateState = () => {
        console.log (`in update State`);
        this.props.store.budget.budgetFormFillList.map((currentBudgetRecord, index) => {
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
            recordEditMode: false
        })
    }
    
    saveEdit = () => {
        console.log (`In saveEdit`);
        // do a PUT to move form to db
        this.props.dispatch({type: 'UPDATE_BUDGETFORM', payload: {
            editForm: this.state.editForm,
            businessUnitId: this.props.store.user.id,
            recordId: this.state.recordNumber,
            }
        });
    }

    deleteRecord = (editCheck) => {
        if (editCheck === 'needEdit') {
            alert ('need to be in edit mode to delete record');
            return;
        }
        console.log (`In Delete Form`);
        // TODO - confirmation of delete
        // Call Saga to delete - passing values to update record as well
        this.props.dispatch({type: 'DELETE_BUDGETFORM', payload: {
            deleteRecordId : this.state.editForm.id,
            businessUnitId: this.props.store.user.id,
            recordId: this.state.recordNumber,
            }
        });
        this.clearState();
    }

    clearState = () => {
        console.log (`In clearState`);
        this.setState({
            editForm: {
                id: 1,
                cost_center_fk: 0,
                point_person_fk: 0,
                gl_code_fk: 0,
                nomenclature: '',
                manufacturer: '',
                frequency_fk: 0,
                capitalizable_candidate: false,
            },
            recordEditMode: false
        });
    }

    handleChange = (event, name, type='text') => {
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
        } else {
            this.setState({
                editForm: {
                    ...this.state.editForm,
                    [name]: event.target.value 
                },
            });
        }
    }
    
    moveRecord = (direction) => {
        if (this.state.recordEditMode === true) {
            this.saveEdit();
        }
        if (direction === 'back') {
            this.setState ({
                recordNumber: this.state.recordNumber -=1,
                recordEditMode: false
            })
        } else if (direction === 'next') {
            this.setState ({
                recordNumber: this.state.recordNumber +=1,
                recordEditMode: false
            })
        }
        //refresh
        console.log (`ABOUT TO MOVE`, this.props.store.user.id, this.state.recordNumber);
        this.props.dispatch({type: 'FETCH_BUDGETFORM', recordFinder: {
            businessUnitId: this.props.store.user.id,
            recordId: this.state.recordNumber,
            }
        });
       
    };  //end of moveRecord
    
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
    
    valueFrequency = (fieldValue, fieldName) => {
        let returnValue='';
        if (this.state.recordEditMode) {
            returnValue = this.state.editForm.frequency_fk
        } else {
            returnValue = fieldValue
        }
        if (returnValue === null) return ''
        return returnValue;
    }

    
    render() {
        const { classes } = this.props;
        return (
            
            <div className="budgetFormClass">
            
            <h3>Budget Form List:</h3>

            {this.props.store.budget.budgetFormFillList.map((currentBudgetRecord, index) => {
                return (
                <div key={index}>
                    <p>Budget Information STATE: {this.state.editForm.id} </p>
                    <p>Budget Information REDUX: {currentBudgetRecord.id} </p>
                    {/* <p>Relative Record ID {this.state.recordNumber}</p> */}
                    <p>Budget Raw Info: {currentBudgetRecord.cost_center_fk} </p>
                    <p>Budget State Info: {this.state.editForm.cost_center_fk} </p>
                    <p>----</p>
                    {/* ----------- */}
                    {/* ----------- */}

                    <form className={classes.container} noValidate autoComplete="off">

                        <TextField
                            select
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
                            select
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




                    </form>
                    <hr/>
                    {/* ----------- */}

                    <TextField
                        select
                        style = {{minWidth: 800}}
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
                    {/* ----------- */}

                    <FormControl className={classes.margin}>
                        <InputLabel htmlFor="component-simple">Nomenclature</InputLabel>
                        <Input id="nomenclature-id" 
                            style = {{minWidth: 300}}
                            value = {this.valueNominclature(currentBudgetRecord.nomenclature, 'nomenclature')}
                            onChange={(event)=>this.handleChange(event,'nomenclature')} />
                    </FormControl>
                    
                    <FormControl className={classes.formControl}>
                        <InputLabel htmlFor="component-simple">Manufacturer</InputLabel>
                        <Input id="manufacturer-id" 
                            style = {{minWidth: 300}}
                            value = {this.valueManufacturer(currentBudgetRecord.manufacturer, 'manufacturer')}
                            onChange={(event)=>this.handleChange(event,'manufacturer')} />
                    </FormControl>

                    <hr/>
                    <form className={classes.container} noValidate autoComplete="off">

                    <FormControl className={classes.formControl}>
                    <TextField
                        select
                        label="Frequency"
                        className={classNames(classes.margin, classes.textField)}
                        value={this.valueFrequency(currentBudgetRecord.frequency_fk, 'frequency_fk')}
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
                    </FormControl>
         
                    <FormControlLabel
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
                    </form>
                </div>
                );
            })}

            <p>----</p>
          
            {this.props.store.budget.expenseFillList.map((expenses, index) => {
                return (
                    <div key={index}>
                    {/* <p>Expense Info</p> {budgetForm.id} */}
                    {JSON.stringify(expenses)}
                    </div>
                );
            })}

            <div  className="formControlClass">
                {this.state.recordEditMode?
                <button onClick={()=>this.moveRecord('back')}>Save-Back Record</button>:
                <button onClick={()=>this.moveRecord('back')}>Back Record</button>
                }
                {this.state.recordEditMode?
                <button onClick={()=>this.moveRecord('next')}>Save-Next Record</button>:
                <button onClick={()=>this.moveRecord('next')}>Next Record</button>
                }
                <p></p>
                <button onClick={()=>this.editRecord()}>Edit Record</button>
                {/* <button onClick={()=>this.saveEdit()}>Save Edit</button> */}
                <button onClick={()=>this.cancelEdit()}>Cancel Edit</button>
                
                {this.state.recordEditMode?
                <button onClick={()=>this.deleteRecord()}>DELETE</button>:
                <button onClick={()=>this.deleteRecord('needEdit')}>delete</button>
                }

            </div>
         
            </div>
        );
    }
}

BudgetForm.propTypes = {
    classes: PropTypes.object.isRequired,
};
  
// const putReduxStateOnProps = (reduxState) => ({
//     reduxState
//   })

export default connect(mapStoreToProps)(withStyles(styles)(BudgetForm));
 