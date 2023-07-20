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

      let conflict = [];

      // check rows
      if (solver.checkRowPlacement(puzzle, rowCoor, colCoor, value)) {
        conflict.push("row")
      }

      // check columnns
      if (solver.checkColPlacement(puzzle, rowCoor, colCoor, value)) {
        conflict.push("column")
      }

      // check region
      if (solver.checkRegionPlacement(puzzle, coordinate, value)){
        conflict.push("region")
      }

      // generate response
      if (conflict.length === 0) {
        res.json({
          valid: true
        })

      } else {
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
