const express = require('express');
const router = express.Router();
const pool = require('../modules/pool')
const {rejectUnauthenticated,} = require('../modules/authentication-middleware');
 
// Primary Record getter using SQL CTE and Partitioning
router.get('/fulllist', rejectUnauthenticated, (req, res) => {
  let businessUnitId = req.query.businessUnitId
  let selectedYear = req.query.selectedYear
  let budgetId = req.query.budgetId
  console.log (`----Report Router`, businessUnitId );
  const queryText = `SELECT t_primary_budget.id, nomenclature, manufacturer, capitalizable_candidate, credit_card_use, needs_review, notes, last_update,
  t_user_owner.business_unit, 
  tlist_gl_code.id AS gl_code_fk, tlist_gl_code.gl_account, tlist_gl_code.gl_name, tlist_gl_code.gl_type, tlist_gl_code.gl_examples,  
  tlist_cost_center.id AS cost_center_fk, tlist_cost_center.cost_center, tlist_cost_center.cost_center_description,
  tlist_point_person.id AS point_person_fk,tlist_point_person.point_person, tlist_point_person.pp_email_address,
  tlist_frequency.id AS frequency_fk,tlist_frequency.frequency, tlist_frequency.description, 
  tlist_expenditure_type.id AS expenditure_type_fk, tlist_expenditure_type.expenditure_type, tlist_expenditure_type.expenditure_description, 
  tlist_capitalized_life.id AS capitalize_life_fk, tlist_capitalized_life.life, tlist_capitalized_life.life_nominclature,
  SUM(t_primary_expenditure.amount) as total
FROM t_primary_budget
  JOIN t_user_owner ON t_user_owner.id = t_primary_budget.owner_fk
  JOIN tlist_gl_code ON tlist_gl_code.id = t_primary_budget.gl_code_fk
  JOIN tlist_cost_center ON tlist_cost_center.id = t_primary_budget.cost_center_fk
  JOIN tlist_frequency ON tlist_frequency.id = t_primary_budget.frequency_fk
  JOIN tlist_point_person ON tlist_point_person.id = t_primary_budget.point_person_fk
  JOIN tlist_expenditure_type ON tlist_expenditure_type.id = t_primary_budget.expenditure_type_fk
  JOIN tlist_capitalized_life ON tlist_capitalized_life.id = t_primary_budget.capitalize_life_fk
  JOIN t_primary_expenditure ON t_primary_budget.id = t_primary_expenditure.budget_fk 
      WHERE t_primary_budget.owner_fk = $1 AND archived = false AND t_primary_expenditure.year_fk = $2
      GROUP BY t_primary_budget.id, t_primary_expenditure.budget_fk, t_user_owner.business_unit, tlist_gl_code.id, tlist_cost_center.id, tlist_point_person.id, tlist_frequency.id, tlist_expenditure_type.id, tlist_capitalized_life.id
;`;
  console.log ('in budgetForm get')
  pool.query(queryText, [businessUnitId, selectedYear])
    .then((result) => { 
      res.send(result.rows); 
      // console.log (`budgetForm rows:`,result.rows);
    })
    .catch((err) => {
      console.log('Error completing formfill query', err);
      res.sendStatus(500);
    });
}); 

router.get('/expensefill', rejectUnauthenticated, (req, res) => {
  let recordId = req.query.recordId
  const queryText = `SELECT *
  FROM t_primary_expenditure
  JOIN tlist_period ON tlist_period.id = t_primary_expenditure.period_fk
  JOIN tlist_year ON tlist_year.id = t_primary_expenditure.period_fk
  WHERE t_primary_expenditure.budget_fk = $1;`;
  console.log ('in expenseFill get', recordId)
  pool.query(queryText, [recordId])
    .then((result) => { res.send(result.rows); 
      if (result.rows != null) {console.log (`found record`, result.rows);}
    })
    .catch((err) => {
      console.log('Error completing expensefill query', err);
      res.sendStatus(500);
    });
}); 



module.exports = router;