const express = require('express');
const router = express.Router();
const pool = require('../modules/pool')
const {rejectUnauthenticated,} = require('../modules/authentication-middleware');

router.get('/businessunit', rejectUnauthenticated, (req, res) => {
  const queryText = 'SELECT username, full_name, business_unit, bu_description FROM t_user_owner';
  console.log ('in t_user_owner get')
  pool.query(queryText)
    .then((result) => { res.send(result.rows); })
    .catch((err) => {
      console.log('Error completing t_user_owner query', err);
      res.sendStatus(500);
    });
}); 

router.get('/glcode', rejectUnauthenticated, (req, res) => {
  const queryText = 'SELECT * FROM tlist_gl_code WHERE show_in_list = true';
  console.log ('in tlist_gl_code get')
  pool.query(queryText)
    .then((result) => { res.send(result.rows); })
    .catch((err) => {
      console.log('Error completing gl code query', err);
      res.sendStatus(500);
    });
}); 

router.get('/frequency', rejectUnauthenticated, (req, res) => {
  const queryText = 'SELECT * FROM tlist_frequency';
  console.log ('in tlist_frequency get')
  pool.query(queryText)
    .then((result) => { res.send(result.rows); })
    .catch((err) => {
      console.log('Error completing tlist_frequency code query', err);
      res.sendStatus(500);
    });
}); 

router.get('/costcenter', rejectUnauthenticated, (req, res) => {
  let businessUnitId = req.query.businessUnitId
  const queryText = 'SELECT * FROM tlist_cost_center WHERE owner_fk = $1';
  console.log ('in tlist_cost_center get, BU ID:', businessUnitId)
  pool.query(queryText, [businessUnitId])
    .then((result) => { res.send(result.rows); })
    .catch((err) => {
      console.log('Error completing tlist_cost_center code query', err);
      res.sendStatus(500);
    });
}); 

router.get('/pointperson', rejectUnauthenticated, (req, res) => {
  let businessUnitId = req.query.businessUnitId
  const queryText = 'SELECT * FROM tlist_point_person WHERE owner_fk = $1';
  console.log ('in tlist_point_person get, BU ID:', businessUnitId)
  pool.query(queryText, [businessUnitId])
    .then((result) => { res.send(result.rows); })
    .catch((err) => {
      console.log('Error completing tlist_point_person code query', err);
      res.sendStatus(500);
    });
}); 

router.get('/capitalizedlife', rejectUnauthenticated, (req, res) => {
  const queryText = 'SELECT * FROM tlist_capitalized_life';
  console.log ('in tlist_capitalized_life get')
  pool.query(queryText)
    .then((result) => { res.send(result.rows); })
    .catch((err) => {
      console.log('Error completing tlist_capitalized_life code query', err);
      res.sendStatus(500);
    });
}); 

router.get('/expendituretype', rejectUnauthenticated, (req, res) => {
  let businessUnitId = req.query.businessUnitId
  const queryText = 'SELECT * FROM tlist_expenditure_type WHERE owner_fk = $1';
  console.log ('in tlist_expenditure_type get, BU ID:', businessUnitId)
  pool.query(queryText, [businessUnitId])
    .then((result) => { res.send(result.rows); })
    .catch((err) => {
      console.log('Error completing tlist_expenditure_type code query', err);
      res.sendStatus(500);
    });
}); 

router.get('/year', rejectUnauthenticated, (req, res) => {
  let businessUnitId = req.query.businessUnitId
  const queryText = 'SELECT * FROM tlist_year';
  console.log ('in tlist_year get')
  pool.query(queryText)
    .then((result) => { res.send(result.rows); })
    .catch((err) => {
      console.log('Error completing tlist_year code query', err);
      res.sendStatus(500);
    });
}); 

module.exports = router; 