export interface Employee {
  id?: number;
  FirstName: string;
  LastName: string;
  Email: string;
  DOB: Date;
  Password: string;
}
export interface ColumnDetails{
  name: string;
  key: string;
  dataType: ColumnDataType;
  dateFormat?: string;
}

export enum ColumnDataType{
  Text = "text",
  Number = "number",
  Date = "date"
}