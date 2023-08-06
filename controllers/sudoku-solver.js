
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
    let lastValidValue = 0
    let updatedPuzzleString
    let lastValidDotRegionIndex
    let lastValidDotElementIndex
    let validCoordinatesArray = []
    let backtrack2;

    let cRow = this.checkRowPlacement 
    let cCol = this.checkColPlacement 
    let cReg = this.checkRegionPlacement
    let i=0

    function solveSudokuBacktracking (puzzleString, elementValue) {

      arrayOfRegions = checker.createArrayOfRegions(puzzleString)
      dotRegion = arrayOfRegions.find( region => {
        return region.find( val => {
          return val === "."
        })
      })

      while (dotRegion) {
        // console.log("| EV  = "+elementValue)
        // console.log("| LVV = "+lastValidValue)
        dotRegionIndex = arrayOfRegions.indexOf(dotRegion)
        dotElementIndex = dotRegion.indexOf(".")
        
        let row = coordinateMatrix[dotRegionIndex][dotElementIndex][0]
        let col = coordinateMatrix[dotRegionIndex][dotElementIndex][1]

        let rowCheck = cRow(puzzleString, row, col, elementValue.toString())
        let colCheck = cCol(puzzleString, row, col, elementValue.toString())
        let regCheck = cReg(puzzleString, row, col, elementValue.toString())

        // console.log(rowCheck)
        // console.log(colCheck)
        // console.log(regCheck)

        if (!rowCheck && !colCheck && !regCheck) {
          lastValidValue = elementValue
          lastValidDotRegionIndex = dotRegionIndex
          lastValidDotElementIndex = dotElementIndex
          // console.log("no conflict")
          arrayOfRegions[dotRegionIndex][dotElementIndex] = elementValue
          dotRegion = arrayOfRegions.find( region => {
            return region.find( val => {
              return val === "."
            })
          })
          validCoordinatesArray.push([dotRegionIndex, dotElementIndex, elementValue])
          // console.log(validCoordinatesArray)
          elementValue = 1
          puzzleString = checker.createPuzzleStringFromAOR(arrayOfRegions)
          
        } else {
          
          elementValue++

          if (elementValue===10){

            if (lastValidValue===9) {
              // console.log("backtrack 2")
              // console.log(validCoordinatesArray)

              backtrack2 = true // prevent code from backtracking 1, straight after, when lastValidValue changes
              let backTrackTwo = validCoordinatesArray[validCoordinatesArray.length-2]
              let backTrackTwoOne = validCoordinatesArray[validCoordinatesArray.length-1]
              arrayOfRegions[backTrackTwo[0]][backTrackTwo[1]] = "." // <---
              arrayOfRegions[backTrackTwoOne[0]][backTrackTwoOne[1]] = "."
              elementValue = backTrackTwo[2] +1
              validCoordinatesArray = validCoordinatesArray.slice(0,validCoordinatesArray.length-2)
              lastValidValue = validCoordinatesArray[validCoordinatesArray.length-1][2]

              // console.log(backTrackTwo)
              // console.log(validCoordinatesArray)
              // console.log("last v v = "+lastValidValue)

            } else if (lastValidValue!==9 && !backtrack2) {

              // console.log("backtrack 1")
              // console.log(validCoordinatesArray)

              let backTrackOne = validCoordinatesArray[validCoordinatesArray.length-1]
              arrayOfRegions[backTrackOne[0]][backTrackOne[1]] = "." // <---
              elementValue = backTrackOne[2] +1
              validCoordinatesArray = validCoordinatesArray.slice(0,validCoordinatesArray.length-1)
              lastValidValue = validCoordinatesArray[validCoordinatesArray.length-1][2]

              // console.log(backTrackOne)
              // console.log(validCoordinatesArray)
              // console.log("last v v = "+lastValidValue)
            }
            
            // -> lastValidDot region fucked up !!!!!
            // arrayOfRegions[lastValidDotRegionIndex][lastValidDotElementIndex] = "."
            // console.log(arrayOfRegions[dotRegionIndex])
            updatedPuzzleString = checker.createPuzzleStringFromAOR(arrayOfRegions)
            backtrack2 = false

            // console.log(arrayOfRegions[lastValidDotRegionIndex])

            return solveSudokuBacktracking(updatedPuzzleString, elementValue)
          }
        }
        
        // console.log(arrayOfRegions[dotRegionIndex])
        // console.log("________________")
        // i++
        i++
        // console.log("("+i+")")
        // console.log("  ")
      }
      
      // console.log("no empty regions found")
      // // console.log(arrayOfRegions)
      // console.log(checker.createPuzzleStringFromAOR(arrayOfRegions))
      
      return checker.createPuzzleStringFromAOR(arrayOfRegions)
    }

    return solveSudokuBacktracking(puzzleString, 1)
  }

}

module.exports = SudokuSolver;

