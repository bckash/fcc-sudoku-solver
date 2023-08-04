
const CheckFunctions = require("../controllers/check-functions")
let checker = new CheckFunctions()

class SudokuSolver {

  validate(puzzleString) {
    let error;
    const numberRegex = /^[\d.]+$/
    
    if (puzzleString) {
      // puzzle greater or less than 81 characters
      if (puzzleString.length !== 81) {
        error = 'Expected puzzle to be 81 characters long'

      } else {
        // not number or period
        numberRegex.test(puzzleString)
        ? error = ""
        : error = 'Invalid characters in puzzle'
      }
      
      // invailid or cannot solve puzzle { error: 'Puzzle cannot be solved' }

    } else {
      // puzzle missing
      error = 'Required field missing'
    }

    return error
  }

  checkRowPlacement(puzzleString, row, column, value) {
    
    // create array with rows (as subststrings)
    let rowArray = checker.createRowArray(puzzleString)
    
    // switch row letters to numbers - to use them as index numbers for rowArray
    let rowArrayNr = checker.switchRowLettersToNumbers(row)

    // check if row contains coordinate value
    let rowArrayValue = rowArray[rowArrayNr][column-1]
    let check

    rowArrayValue === value 
      ? check = "same"
      : check = rowArray[rowArrayNr].includes(value)

    return check
  }

  checkColPlacement(puzzleString, row, column, value) {
    
    // create array of subarrayas - representing columns, which contain 
    let arrayOfColumns = []
    let i = 0;
    while (i < 9) {
      arrayOfColumns.push(checker.createColArray(puzzleString, i))
      i += 1
    }
    
    // check if column contains value
    let check = arrayOfColumns[column-1].some( char => {
      return char === value
    })

    return check
  }

  checkRegionPlacement(puzzleString, row, column, value) {

    let arrayOfRegions = checker.createArrayOfRegions(puzzleString)

    const xCoordinates = ["a","b","c","d","e","f","g","h","i"]
    const yCoordinates = ["1","2","3","4","5","6","7","8","9"]

    let coordinateMatrix = checker.createCoordinateRegionsMatrix(
      xCoordinates, yCoordinates, 9
    )
    
    // get the region index
    let coordinate = row.toLowerCase() + column

    let coordinatRegion = coordinateMatrix.find( region => {
      return region.includes(coordinate)
    })

    let regionIndex = coordinateMatrix.indexOf(coordinatRegion)

    // check if region contain coordinate
    let check = arrayOfRegions[regionIndex].includes(value)
    return check
  }

  solve(puzzleString) {
 
    let arrayOfRegions = checker.createArrayOfRegions(puzzleString)
    const yCoordinates = ["1","2","3","4","5","6","7","8","9"]
    const xCoordinates = ["a","b","c","d","e","f","g","h","i"]
    let coordinateMatrix = checker.createCoordinateRegionsMatrix(
      xCoordinates, yCoordinates, 9)

    let dotRegion
    let drIndex
    let dotElementIndex
    let lastValidValue = 0
    let lastValidCoordinate
    let solveSudoku

    function solveSudokuBacktracking (str, rc, cc, regc, v) {

      if (!puzzleString.contains(".")) {
        console.log("ee")
        return str
        
      } else {
        // get variables for first region that contains "." element
        solveSudoku = arrayOfRegions
        dotRegion = solveSudoku.find( region => {
          return region.find( val => {
            return val === "."
          })
        })
  
        drIndex = solveSudoku.indexOf(dotRegion)
        dotElementIndex = dotRegion.indexOf(".")
  
        let value = v
  
        if (value === 10) {
          value = lastValidValue + 1
        }
  
        let row = coordinateMatrix[drIndex][dotElementIndex][0]
        let col = coordinateMatrix[drIndex][dotElementIndex][1]
        let rowCheck = rc(str, row, col, value.toString())
        let colCheck = cc(str, row, col, value.toString())
        let regCheck = regc(str, row, col, value.toString())
        // console.log(row)
        // console.log(col)
        // console.log(rowCheck)
        // console.log(colCheck)
  
        if (!rowCheck && !colCheck && !regCheck) {
  
          // save last value for back tracking
          lastValidValue = value
          lastValidCoordinate = coordinateMatrix[drIndex][dotElementIndex]
          str[drIndex][dotElementIndex] = lastValidValue
          console.log(lastValidValue + " / " + lastValidCoordinate)
          solveSudokuBacktracking(
            str, rc, cc, regc, 1
          )
  
        } else {
  
          solveSudokuBacktracking(
            str, rc, cc, regc, value+1)
          console.log("huj")
        }
      }
    }

    console.log("ii")
    solveSudokuBacktracking(
      puzzleString, this.checkRowPlacement, this.checkColPlacement,this.checkRegionPlacement, 1
    )
  }
}

module.exports = SudokuSolver;

