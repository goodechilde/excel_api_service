import {AuthContract} from "@ioc:Adonis/Addons/Auth";
import Config from "@ioc:Adonis/Core/Config";
import * as fs from "fs";

const storageConfig = Config.get('storage')
const { StorageManager } = require('@slynova/flydrive');
const storage = new StorageManager(storageConfig);
const storageLocalPath = storage.disk('local').$root + '/'

const numberFormats = Config.get('excelfile.numberCellFormats')
const excelFunctionTypes = Config.get('excelfile.excelFunctionTypes')

function buildWorksheetFromObject(workbook, dataFile) {
  createWorksheet(scaffoldWorksheet(workbook, dataFile.name), dataFile);
}

async function workbookParameters(auth: AuthContract, workbook) {
  const user = await auth.user
  // @ts-ignore
  const {name} = user;
  workbook.creator = name
  workbook.lastModifiedBy = name
  workbook.created = new Date()
  workbook.modified = new Date()
}

function createWorksheet(worksheetObject, dataFile) {
  let location: any;
  if(dataFile.headers){
    worksheetObject.columns = convertHeaderNumberFormat(dataFile.headers, numberFormats);
    location = worksheetObject.columns.reduce((acc, val) => {
      acc[val._key] = val._number;
      return acc;
    }, {})

  }


  dataFile.rows.map((row) => {
    if(hasOwnDeepProperty(row, 'formula')) {
      Object.keys(row).forEach((cell) =>{
        if(row[cell].formula){
          row[cell].formula = getFormula(location, row[cell], worksheetObject.rowCount)
        }
      })
    }
    worksheetObject.addRow(row).eachCell((cell) => {
      formatCells(cell, dataFile.meta.fontSize, false);
    })
  })

  if(dataFile.summaries) {
    dataFile.summaries.map((row) => {
      if(hasOwnDeepProperty(row, 'formula')) {
        Object.keys(row).forEach((cell) =>{
          if(row[cell].formula){
            row[cell].formula = getFormula(location, row[cell], worksheetObject.rowCount)
          }
        })
      }
      if(hasOwnDeepProperty(row, 'calculation')) {
        Object.keys(row).forEach((cell) =>{
          if(row[cell].calculation){
            row[cell]['formula'] = getColumnFormula(location, cell, row[cell], worksheetObject)
          }
        })
      }
      worksheetObject.addRow(row).eachCell((cell) => {
        formatCells(cell, dataFile.meta.fontSize, dataFile.meta.summariesBold, dataFile.meta.summariesBackgroundColor);
      })
    })
  }
  worksheetObject.getRow(1).eachCell((cell) => {
    formatCells(cell, dataFile.meta.fontSize, dataFile.meta.headerBold, dataFile.meta.headerBackgroundColor);
  })
}

function hasOwnDeepProperty(obj, prop) {
  if (typeof obj === 'object' && obj !== null) { // only performs property checks on objects (taking care of the corner case for null as well)
    if (obj.hasOwnProperty(prop)) {              // if this object already contains the property, we are done
      return true;
    }
    for (let p in obj) {                         // otherwise iterate on all the properties of this object.
      if (obj.hasOwnProperty(p) &&               // and as soon as you find the property you are looking for, return true
        hasOwnDeepProperty(obj[p], prop)) {
        return true;
      }
    }
  }
  return false;
}

/**
 * Takes a positive integer and returns the corresponding column name.
 * @param {number} num  The positive integer to convert to a column name.
 * @return {string}  The column name.
 */
function toExcelColumnName(num) {
  for (var ret = '', a = 1, b = 26; (num -= a) >= 0; a = b, b *= 26) {
    // @ts-ignore
    ret = String.fromCharCode(parseInt((num % b) / a) + 65) + ret;
  }
  return ret;
}

function convertHeaderNumberFormat(dataHeaders: any, numberFormats: { percentage: string; money: string; number: string; decimal: string; }) {
  return dataHeaders.map((header) => {
    if (header.style && header.style.hasOwnProperty('numFmt')) {
      header.style.numFmt = numberFormats[header.style.numFmt];
    }
    return header
  });
}

function scaffoldWorksheet(workbook, sheetName: string) {
  workbook.addWorksheet(sheetName);
  return workbook.getWorksheet(sheetName);
}

function getStorageLocalPath(){
  return storageLocalPath
}

function getMathOperator(type){
  return excelFunctionTypes[type]
}

function getMultiSheetObject(dataFileName){
  let rawData = fs.readFileSync(storageLocalPath + dataFileName)
  // @ts-ignore
  return JSON.parse(rawData);
}

function getFormula(location, cell, rowCount)  {
  return '=' +
    toExcelColumnName(location[cell.column1]) +
    eval(rowCount + 1) +
    getMathOperator(cell.type) +
    toExcelColumnName(location[cell.column2]) +
    eval(rowCount + 1);
}

function getColumnFormula(location, columnName, cell, workBookObject)  {
  return '=' + cell.calculation + '(' +
    toExcelColumnName(location[columnName]) +
    '2' +
    ':' +
    toExcelColumnName(location[columnName]) +
    eval(workBookObject.rowCount) + ')';
}

function formatCells(cell, fontSize = 14, fontBold = false, cellBackground = false) {
  if (cell.font) {
    Object.assign(cell.font, {"bold": fontBold, "size": fontSize})
  } else {
    Object.assign(cell, {"font": {"bold": fontBold, "size": fontSize}})
  }
  if(cellBackground){
    Object.assign(cell, {
      "fill": {
        type: 'pattern',
        pattern: 'solid',
        fgColor: {argb: eval("'" + cellBackground + "'")},
        bgColor:{argb: eval("'" + cellBackground + "'")}
      }
    })
  }
}

module.exports = {
  workbookParameters,
  getStorageLocalPath,
  getMultiSheetObject,
  buildWorksheetFromObject
}
