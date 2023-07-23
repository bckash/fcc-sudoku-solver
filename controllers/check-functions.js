
class CheckFunctions {

    createRowArray(str) {
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

    switchRowLettersToNumbers(row) {
      let nr;
      switch (row.toLowerCase()) {
        case "a":
          nr = 0
          break;
        case "b":
          nr = 1
          break;
        case "c":
          nr = 2
          break;
        case "d":
          nr = 3
          break;
        case "e":
          nr = 4
          break;
        case "f":
          nr = 5
          break;
        case "g":
          nr = 6
          break;
        case "h":
          nr = 7
          break;
        case "i":
          nr = 8
          break;
      }
      return nr
    }

    createColArray(str, firstChar) {
      const charGap = 9;
      const colArray = [];
    
      let i = firstChar;

      while (i < str.length) {
          colArray.push(str[i])
          i += charGap;
      }
  
      return colArray;
    }

    // --> gives starting point (index) for creating "square root" regions; and pushes them to marix array
    createArrayOfRegions(str) {
      let matrix = []
      let matrixElementsCount = str.length
      let matrixDimension = Math.sqrt(matrixElementsCount)
      let regionDimension = Math.sqrt(matrixDimension)

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

    // creates matrix of "coordinate regions" 
    createCoordinateRegionsMatrix(xc, yc, matrixDim){
      let matrix = []
      let region;
      let regionDim = Math.sqrt(matrixDim)

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
}

module.exports = CheckFunctions