import {
  BaseModel,
} from '@ioc:Adonis/Lucid/Orm'

export default class ExcelFile extends BaseModel {

  public static readonly numberFormats = {
    'percentage': '0.00%',
    'money': '_($* #,##0.00_);_($* (#,##0.00);_($* "-"??_);_(@_)',
    'number': '0',
    'decimal': '0.00',
    'date': 'm/d/yy',
    'datetime': 'm/d/yy hh:mm:ss',
    'dateEuropean': 'yy/m/d',
    'datetimeEuropean': 'yy/m/d hh:mm:ss'
  };

}
