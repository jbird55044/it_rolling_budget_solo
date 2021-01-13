const express = require('express');
const router = express.Router();
const pool = require('../modules/pool')


router.get('/businessunit', (req, res) => {
  const queryText = 'SELECT * FROM t_user_owner';
  console.log ('in t_user_owner get')
  pool.query(queryText)
    .then((result) => { res.send(result.rows); })
    .catch((err) => {
      console.log('Error completing t_user_owner query', err);
      res.sendStatus(500);
    });
}); 

router.get('/glcode', (req, res) => {
  const queryText = 'SELECT * FROM tlist_gl_code';
  console.log ('in tlist_gl_code get')
  pool.query(queryText)
    .then((result) => { res.send(result.rows); })
    .catch((err) => {
      console.log('Error completing gl code query', err);ß
      res.sendStatus(500);
    });
}); 

router.get('/frequency', (req, res) => {
  const queryText = 'SELECT * FROM tlist_frequency';
  console.log ('in tlist_frequency get')
  pool.query(queryText)
    .then((result) => { res.send(result.rows); })
    .catch((err) => {
      console.log('Error completing tlist_frequency code query', err);
      res.sendStatus(500);
    });
}); 

router.get('/costcenter', (req, res) => {
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

router.get('/pointperson', (req, res) => {
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


module.exports = router; 