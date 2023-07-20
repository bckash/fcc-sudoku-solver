'use strict';

const SudokuSolver = require('../controllers/sudoku-solver.js');

module.exports = function (app) {
  
  let solver = new SudokuSolver();

  app.route('/api/check')
    .post((req, res) => {
      let puzzle = req.body.puzzle
      let coordinate = req.body.coordinate
      let rowCoor = coordinate[0]
      let colCoor = coordinate[1]
      let value = req.body.value

      let validRow;
      let validCol;
      let conflict = [];

      // check rows
      solver.checkRowPlacement(puzzle, rowCoor, colCoor, value)
        ? validRow = true
        : validRow = false

      if (!validRow) conflict.push("row")

      // check columnns
      solver.checkColPlacement(puzzle, rowCoor, colCoor, value)
        ? validCol = true
        : validCol = false

        if (!validCol) conflict.push("column")

      // check region
      solver.checkRegionPlacement(puzzle, coordinate, value)

      // generate response
      if (validRow && validCol) res.json( {valid: true} )
      else {
        res.json({
          valid: false,
          conflict: conflict
        })
      }

    });
    
  app.route('/api/solve')
    .post((req, res) => {
      let puzzle = req.body.puzzle
      let output = solver.validate(puzzle)

      output 
        ? res.json({error: output}) 
        : res.json({error: "no error"})
    });
};
