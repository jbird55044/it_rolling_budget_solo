const express = require('express');
const router = express.Router();
const pool = require('../modules/pool')
const {rejectUnauthenticated,} = require('../modules/authentication-middleware');
 
// Primary Record getter using SQL CTE and Partitioning
// two different SQLs pull from either a specific record ID, or relitive row in partitioned table
router.get('/formfill', rejectUnauthenticated, (req, res) => {
  let queryText = ''
  let businessUnitId = req.query.businessUnitId
  let relitiveRecordId = req.query.relitiveRecordId
  let recordId = req.query.recordId
  if (recordId > 0 ) {
    recordFinder = recordId;
    queryText = `WITH _t_primary_budget AS 
        ( 
        SELECT t_primary_budget.id, nomenclature, manufacturer, capitalizable_candidate, credit_card_use, needs_review, notes, last_update,
        t_user_owner.business_unit, 
        tlist_gl_code.id AS gl_code_fk, tlist_gl_code.gl_account, tlist_gl_code.gl_name, tlist_gl_code.gl_type, tlist_gl_code.gl_examples,  
        tlist_cost_center.id AS cost_center_fk, tlist_cost_center.cost_center, tlist_cost_center.cost_center_description,
        tlist_point_person.id AS point_person_fk,tlist_point_person.point_person, tlist_point_person.pp_email_address,
        tlist_frequency.id AS frequency_fk,tlist_frequency.frequency, tlist_frequency.description, 
        tlist_expenditure_type.id AS expenditure_type_fk, tlist_expenditure_type.expenditure_type, tlist_expenditure_type.expenditure_description, 
        tlist_capitalized_life.id AS capitalize_life_fk, tlist_capitalized_life.life, tlist_capitalized_life.life_nominclature,
        row_number() over (PARTITION BY t_primary_budget.owner_fk ORDER BY t_primary_budget.id ASC) AS row_number
      FROM t_primary_budget
        JOIN t_user_owner ON t_user_owner.id = t_primary_budget.owner_fk
        JOIN tlist_gl_code ON tlist_gl_code.id = t_primary_budget.gl_code_fk
        JOIN tlist_cost_center ON tlist_cost_center.id = t_primary_budget.cost_center_fk
        JOIN tlist_frequency ON tlist_frequency.id = t_primary_budget.frequency_fk
        JOIN tlist_point_person ON tlist_point_person.id = t_primary_budget.point_person_fk
        JOIN tlist_expenditure_type ON tlist_expenditure_type.id = t_primary_budget.expenditure_type_fk
        JOIN tlist_capitalized_life ON tlist_capitalized_life.id = t_primary_budget.capitalize_life_fk
        WHERE t_primary_budget.owner_fk = $1 AND archived = false
      )
        SELECT * FROM _t_primary_budget WHERE id = $2;`;
  } else {
    recordFinder = relitiveRecordId
    queryText = `WITH _t_primary_budget AS 
        ( 
        SELECT t_primary_budget.id, nomenclature, manufacturer, capitalizable_candidate, credit_card_use, needs_review, notes, last_update,
        t_user_owner.business_unit, 
        tlist_gl_code.id AS gl_code_fk, tlist_gl_code.gl_account, tlist_gl_code.gl_name, tlist_gl_code.gl_type, tlist_gl_code.gl_examples,  
        tlist_cost_center.id AS cost_center_fk, tlist_cost_center.cost_center, tlist_cost_center.cost_center_description,
        tlist_point_person.id AS point_person_fk,tlist_point_person.point_person, tlist_point_person.pp_email_address,
        tlist_frequency.id AS frequency_fk,tlist_frequency.frequency, tlist_frequency.description, 
        tlist_expenditure_type.id AS expenditure_type_fk, tlist_expenditure_type.expenditure_type, tlist_expenditure_type.expenditure_description, 
        tlist_capitalized_life.id AS capitalize_life_fk, tlist_capitalized_life.life, tlist_capitalized_life.life_nominclature,
        row_number() over (PARTITION BY t_primary_budget.owner_fk ORDER BY t_primary_budget.id ASC) AS row_number
      FROM t_primary_budget
        JOIN t_user_owner ON t_user_owner.id = t_primary_budget.owner_fk
        JOIN tlist_gl_code ON tlist_gl_code.id = t_primary_budget.gl_code_fk
        JOIN tlist_cost_center ON tlist_cost_center.id = t_primary_budget.cost_center_fk
        JOIN tlist_frequency ON tlist_frequency.id = t_primary_budget.frequency_fk
        JOIN tlist_point_person ON tlist_point_person.id = t_primary_budget.point_person_fk
        JOIN tlist_expenditure_type ON tlist_expenditure_type.id = t_primary_budget.expenditure_type_fk
        JOIN tlist_capitalized_life ON tlist_capitalized_life.id = t_primary_budget.capitalize_life_fk
        WHERE t_primary_budget.owner_fk = $1 AND archived = false
      )
        SELECT * FROM _t_primary_budget WHERE row_number = $2;`;
  } 
  console.log (`----formfill GET - req.query.record ID:`, relitiveRecordId, ' businesUnit:', businessUnitId, ' recordId:', recordId);
  pool.query(queryText, [businessUnitId, recordFinder])
  // pool.query(queryText, [businessUnitId, relitiveRecordId])
    .then((result) => { 
      res.send(result.rows); 
      // console.log (`budgetForm rows:`,result.rows);
    })
    .catch((err) => {
      console.log('Error completing formfill query', err);
      res.sendStatus(500);
    });
}); 

// get max number of rows for form management in relitive table 
router.get('/formcount', rejectUnauthenticated, (req, res) => {
  let businessUnitId = req.query.businessUnitId
  // console.log (`----req.query.record ID:`, recordId, 'businesUnit:', businessUnitId , 'budgetId:', budgetId);
  const queryText = `SELECT COUNT (t_primary_budget.id) FROM t_primary_budget WHERE owner_fk = $1 AND archived = false;`;
  console.log ('in formCount get')
  pool.query(queryText, [businessUnitId])
    .then((result) => { 
      res.send(result.rows); 
      // console.log (`budgetForm rows:`,result.rows);
    })
    .catch((err) => {
      console.log('Error completing formCount query', err);
      res.sendStatus(500);
    });
}); 

// get the expense info for the budget entry
router.get('/expensefill', rejectUnauthenticated, (req, res) => {
  let budgetId = req.query.budgetId
  console.log (`--expensefill GET - req.query.budgetId:`, budgetId);
  const queryText = `SELECT *  FROM t_primary_expenditure
  WHERE t_primary_expenditure.budget_fk  = $1 AND archived = false
  Order BY year, period, id ASC`;
  pool.query(queryText, [budgetId])
    .then((result) => { res.send(result.rows); })
    .catch((err) => {
      console.log('Error completing expensefill query', err);
      res.sendStatus(500);
    });
}); 

// get the sum of the one or more expense items associated to the budget (for button indicator)
router.get('/expensesum', rejectUnauthenticated, (req, res) => {
  let budgetId = req.query.budgetId
  console.log (`--expensesum GET - req.query.budgetId:`, budgetId);
  const queryText = `SELECT SUM(t_primary_expenditure.amount) FROM t_primary_expenditure
  WHERE t_primary_expenditure.budget_fk = $1 AND archived = false`;
  console.log ('in expenseFill get')
  pool.query(queryText, [budgetId])
    .then((result) => { res.send(result.rows); })
    .catch((err) => {
      console.log('Error completing expensesum query', err);
      res.sendStatus(500);
    });
}); 

// get the relative 'row number' for specific record ID
router.get('/recordcorrelation', rejectUnauthenticated, (req, res) => {
  let recordId = req.query.recordId
  console.log (`--recordcorrelation GET - req.query.recordId:`, recordId);
  const queryText = `WITH _t_primary_budget AS 
        ( 
        SELECT t_primary_budget.id, 
        row_number() over (PARTITION BY t_primary_budget.owner_fk ORDER BY t_primary_budget.id ASC) AS row_number
      FROM t_primary_budget
        JOIN t_user_owner ON t_user_owner.id = t_primary_budget.owner_fk
        WHERE t_primary_budget.owner_fk = 1 AND archived = false
      )
        SELECT * FROM _t_primary_budget WHERE id=$1;`;
  console.log ('in expenseFill get')
  pool.query(queryText, [recordId])
    .then((result) => { res.send(result.rows); })
    .catch((err) => {
      console.log('Error completing recordcorrelation query', err);
      res.sendStatus(500);
    });
}); 


// update the budget record
router.put('/formfill', rejectUnauthenticated, (req, res) => {
  let payload = req.body.editForm
  // console.log (`formfill PUT Payload:`, payload);
  const queryText = `UPDATE t_primary_budget SET 
    cost_center_fk = $2,  
    point_person_fk = $3,
    gl_code_fk=$4,
    nomenclature = $5, 
    manufacturer = $6, 
    frequency_fk = $7,
    capitalizable_candidate = $8,
    capitalize_life_fk= $9,
    expenditure_type_fk = $10,
    credit_card_use = $11,
    needs_review = $12,
    notes = $13,
    last_update = $14
    WHERE id=$1;`;

  const queryValues = [
    payload.id,
    payload.cost_center_fk,
    payload.point_person_fk,
    payload.gl_code_fk,
    payload.nomenclature,
    payload.manufacturer,
    payload.frequency_fk,
    payload.capitalizable_candidate,
    payload.capitalize_life_fk, 
    payload.expenditure_type_fk,
    payload.credit_card_use,
    payload.needs_review,
    payload.notes,
    payload.last_update
  ];
  pool.query(queryText, queryValues)
    .then(() => { res.sendStatus(200); })
    .catch((err) => {
      console.log('Error completing PUT budget query', err);
      res.sendStatus(500);
    });
  });
  
  // 'delete' the form by setting a archive bit to hide from all future queries
  router.put('/deleteform', rejectUnauthenticated, (req, res) => {
    let payload = req.body
    console.log (`formfill DELETE PUT Payload:`, payload);
    const queryText = `UPDATE t_primary_budget SET archived = true WHERE id=$1;`;
    const queryValues = [ payload.deleteRecordId ];
    pool.query(queryText, queryValues)
      .then(() => { res.sendStatus(200); })
      .catch((err) => {
        console.log('Error completing DELETE budget query', err);
        res.sendStatus(500);
      });
    });

    // POST (add) new budget record from scratch - archive bit set by default to false @ db
    router.post('/addform', rejectUnauthenticated, (req, res) => {
      let payload = req.body.editForm
      console.log('incoming POST req.body:', payload);
      // RETURNING "id" will give us back the id of the created budget item
      const queryText = `INSERT INTO "t_primary_budget" (
        "owner_fk",           "gl_code_fk",           "cost_center_fk",
        "point_person_fk",    "nomenclature",         "manufacturer",
        "frequency_fk",       "expenditure_type_fk",  "capitalizable_candidate",
        "capitalize_life_fk", "credit_card_use",      "needs_review",
         "notes",             "last_update"            ) VALUES (
         $1,  $2,  $3,
         $4,  $5,  $6,
         $7,  $8,  $9,
         $10, $11, $12,
         $13, $14
         ) RETURNING "id";`;
      const queryValues = [
        payload.id,                 payload.gl_code_fk,          payload.cost_center_fk,
        payload.point_person_fk,    payload.nomenclature,        payload.manufacturer,
        payload.frequency_fk,       payload.expenditure_type_fk, payload.capitalizable_candidate,
        payload.capitalize_life_fk, payload.credit_card_use,     payload.needs_review,
        payload.notes,              payload.last_update
      ];
         // FIRST QUERY MAKES MOVIE
      pool.query(queryText, queryValues)
      .then(result => {
        const createdBudgetId = result.rows[0].id
        console.log('New Record Id:', createdBudgetId); //ID IS HERE!
      }).catch(err => {
        console.log(err);
        res.sendStatus(500)
      })
  });


module.exports = router;