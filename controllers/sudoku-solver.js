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
    
    function createRowArray(str) {
      const subarrayLength = 9;
      const rowArray = [];
    
      let i = 0;
      while (i < str.length) {
        const subarray = str.substring(i, i + subarrayLength);
        rowArray.push(subarray);
        i += subarrayLength;
      }
    
      return rowArray;
    }

    // create array with rows (as subststrings)
    let rowArray = createRowArray(puzzleString)
    let rowArrayNr;

    // switch row letters to numbers - to use them as index numbers for rowArray
    switch (row.toLowerCase()) {
      case "a":
        rowArrayNr = 0
        break;
      case "b":
        rowArrayNr = 1
        break;
      case "c":
        rowArrayNr = 2
        break;
      case "d":
        rowArrayNr = 3
        break;
      case "e":
        rowArrayNr = 4
        break;
      case "f":
        rowArrayNr = 5
        break;
      case "g":
        rowArrayNr = 6
        break;
      case "h":
        rowArrayNr = 7
        break;
      case "i":
        rowArrayNr = 8
        break;
    }

    // check if row contains coordinate value
    let check = rowArray[rowArrayNr].includes(value)

    return check
  }

  checkColPlacement(puzzleString, row, column, value) {
    
    let arrayOfColumns = []

    function createColArray(str, firstChar) {
      const charGap = 9;
      const colArray = [];
    
      let i = firstChar;

      while (i < str.length) {
          colArray.push(str[i])
          i += charGap;
      }
  
      return colArray;
    }

    // create array of subarrayas - representing columns, which contain 
    let i = 0;
    while (i < 9) {
      arrayOfColumns.push(createColArray(puzzleString, i))
      i += 1
    }
    
    // check if column contains value
    let check = arrayOfColumns[column-1].some( char => {
      return char === value
    })

    return check
  }

  checkRegionPlacement(puzzleString, row, column, value) {

    // --> gives starting point (index) for creating "square root" regions; and pushes them to marix array
    function createArrayOfRegions(str) {
      let matrix = []
      let matrixElementsCount = str.length
      let matrixDimension = Math.sqrt(matrixElementsCount)
      let regionDimension = Math.sqrt(matrixDimension)

      let y = 0 // "y" moves index to a new start verticly
      while (y < matrixElementsCount) {

        let x = 0 // "x" moves index to a new start verticly
        while(x < matrixDimension) {
         matrix.push(createRegion(str, x + y, matrixDimension))
         x += regionDimension
        }

      y += regionDimension*matrixDimension
      }

    return matrix
    }

    // pushes elements from matrix to a new "square root" region 
    function createRegion(str, firstIndex, matrixDim){
      let region = []
      let regionDimension = Math.sqrt(matrixDim)

      let y = 0 // "y" moves index to next row
      while (y < regionDimension*matrixDim) {

        let x = 0 // "x" moves index to next column
        while (x < regionDimension) {
          region.push(str[firstIndex + x + y])
          x += 1
        }
      
      y += matrixDim
      }
      
      return region
    }

    let arrayOfRegions = createArrayOfRegions(puzzleString)

    const xCoordinates = ["a","b","c","d","e","f","g","h","i"]
    const yCoordinates = ["1","2","3","4","5","6","7","8","9"]

    // creates matrix of "coordinate regions" 
    function createCoordinateRegionsMatrix(xc, yc, matrixDim){
      let matrix = []
      let region;
      let regionDim = Math.sqrt(matrixDim)

      let xx = 0
      while (xx < matrixDim) {

        let yy = 0
        while (yy < matrixDim)  {
          region = createCoordinateRegion(xc, xx, yc, yy, regionDim
            )
          matrix.push(region)
          yy += regionDim
        }

      xx += regionDim
      }
    
      return matrix
    }

    // creates 1 region of coordinates
    function createCoordinateRegion(xc, xx, yc, yy, regionDim) {
      let region = []

      let y = 0
      while (y < regionDim) {

        let x = 0
        while (x < regionDim) {
          region.push( xc[x + xx] + yc[y + yy] )
          x += 1
        }

      y += 1  
      }
      
    return region
    }

    let coordinateMatrix = createCoordinateRegionsMatrix(
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

  }
}

module.exports = SudokuSolver;

