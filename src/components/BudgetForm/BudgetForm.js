import React, { Component } from 'react';
import mapStoreToProps from '../../redux/mapStoreToProps';
import { connect } from 'react-redux';
import './BudgetForm.css'
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import Slide from '@material-ui/core/Slide';
import OutlinedInput from '@material-ui/core/OutlinedInput';
import MenuItem from '@material-ui/core/MenuItem';
import InputLabel from '@material-ui/core/InputLabel';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';


const styles = theme => ({
    container: {
      display: 'flex',
      flexWrap: 'wrap',
    },
    textField: {
      marginLeft: theme.spacing.unit,
      marginRight: theme.spacing.unit,
    },
    dense: {
      marginTop: 16,
    },
    menu: {
      width: 200,
    },
    root: {
        display: 'flex',
        flexWrap: 'wrap',
    },
    formControl: {
        margin: theme.spacing.unit,
        minWidth: 120,
        maxWidth: 300,
    },
    
  });
  const ITEM_HEIGHT = 48;
  const ITEM_PADDING_TOP = 8;
  const MenuProps = {
     PaperProps: {
        style: {
            maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
            width: 250,
        },
      },
    };
   


class BudgetForm extends Component {
    
    state = {
        editForm: {
            id: 1,
            nomenclature: 'test',
            manufacturer: 'test',
            capitalizable_candidate: false,
            frequency_fk:''
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
                    nomenclature: currentBudgetRecord.nomenclature,
                    manufacturer: currentBudgetRecord.manufacturer || '',
                    capitalizable_candidate: currentBudgetRecord.capitalizable_candidate,
                    frequency_fk: currentBudgetRecord.frequency_fk,
                },
            });
        })
        return
    }

    editRecord = () => {
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
        // do a PUT to move form to db
        this.props.dispatch({type: 'UPDATE_BUDGETFORM', payload: {
            editForm: this.state.editForm
            }
        });
        //set local state to turn off edit mode so DOM reads from REDUX again
        this.setState ({
            recordEditMode: false
        })
        // refresh DOM
        this.props.dispatch({type: 'FETCH_BUDGETFORM', recordFinder: {
            businessUnitId: this.props.store.user.id,
            recordId: this.state.recordNumber,
            }
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
        if (direction === 'back') {
            this.setState ({
                recordNumber: this.state.recordNumber -=1
            })
        } else if (direction === 'next') {
            this.setState ({
                recordNumber: this.state.recordNumber +=1
            })
        }
        
        if (this.state.recordEditMode === true) {
            this.saveEdit();
        }

        //refresh
        this.props.dispatch({type: 'FETCH_BUDGETFORM', recordFinder: {
                businessUnitId: this.props.store.user.id,
                recordId: this.state.recordNumber,
            }
        });
        this.updateState();
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
                    {/* <p>Budget Raw Info: {currentBudgetRecord.frequency_fk} </p> */}
                    {/* <p>Budget State Info: {this.state.editForm.frequency_fk} </p> */}
                    <p>----</p>
                    {/* ----------- */}

                    <FormControl variant="outlined" className={classes.formControl}>
                        <InputLabel
                            ref={ref => {
                            this.InputLabelRef = ref;
                            }}
                            htmlFor="outlined-age-simple"
                        >Frequency Selector
                        </InputLabel>
                        <Select
                            value={this.valueFrequency(currentBudgetRecord.frequency_fk, 'frequency_fk')}
                            onChange={(event)=>this.handleChange(event, 'frequency_fk')}
                            input={
                            <OutlinedInput
                                labelWidth={this.state.labelWidth}
                                name="age"
                                id="outlined-age-simple"
                            />}>
                            <MenuItem value="">
                            <em>None</em>
                            </MenuItem>
                                {this.props.store.tlist.tlistFrequency.map(records => (
                                    <MenuItem key={records.id} value={records.id}>
                                    {records.frequency} - {records.description}
                                    </MenuItem>
                                ))}
                        </Select>
                    </FormControl>

                    {/* ----------- */}

                    <form className={classes.container} noValidate autoComplete="off">
                        <TextField
                        id="nomenclature-id"
                        label="Nomenclature"
                        className={classes.textField}
                        value = {this.valueNominclature(currentBudgetRecord.nomenclature, 'nomenclature')}
                        onChange={(event)=>this.handleChange(event,'nomenclature')}
                        margin="normal"
                        variant="filled"
                        />
                    </form>
                    <form className={classes.container} noValidate autoComplete="off">
                        <TextField
                        id="manufacturer-id"
                        label="Manufacturer"
                        className={classes.textField}
                        value = {this.valueManufacturer(currentBudgetRecord.manufacturer, 'manufacturer')}
                        // value={currentBudgetRecord.manufacturer}
                        onChange={(event)=>this.handleChange(event,'manufacturer')}
                        margin="normal"
                        variant="filled"
                        />
                    </form>
                    <p>Capitalized Candidate Raw: {currentBudgetRecord.capitalizable_candidate}</p>
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
                {/* <p>Local State Edit Record:</p> {JSON.stringify(this.state.editForm)} */}

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
 