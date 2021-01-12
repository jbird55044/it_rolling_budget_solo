import React, { Component } from 'react';
import mapStoreToProps from '../../redux/mapStoreToProps';
import { connect } from 'react-redux';
import './BudgetForm.css'
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';


const styles = {
    card: {
      maxWidth: 250,
      margin: 20, 
    },
    media: {
      height: 250,
    },
  };
  


class BudgetForm extends Component {
    
    state = {
        editForm: {
            id: 1,
            nomenclature: 'test',
            manufacturer: 'test',
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

        this.updateState();
    }

    // new record staging, get record from DB and put in REDUX
    updateState = () => {
        console.log (`in update State`);
        this.props.store.budget.budgetFormFillList.map((currentBudgetRecord, index) => {
                console.log (`in budgetFormFillList map1`, currentBudgetRecord);

        })
        this.props.store.budget.budgetFormFillList.map((currentBudgetRecord, index) => {
            console.log (`in budgetFormFillList map2`, currentBudgetRecord);
            this.setState({
                editForm: {
                    id: currentBudgetRecord.id,
                    nomenclature: currentBudgetRecord.nomenclature,
                    manufacturer: currentBudgetRecord.manufacturer || '',
                    capitalizable_candidate: currentBudgetRecord.capitalizable_candidate,
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


    handleChange = (event, name) => {
        console.log (`in Handle Change, name:`, name, 'event', event);
        this.setState({
            editForm: {
                ...this.state.editForm,
                [name]: event.target.value 
            },
        });
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

    
    render() {
        const { classes } = this.props;
        return (
            <div className={classes.root}>
            
            <p>tlist:</p> {JSON.stringify(this.props.store.tlist.tlistFrequency)}
            

            <h3>Budget Form List:</h3>

            {this.props.store.budget.budgetFormFillList.map((currentBudgetRecord, index) => {
                return (
                <div key={index}>
                    <p>Budget Information STATE: {this.state.editForm.id} </p>
                        <p>Budget Information REDUX: {currentBudgetRecord.id} </p>
                        <p>----</p>
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
                    <form className={classes.container} noValidate autoComplete="off">
                        <TextField
                        id="capitalizable_candidate-id"
                        label="capitalizable_candidate"
                        className={classes.textField}
                        value={this.state.recordEditMode? this.state.editForm.capitalizable_candidate : currentBudgetRecord.capitalizable_candidate}
                        // value={currentBudgetRecord.capitalizable_candidate}
                        onChange={(event)=>this.handleChange(event,'capitalizable_candidate')}
                        margin="normal"
                        variant="filled"
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
 