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
      console.log('Error completing gl code query', err);
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

module.exports = router; 