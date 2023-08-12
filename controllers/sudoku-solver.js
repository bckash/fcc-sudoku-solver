
const CheckFunctions = require("../controllers/check-functions")
let checker = new CheckFunctions()

class SudokuSolver {

  validate(puzzleString) {
    let error = "";
    const numberRegex = /^[\d.]+$/
    
    if (puzzleString) {
      
      // puzzle greater or less than 81 characters
      if (puzzleString.length !== 81) {
        error = 'Expected puzzle to be 81 characters long'

      } else {

        // not number or period
        if (!numberRegex.test(puzzleString)) error = 'Invalid characters in puzzle'
        else {

          // invalid or cannot solve puzzle { error: 'Puzzle cannot be solved' }
          let arrayOfRegions = checker.createArrayOfRegions(puzzleString)
          let validationBeforeSolving =  arrayOfRegions.find( (region, regIndx) => {
            return region.find( (element, elIndx) => {
              const yCoordinates = ["1","2","3","4","5","6","7","8","9"]
              const xCoordinates = ["a","b","c","d","e","f","g","h","i"]
              let coordinateMatrix = checker.createCoordinateRegionsMatrix(
                xCoordinates, yCoordinates, 9)
              let row  = coordinateMatrix[regIndx][elIndx][0]
              let col  = coordinateMatrix[regIndx][elIndx][1]
              let cRow = this.checkRowPlacementBefore(puzzleString, row, col, element)
              let cCol = this.checkColPlacementBefore(puzzleString, row, col, element)
              let cReg = this.checkRegionPlacementBefore(puzzleString, row, col, element)
              
              if (element!==".") {
                // console.log(cRow+" / "+cCol+" / "+cReg)
                if (cRow === true || cCol === true || cReg === true) {
                  // console.log("unvalid element = "+element)
                  // console.log(coordinateMatrix[regIndx][elIndx])
                  return true
    
                } else {
                  return false
                }
              }
  
              return false            
            })
          })
  
          if (validationBeforeSolving) error = 'Puzzle cannot be solved'
        }
      }
      

    } else {
      // puzzle missing
      error = 'Required field missing'
    }

    return error
  }

  checkRowPlacement(puzzleString, row, column, value) {
    
    // create array with rows (as subststrings)
    let rowArray = checker.createRowArray(puzzleString)
    
    // switch row letters to numbers - to use them as index numbers for rowArray. (For example a=1)
    let rowArrayNr = checker.switchRowLettersToNumbers(row)

    // check if row contains coordinate value
    let rowArrayValue = rowArray[rowArrayNr][column-1]
    let check

    rowArrayValue === value 
      ? check = "same"
      : check = rowArray[rowArrayNr].includes(value)

    return check
  }

  checkRowPlacementBefore(puzzleString, row, column, value) {
    
    // create array with rows (as subststrings)
    let rowArray = checker.createRowArray(puzzleString)
    
    // switch row letters to numbers - to use them as index numbers for rowArray
    let rowArrayNr = checker.switchRowLettersToNumbers(row)

    let check = rowArray[rowArrayNr]
      .split("")
      .filter( element => {
        return element===value
      })

    return check.length > 1 ? true : false
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

  checkColPlacementBefore(puzzleString, row, column, value) {
    
    // create array of subarrayas - representing columns, which contain 
    let arrayOfColumns = []
    let i = 0;
    while (i < 9) {
      arrayOfColumns.push(checker.createColArray(puzzleString, i))
      i += 1
    }
    
    // check if column contains value
    let check = arrayOfColumns[column-1]
      .filter( element => {
        return element===value
      })

    // return check.length > 1 ? true : false
    return check.length > 1 ? true : false
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

  checkRegionPlacementBefore(puzzleString, row, column, value) {

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

    // check if column contains value
    let check = arrayOfRegions[regionIndex]
      .filter( element => {
        return element===value
      })
  
    // return check.length > 1 ? true : false
    return check.length > 1 ? true : false
  }

  solve(puzzleString) {
      
    let arrayOfRegions
    let dotRegion
    let cRow = this.checkRowPlacement 
    let cCol = this.checkColPlacement 
    let cReg = this.checkRegionPlacement

    function solvesudoku (puzzle){

      const yCoordinates = ["1","2","3","4","5","6","7","8","9"]
      const xCoordinates = ["a","b","c","d","e","f","g","h","i"]
      let coordinateMatrix = checker.createCoordinateRegionsMatrix(
      xCoordinates, yCoordinates, 9)
      arrayOfRegions = checker.createArrayOfRegions(puzzle)
      dotRegion = arrayOfRegions.find( region => {
        return region.find( val => {
          return val === "."
        })
      })
      let dotValueArr = []
      let dotValue = 1
      let dotRegionIndex
      let dotElementIndex
      let row
      let col
      let rowCheck
      let colCheck
      let regCheck

      let i=0
      while (dotRegion) {

        // ---control panel---
        // console.log("-----------------")
        // console.log("("+i+")")
        // console.log("-----------------")
        // ---control panel---

        dotRegionIndex  = arrayOfRegions.indexOf(dotRegion)
        dotElementIndex = dotRegion.indexOf(".")
        row = coordinateMatrix[dotRegionIndex][dotElementIndex][0]
        col = coordinateMatrix[dotRegionIndex][dotElementIndex][1]
        rowCheck = cRow(puzzleString, row, col, dotValue.toString())
        colCheck = cCol(puzzleString, row, col, dotValue.toString())
        regCheck = cReg(puzzleString, row, col, dotValue.toString())  
        
        function validation (row, col, reg) {
          let check;
          row===false && col===false && reg===false
            ? check = true
            : check = false
          return check
        }
        
        // ---control panel---
        // console.log(rowCheck+" / "+colCheck+" / "+regCheck)
        // console.log(validation(rowCheck, colCheck, regCheck))
        // ---control panel---



        while(!validation(rowCheck, colCheck, regCheck)) { // 

          // ---control panel---
          // console.log("dotValue (BBT) = "+dotValue)
          // ---control panel---

          while (dotValue===9) { //<---- BUG , if more 9.......
            // BACKTRACK ----------------->
            arrayOfRegions[dotRegionIndex][dotElementIndex] = "."
            puzzleString = checker.createPuzzleStringFromAOR(arrayOfRegions)
            let dvaLast = dotValueArr.length-1 
            dotRegionIndex  = dotValueArr[dvaLast][0]
            dotElementIndex = dotValueArr[dvaLast][1]
            dotValue        = dotValueArr[dvaLast][2]
            dotValueArr.length === 1
                ? dotValueArr
                : dotValueArr = dotValueArr.slice(0,dvaLast)

            // ---control panel---
            // console.log("")
            // console.log("-------backtrack------")
            // console.log(coordinateMatrix[dotRegionIndex][dotElementIndex]+" / dotValue="+dotValue)
            // console.log(arrayOfRegions[dotRegionIndex])
            // console.log("-------backtrack------")
            // console.log("")
            // ---control panel---

            // <------------- BACKTRACK
          }
           
          dotValue++

          row = coordinateMatrix[dotRegionIndex][dotElementIndex][0]
          col = coordinateMatrix[dotRegionIndex][dotElementIndex][1]
          rowCheck = cRow(puzzleString, row, col, dotValue.toString())
          colCheck = cCol(puzzleString, row, col, dotValue.toString())
          regCheck = cReg(puzzleString, row, col, dotValue.toString())

          // ---control panel---
          // console.log(" - - - ")
          // console.log("dotValue = "+dotValue)
          // console.log("row="+row)
          // console.log("col="+col)
          // console.log(rowCheck+" / "+colCheck+" / "+regCheck)
          // console.log(validation(rowCheck, colCheck, regCheck))
          // console.log(" - - - ")
          // ---control panel---
        }
 

        arrayOfRegions[dotRegionIndex][dotElementIndex] = dotValue
                // ---control panel---
                // console.log("=> added : "+dotValue+" , into "+ coordinateMatrix[dotRegionIndex][dotElementIndex])
                // console.log(arrayOfRegions[dotRegionIndex])
                // ---control panel---
        dotValueArr.push([dotRegionIndex, dotElementIndex, dotValue])
        puzzleString = checker.createPuzzleStringFromAOR(arrayOfRegions)
        dotRegion = arrayOfRegions.find( region => {
          return region.find( val => {
            return val === "."
          })
        })
        dotValue=1

        i++ 
        // console.log(i)
        if (i===100000) {
          console.log("too many iterations - looks like puzzle cant be solved")
        } 
      }

      return checker.createPuzzleStringFromAOR(arrayOfRegions)

    }

    // return solveSudokuBacktracking(puzzleString, 1)
    return solvesudoku(puzzleString)
  }

}

module.exports = SudokuSolver;

