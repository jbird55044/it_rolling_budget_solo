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
        "budget_fk", "period", "year", "amount", "expense_note", "archived") VALUES (
         $1,  $2,  $3,
         $4,  $5, $6
         ) RETURNING "id";`;
      const queryValues = [
          payload.budgetId, row.period, row.year, row.amount, row.expense_note, row.archived 
        ];
      pool.query(queryText, queryValues)
    }
        
  });

    
  router.post('/addrow', rejectUnauthenticated, (req, res) => {
    let payload = req.body
    console.log (`addrow  PUT Payload:`, payload);
    const queryText = `INSERT INTO "t_primary_expenditure" (
      "budget_fk", "period", "year", "amount", "expense_note", "archived") VALUES (
       $1,  $2,  $3,
       $4,  $5, $6
       ) RETURNING "id";`;
    const queryValues = [
        payload.budgetId, payload.newRecord.period, payload.newRecord.year, 
        payload.newRecord.amount, payload.newRecord.expense_note, payload.newRecord.archived
      ]
      pool.query(queryText, queryValues).then(() => { res.sendStatus(200); })
      .catch((err) => {
        console.log('addrow  PUT expense Error', err);
        res.sendStatus(500);
      });
    });

    router.put('/deleterows', rejectUnauthenticated, (req, res) => {
      let payload = req.body
      console.log (`deleteRows via archive bit-DELETE Payload:`, payload);
      for (row of payload.allRows) {
          const queryText = `UPDATE t_primary_expenditure SET archived = true WHERE id=$1;;`;
          pool.query(queryText, [row.id]).then(() => { res.sendStatus(200); })
          .catch((err) => {
            console.log('PUT Archive bit expense Error', err);
            res.sendStatus(500);
          });
      }
    });


module.exports = router;