const express = require('express');
const router = express.Router();
const pool = require('../modules/pool')
 

router.get('/formfill', (req, res) => {
  let businessUnitId = req.query.businessUnitId
  let recordId = req.query.recordId
  let budgetId = req.query.budgetId
  console.log (`----req.query.record ID:`, recordId, 'businesUnit:', businessUnitId , 'budgetId:', budgetId);
  console.log (`----req.query.all:`, req.query);
  const queryText = `WITH _t_primary_budget AS 
  ( 
  SELECT t_primary_budget.id, nomenclature, manufacturer, capitalizable_candidate, credit_card_use, needs_review, notes,
  t_user_owner.business_unit, 
  tlist_gl_code.gl_account, tlist_gl_code.gl_name, tlist_gl_code.gl_type, tlist_gl_code.gl_examples,  
  tlist_cost_center.cost_center, tlist_cost_center.cost_center_description,
  tlist_point_person.point_person, tlist_point_person.pp_email_address,
  tlist_frequency.frequency, tlist_frequency.description, 
  tlist_expenditure_type.expenditure_type, tlist_expenditure_type.expenditure_description, 
  tlist_capitalized_life.life, tlist_capitalized_life.life_nominclature,
  row_number() over (PARTITION BY t_primary_budget.owner_fk ORDER BY t_primary_budget.id ASC) AS row_number
  FROM t_primary_budget
  JOIN t_user_owner ON t_user_owner.id = t_primary_budget.owner_fk
  JOIN tlist_gl_code ON tlist_gl_code.id = t_primary_budget.gl_code_fk
  JOIN tlist_cost_center ON tlist_cost_center.id = t_primary_budget.cost_center_fk
  JOIN tlist_frequency ON tlist_frequency.id = t_primary_budget.frequency_fk
  JOIN tlist_point_person ON tlist_point_person.id = t_primary_budget.point_person_fk
  JOIN tlist_expenditure_type ON tlist_expenditure_type.id = t_primary_budget.expenditure_type_fk
  JOIN tlist_capitalized_life ON tlist_capitalized_life.id = t_primary_budget.capitalize_life_fk
    WHERE t_primary_budget.owner_fk = $1 
  )
  SELECT * FROM _t_primary_budget WHERE row_number = $2;`;
  console.log ('in budgetForm get')
  pool.query(queryText, [businessUnitId, recordId])
    .then((result) => { 
      res.send(result.rows); 
      // console.log (`budgetForm rows:`,result.rows);
    })
    .catch((err) => {
      console.log('Error completing formfill query', err);
      res.sendStatus(500);
    });
}); 


router.get('/expensefill', (req, res) => {
  let budgetId = req.query.budgetId
  const queryText = `SELECT *
  FROM t_primary_expenditure
  JOIN tlist_period ON tlist_period.id = t_primary_expenditure.period_fk
  JOIN tlist_year ON tlist_year.id = t_primary_expenditure.period_fk
  WHERE t_primary_expenditure.budget_fk = $1;`;
  console.log ('in expenseFill get')
  pool.query(queryText, [budgetId])
    .then((result) => { res.send(result.rows); })
    .catch((err) => {
      console.log('Error completing expensefill query', err);
      res.sendStatus(500);
    });
}); 

router.put('/formfill', (req, res) => {
  let budgetId = req.body.editForm.id
  let payload = req.body.editForm
  // console.log (`formfill PUT BudgetId`, budgetId);
  // console.log (`formfill PUT Payload`, payload);
  const queryText = `UPDATE t_primary_budget SET 
    nomenclature = $2, 
    manufacturer = $3, 
    capitalizable_candidate = $4 
    WHERE id=$1;`;

  const queryValues = [
    payload.id,
    payload.nomenclature,
    payload.manufacturer,
    payload.capitalizable_candidate,
  ];

  pool.query(queryText, queryValues)
    .then(() => { res.sendStatus(200); })
    .catch((err) => {
      console.log('Error completing SELECT budget query', err);
      res.sendStatus(500);
    });
  });
  




//  ------------ old 
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