import {HttpContextContract} from '@ioc:Adonis/Core/HttpContext'
import {v4 as uuid} from 'uuid'

const excelFile = require('App/Services/ExcelFileCreateService')
const ExcelJS = require('exceljs');

export default class ExcelDemosController {

  public async index({ response, auth, request }: HttpContextContract) {
    const workbook = new ExcelJS.Workbook();
    workbook.views = [
      {
        x: 0, y: 0, width: 30000, height: 20000,
        firstSheet: 0, activeTab: 0, visibility: 'visible'
      }
    ]
    await excelFile.workbookParameters(auth, workbook);
    const uuidFileName = excelFile.getStorageLocalPath() + 'storage/'+ uuid() +'dummyfile.xlsx'
    let displayObject = excelFile.getMultiSheetObject('exceldataFull.json')

    displayObject.sheets.filter(sheet => {
      excelFile.buildWorksheetFromObject(workbook, sheet);
    })

    await workbook.xlsx.writeFile(uuidFileName);


    if(request.get().mode === 'xml') {
      return response.ok(
        'check console'
      )

    }
    new Promise((resolve) => {
      resolve(response.attachment(uuidFileName, 'testfile.xlsx'))
    }).then(() => {
      console.log(uuidFileName)
      // fs.unlinkSync(uuidFileName)
    })

   }


}


