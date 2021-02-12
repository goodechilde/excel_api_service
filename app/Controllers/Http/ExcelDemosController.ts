import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { v4 as uuid } from 'uuid'
const ExcelJS = require('exceljs');

export default class ExcelDemosController {
  /**
   * index
   */
  public async index({ response, auth }: HttpContextContract) {
    const workbook = new ExcelJS.Workbook();
    const user = await auth.user
    const sheet = workbook.addWorksheet('My Sheet');
    const worksheet = workbook.getWorksheet('My Sheet');
    const uuidFileName = 'storage/'+ uuid() +'dummyfile.xlsx'
    const jsonFile = require('/Users/seanshoffstall/Code/excelapiservice/exceldata.json')

    var numberFormats = {
      'percentage': '0.00%',
      'money': '_($* #,##0.00_);_($* (#,##0.00);_($* "-"??_);_(@_)',
      'number': '0',
      'decimal': '0.00'
    }

    workbook.views = [
      {
        x: 0, y: 0, width: 30000, height: 20000,
        firstSheet: 0, activeTab: 1, visibility: 'visible'
      }
    ]

    convertCellNumberFormat(jsonFile, numberFormats);

    worksheet.columns = jsonFile.headers

    jsonFile.rows.forEach((row) => {
      worksheet.addRow(row);

    });

    workbook.creator = user.name
    workbook.lastModifiedBy = user.name
    workbook.created = new Date()
    workbook.modified = new Date()
    await workbook.xlsx.writeFile(uuidFileName);

    // response.ok([worksheet.columns, jsonFile.rows])
    response.attachment(uuidFileName, 'testfile.xlsx')
   }
}

function convertCellNumberFormat(jsonFile: any, numberFormats: { percentage: string; money: string; number: string; decimal: string; }) {
  Object.values(jsonFile.headers).map((id) => {
    if (id.style && id.style.hasOwnProperty('numFmt')) {
      console.log(numberFormats[id.style.numFmt]);
      id.style.numFmt = numberFormats[id.style.numFmt];
    }
  });
}

