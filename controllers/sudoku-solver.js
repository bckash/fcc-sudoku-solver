
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
 
    let arrayOfRegions = checker.createArrayOfRegions(puzzleString)
    const yCoordinates = ["1","2","3","4","5","6","7","8","9"]
    const xCoordinates = ["a","b","c","d","e","f","g","h","i"]
    let coordinateMatrix = checker.createCoordinateRegionsMatrix(
      xCoordinates, yCoordinates, 9)

    let solveSudoku = arrayOfRegions;
    let dotRegion;
    let drIndex;
    let drPotentialValues;
    let drCoordinatesIndexes;
    let drCoordinates
    let coordinateRegion;
    
    // find first region that contains "." element
    dotRegion = solveSudoku.find( region => {
      return region.find( val => {
        return val === "."
      })
    })

    let i=0
    while (i < 300) {
      // find dotRegion potential values
      drPotentialValues = yCoordinates
        .filter( val => !dotRegion.includes(val))
       
      // find dot region potential coordinates
      drIndex = arrayOfRegions.indexOf(dotRegion)
      coordinateRegion = coordinateMatrix[drIndex]     
      drCoordinatesIndexes = dotRegion
        .map( (val, index) => val === "." ? index : "x")
        .filter( val => val !== "x" )  
      drCoordinates = drCoordinatesIndexes
        .map( idx => coordinateRegion[idx])
           
      // create an array with all the values that has no conflit on coordinate
      let checkArray = []
      drPotentialValues.map( val => {
          drCoordinates.map( coord => {
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
          
      // console.log(drPotentialValues)
      // console.log(drCoordinates)
      // console.log(checkArray)
          
      // check if there is a "foundValue" which has no conflict on only one coordinate
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
      
      // push the foundValue in sudokuSolver
      if (foundValue) {

        // get the foundValue coordinate
        let foundCoordinate
        checkArray.map( obj => {
          if (obj.value === foundValue) foundCoordinate = obj.coordinate  
        })
        
        // get the index from coordinatematrix
        let indexOfCoordinate =  coordinateMatrix[drIndex].indexOf(foundCoordinate)
        
        // push
        solveSudoku[drIndex][indexOfCoordinate] = foundValue
        console.log("pushed "+foundCoordinate+" / "+foundValue)

        // console.log("foundvalue = "+foundValue)
        // console.log("foundcoordinate = "+foundCoordinate)
        // console.log("indexOfDotRegion = "+indexOfDotRegion)
        // console.log("indexOfCoordinate = "+indexOfCoordinate)

        // console.log(solveSudoku[drIndex])

        // find new dotRegion
        dotRegion = solveSudoku.find( region => {
          return region.find( val => {
            return val === "."
          })
        }) 

      } else {
        dotRegion = solveSudoku[drIndex+1]
        if (drIndex === solveSudoku.length-1) dotRegion = solveSudoku[0]
        // console.log(dotRegion)
      }
      
      i+=1
      console.log(i) 
    }

    // console.log(solveSudoku)
  }
}

module.exports = SudokuSolver;

