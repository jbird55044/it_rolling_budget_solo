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


//  ------------ old code for examples -------------------
// File Post
router.post('/uploadposter', (req, res) => {
  console.log (`in poster: req-files:`, req.files);
  console.log (`in poster: req-filesfld:`, req.filesfld);
  console.log (`in poster: body:`, req.body);
  let images = new Array();
  if(req.file === !null) {
      let arr;
      if(Array.isArray(req.files.filesfld)) {
        console.log (`Yes an array`);
          arr = req.files.filesfld;
      }
      else {
          console.log (`Not an array, but making one`);
          arr = new Array(1);
          arr[0] = req.files.filesfld;
      }
      for(var i = 0; i < arr.length; i++) {
          var file = arr[i];
          if(file.mimetype.substring(0,5).toLowerCase() == "image") {
              console.log (`creating file . . . `);
              images[i] = "/" + file.name;
              file.mv(`${__dirname}/public/images` + images[i], function (err) {
                  if(err) {
                      console.log('path does not exist', err);
                  }
                  res.json({ fileName: images[i]});
              }); 
          }
      }
  } else { console.log (`Not Seeing req.files (false)`); }
  // give the server a second to write the files
  setTimeout(function(){res.json(images);}, 1000);
  console.log (`End of file POST:`);
});

//Movie and Genre Post
router.post('/', (req, res) => {
  // console.log('incoming req.body:',req.body);
  // RETURNING "id" will give us back the id of the created movie
  const insertMovieQuery = `
  INSERT INTO "movies" ("title", "poster", "description")
  VALUES ($1, $2, $3)
  RETURNING "id";`

  // FIRST QUERY MAKES MOVIE
  pool.query(insertMovieQuery, [req.body.title, 'images/toy-story.jpg', req.body.description])
  // pool.query(insertMovieQuery, [req.body.title, req.body.poster, req.body.description])
  .then(result => {
    console.log('New Movie Id:', result.rows[0].id); //ID IS HERE!
    
    const createdMovieId = result.rows[0].id

    // Loop Genre Array     
    for (eachGenre of req.body.genre_objects) {
        const insertMovieGenreQuery = `
        INSERT INTO "movies_genres" ("movie_id", "genre_id")
        VALUES  ($1, $2);
        `
        // SECOND QUERY MAKES GENRE FOR THAT NEW MOVIE
        pool.query(insertMovieGenreQuery, [createdMovieId, eachGenre.id]).then(result => {
            // res.sendStatus(201);
        }).catch(err => {
          // catch for second query
          console.log(err);
          res.sendStatus(500)
        }) 
    } // end of loop genre
// Catch for first query
  }).catch(err => {
    console.log(err);
    res.sendStatus(500)
  })
})

module.exports = router;