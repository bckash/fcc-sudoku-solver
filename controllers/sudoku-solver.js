
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
    // console.log("..............")
    // console.log("value = "+value)
    // console.log(arrayOfRegions[regionIndex])
    // console.log(check)
    return check
  }

  solve(puzzleString) {

    // create puzzleString region representation in form of subbarrays  
    let arrayOfRegions = checker.createArrayOfRegions(puzzleString)
    let solveSudoku = arrayOfRegions;

    // find dot region
    let dotRegion = arrayOfRegions.find(region => {
      return region.find(val => {
        return val === "."
      })
    })

    // find dot region potential values
    const yCoordinates = ["1","2","3","4","5","6","7","8","9"]
    let drPotentialValues = yCoordinates
      .filter( val => !dotRegion.includes(val))

    console.log(drPotentialValues)

    // find dot region potential coordinates
    const xCoordinates = ["a","b","c","d","e","f","g","h","i"]
    let coordinateMatrix = checker.createCoordinateRegionsMatrix(
      xCoordinates, yCoordinates, 9
    )
    let coordinateRegion = 
      coordinateMatrix[arrayOfRegions.indexOf(dotRegion)]

    let dotRegionCoordinatesIndexes = dotRegion
      .map( (val, index) => val === "." ? index : "x")
      .filter( val => val !== "x" )

    let dotRegionCoordinates = dotRegionCoordinatesIndexes
    .map( idx => coordinateRegion[idx])
    
    console.log(dotRegionCoordinates)
    
    // check if any value has only one coordinte with no conflicts 
    let checkArray = []
    drPotentialValues.map( val => {
      dotRegionCoordinates.map( coord => {
        let value = val
        let row = coord[0]
        let column = coord[1]
        let rowCheck = this.checkRowPlacement(puzzleString, row, column, value)
        let colCheck = this.checkColPlacement(puzzleString, row, column, value)

        // console.log("value = "+value)
        // console.log("row = "+row)
        // console.log("col = "+column)
        // console.log("rowcheck : "+rowCheck)
        // console.log("colcheck : "+colCheck)
        // console.log(".........")

        if (!rowCheck && !colCheck) {
          checkArray.push(
            {coordinate : coord, value: val}
          )
        } 
      })
    })

    console.log(checkArray)

    let foundValue;
    drPotentialValues.map( val => {
      let count = 0;
      checkArray.map( obj => {
        if (obj.value === val) count += 1
      })
      if (count === 1) {
        foundValue = val
      }
    })

    console.log("foundvalue = "+foundValue)

    // get the found value coordinate
    let foundCoordinate
    checkArray.map( obj => {
      if (obj.value === foundValue) foundCoordinate = obj.coordinate  
    })

    console.log("foundcoordinate = "+foundCoordinate)
    // console.log(arrayOfRegions)

    // get the index from coordinatematrix
    let indexOfDotRegion = arrayOfRegions.indexOf(dotRegion)
    let indexOfCoordinate =  coordinateMatrix[indexOfDotRegion].indexOf(foundCoordinate)

    console.log("indexOfDotRegion = "+indexOfDotRegion)
    console.log("indexOfCoordinate = "+indexOfCoordinate)

    solveSudoku[indexOfDotRegion][indexOfCoordinate] = foundValue
    console.log(solveSudoku[indexOfDotRegion])
  }
}

module.exports = SudokuSolver;

