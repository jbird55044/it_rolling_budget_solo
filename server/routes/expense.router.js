const express = require('express');
const router = express.Router();
const pool = require('../modules/pool')
const {rejectUnauthenticated,} = require('../modules/authentication-middleware');
 

  
  router.post('/replacegrid', rejectUnauthenticated, (req, res) => {
    let payload = req.body
    console.log (`replacegrid-DELETE Payload:`, payload);
    for (row of payload.allRows) {
        const queryText = `DELETE FROM t_primary_expenditure WHERE id=$1;`;
        pool.query(queryText, [row.id])
        
    }
    for (row of payload.allRows) {
      const queryText = `INSERT INTO "t_primary_expenditure" (
        "budget_fk", "period", "year", "amount", "expense_note") VALUES (
         $1,  $2,  $3,
         $4,  $5
         ) RETURNING "id";`;
      const queryValues = [
          payload.budgetId, row.period, row.year, row.amount, row.expense_note   
        ];
      pool.query(queryText, queryValues)
    }
        
  });

    
  router.post('/addrow', rejectUnauthenticated, (req, res) => {
    let payload = req.body
    console.log (`addrow  PUT Payload:`, payload);
    const queryText = `INSERT INTO "t_primary_expenditure" (
      "budget_fk", "period", "year", "amount", "expense_note") VALUES (
       $1,  $2,  $3,
       $4,  $5
       ) RETURNING "id";`;
    const queryValues = [
        payload.budgetId, payload.newRecord.period, payload.newRecord.year, payload.newRecord.amount, payload.newRecord.expense_note   
      ]
      pool.query(queryText, queryValues).then(() => { res.sendStatus(200); })
      .catch((err) => {
        console.log('addrow  PUT expense Error', err);
        res.sendStatus(500);
      });
    });


module.exports = router;