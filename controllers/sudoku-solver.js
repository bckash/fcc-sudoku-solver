
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

    // get variables for element validation
    let arrayOfRegions = checker.createArrayOfRegions(puzzleString)
    const yCoordinates = ["1","2","3","4","5","6","7","8","9"]
    const xCoordinates = ["a","b","c","d","e","f","g","h","i"]
    let arrayOfCoordinates = checker.createCoordinateRegionsMatrix(
      xCoordinates, yCoordinates, 9)

    let dotRegionIndex
    let dotElementIndex
    let dotRegion
    let row
    let col
    let cRow = this.checkRowPlacement 
    let cCol = this.checkColPlacement 
    let cReg = this.checkRegionPlacement
    

    function isValid (arr, reg, el, val) {

      puzzleString = checker.createPuzzleStringFromAOR(arr)
      row = arrayOfCoordinates[reg][el][0]
      col = arrayOfCoordinates[reg][el][1]
      let check = false;

      if (
        !cRow(puzzleString, row, col, val) &&
        !cCol(puzzleString, row, col, val) &&
        !cReg(puzzleString, row, col, val)
      ) {
        check = true
      }

      console.log(reg+" "+el+" "+val)
      console.log(row+col+" = "+val+" | "+check)
      console.log(cRow(puzzleString, row, col, val)+" "+cCol(puzzleString, row, col, val)+" "+cReg(puzzleString, row, col, val))
      console.log(arrayOfRegions)
      console.log("------------------")

      return check
    }

    function ss(data) {
      for (let reg = 0; reg < 9; reg++) {

        for (let el = 0; el < 9; el++) {

          if (data[reg][el] === '.') {

            for (let value = 1; value <= 9; value++) {

              if (isValid(data, reg, el, value)) {

                data[reg][el] = `${value}`;

                if (ss(data)) {
                  return true;
                  
                } else {
                  data[reg][el] = '.';
                }
              }
            }

          return false;
          }

        }

      }

      return true;
    }
    
    // ----control panel-----
    console.log(ss(arrayOfRegions))
    console.log(arrayOfRegions)
    // ----control panel-----
    console.log(checker.createPuzzleStringFromAOR(arrayOfRegions))
    return checker.createPuzzleStringFromAOR(arrayOfRegions)
  }
  
}

module.exports = SudokuSolver;

