'use strict';

const SudokuSolver = require('../controllers/sudoku-solver.js');

module.exports = function (app) {
  
  let solver = new SudokuSolver();

  app.route('/api/check')
    .post((req, res) => {
      let puzzle = req.body.puzzle
      let coordinate = req.body.coordinate
      let value = req.body.value

      console.log("v = "+value)
      console.log("c = "+coordinate)

      const puzzleRegex = /^[\d.]+$/
      const coodinateRegex = /^[A-Ia-i][1-9]$/
      const valueRegex = /^[1-9]$/

      let conflict = [];

      if (!puzzleRegex.test(puzzle)) {
        res.json({ error: 'Invalid characters in puzzle' })

      } else if (puzzle.length !== 81) {
        res.json({ error: 'Expected puzzle to be 81 characters long' })

      } else if (!puzzle || !coordinate  || !value ) {
        res.json({ error: 'Required field(s) missing' })
      
      } else if (!coodinateRegex.test(coordinate)) {
        res.json({ error: 'Invalid coordinate'})

      } else if (!valueRegex.test(value)) {
        res.json({ error: 'Invalid value' })

      } else {
        let rowCoor = coordinate[0]
        let colCoor = coordinate[1]
        let sameValues;

        // check if value and puzzle value are the same
        if ((solver.checkRowPlacement(puzzle, rowCoor, colCoor, value)) === "same") {
          res.json({
            valid: true
          })

        } else {
          // check if row contains value
          if (solver.checkRowPlacement(puzzle, rowCoor, colCoor, value)) {
            conflict.push("row")
          }
    
          // check if columnn contains value
          if (solver.checkColPlacement(puzzle, rowCoor, colCoor, value)) {
            conflict.push("column")
          }
    
          // check if region contains value
          if (solver.checkRegionPlacement(puzzle, rowCoor, colCoor, value)){
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
        } 
      }

    });
    
  app.route('/api/solve')
    .post((req, res) => {
      let puzzle = req.body.puzzle
      console.log("puzzle = "+puzzle)
      let output = solver.validate(puzzle)

      output 
        ? res.json({error: output}) 
        : console.log(solver.solve(puzzle))
    });
};
