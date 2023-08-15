const chai = require('chai');
const assert = chai.assert;

const Solver = require('../controllers/sudoku-solver.js');
let solver = new Solver;

suite('Unit Tests', () => {
    suite('test puzzle string', function(){
        test("valid puzzle string of 81 characters", (done) => {
            let inpt = '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..'
            assert.equal(solver.validate(inpt), "")
            done()
        })
        test("puzzle string with invalid characters (not 1-9 or .)", (done) => {
            let inpt = 'x.9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..'
            assert.equal(solver.validate(inpt), "Invalid characters in puzzle")
            done()
        })
        test("puzzle string that is not 81 characters in length", (done) => {
            let inpt = '.9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..'
            assert.equal(solver.validate(inpt), "Expected puzzle to be 81 characters long")
            done()
        })
    })
    suite('test row placement', function(){
        test("valid", (done) => {
            let puzzle = '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..'
            let row = "a"
            let col = "1"
            let value = "2"
            assert.equal(solver.checkRowPlacement(puzzle, row, col, value), "")
            done()
        })
        test("invalid", (done) => {
            let puzzle = '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..'
            let row = "a"
            let col = "1"
            let value = "1"
            assert.equal(solver.checkRowPlacement(puzzle, row, col, value), true)
            done()
        })
    })
    suite('test column placement', function(){
        test("valid", (done) => {
            let puzzle = '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..'
            let row = "a"
            let col = "1"
            let value = "2"
            assert.equal(solver.checkColPlacement(puzzle, row, col, value), "")
            done()
        })
        test("invalid", (done) => {
            let puzzle = '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..'
            let row = "a"
            let col = "1"
            let value = "1"
            assert.equal(solver.checkColPlacement(puzzle, row, col, value), true)
            done()
        })
    })
    suite('test 3x3 region placement', function(){
        test("valid", (done) => {
            let puzzle = '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..'
            let row = "a"
            let col = "1"
            let value = "7"
            assert.equal(solver.checkRegionPlacement(puzzle, row, col, value), "")
            done()
        })
        test("invalid", (done) => {
            let puzzle = '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..'
            let row = "a"
            let col = "1"
            let value = "8"
            assert.equal(solver.checkRegionPlacement(puzzle, row, col, value), true)
            done()
        })
    })
    suite('test solve()', function(){
        test("Valid puzzle strings pass the solver", (done) => {
            let inpt = '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.'
            assert.equal(solver.solve(inpt), "135762984946381257728459613694517832812936745357824196473298561581673429269145378")
            done()
        })
        test("Invalid puzzle strings fail the solver", (done) => {
            let inpt = '3.6.......1.........4..3516..14...7.9.6.9.1.4.9...72..1356..4.........35......8.7'
            assert.equal(solver.validate(inpt), "Puzzle cannot be solved")
            done()
        })
        test("Solver returns the expected solution for an incomplete puzzle", (done) => {
            let inpt = '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.'
            assert.equal(solver.solve(inpt), "135762984946381257728459613694517832812936745357824196473298561581673429269145378")
            done()
        })
    }) 
});
