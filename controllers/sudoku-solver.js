
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
 
    const yCoordinates = ["1","2","3","4","5","6","7","8","9"]
    const xCoordinates = ["a","b","c","d","e","f","g","h","i"]
    let coordinateMatrix = checker.createCoordinateRegionsMatrix(
      xCoordinates, yCoordinates, 9)
      
    let arrayOfRegions
    let dotRegion
    let dotRegionIndex
    let dotElementIndex
    let elementValue = 0
    let lastValidValue = 0
    let lastValidCoordinate
    let updatedPuzzleString
    let lastValidDotRegionIndex
    let lastValidDotElementIndex

    let cRow = this.checkRowPlacement 
    let cCol = this.checkColPlacement 
    let cReg = this.checkRegionPlacement

    function solveSudokuBacktracking (puzzleString) {

      arrayOfRegions = checker.createArrayOfRegions(puzzleString)
      dotRegion = arrayOfRegions.find( region => {
        return region.find( val => {
          return val === "."
        })
      })

      if (!dotRegion) {
        console.log("no regions with empty elements found")
        return
        
      } else {
 
        dotRegionIndex = arrayOfRegions.indexOf(dotRegion)
        dotElementIndex = dotRegion.indexOf(".")
        elementValue++
        
        let row = coordinateMatrix[dotRegionIndex][dotElementIndex][0]
        let col = coordinateMatrix[dotRegionIndex][dotElementIndex][1]
        let rowCheck = cRow(puzzleString, row, col, elementValue.toString())
        let colCheck = cCol(puzzleString, row, col, elementValue.toString())
        let regCheck = cReg(puzzleString, row, col, elementValue.toString())
        
        while (!rowCheck && !colCheck && !regCheck) {
       
          if (elementValue===10) {
            lastValidValue++
            if (lastValidValue===10) {
              console.log("sudoku cant be solved by this app")
              return;

            } else {
              arrayOfRegions[lastValidDotRegionIndex][lastValidDotElementIndex] = lastValidValue
              updatedPuzzleString = checker.createPuzzleStringFromAOR(arrayOfRegions)
              console.log("backtrack")
              solveSudokuBacktracking(updatedPuzzleString)  
            }
          }
          
          elementValue++
          rowCheck = cRow(puzzleString, row, col, elementValue.toString())
          colCheck = cCol(puzzleString, row, col, elementValue.toString())
          regCheck = cReg(puzzleString, row, col, elementValue.toString())
        }

        // -> VALUE WITH NO CONFLICT
        if (!rowCheck && !colCheck && !regCheck) {
          console.log("no conflict")
          lastValidValue = elementValue
          lastValidDotRegionIndex  = dotRegionIndex
          lastValidDotElementIndex = dotElementIndex
          // lastValidCoordinate = coordinateMatrix[dotRegionIndex][dotElementIndex]

          arrayOfRegions[dotRegionIndex][dotElementIndex] = lastValidValue
          updatedPuzzleString = checker.createPuzzleStringFromAOR(arrayOfRegions)
            
        } 

        solveSudokuBacktracking(updatedPuzzleString)
      }
    }





    solveSudokuBacktracking(puzzleString)
  }
}

module.exports = SudokuSolver;

