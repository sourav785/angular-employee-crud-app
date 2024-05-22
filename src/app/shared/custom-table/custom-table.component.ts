import { Component, Output, EventEmitter, input, Input, TemplateRef, ContentChild } from '@angular/core';
import { ColumnDataType, ColumnDetails, Employee, TableConfigurationDetails } from '../../employee/models/employee.models';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-custom-table',
  templateUrl: './custom-table.component.html',
  standalone: true,
  imports: [CommonModule],
  styleUrls: ['./custom-table.component.scss'],
})
export class CustomTableComponent {

  ColumnDataType = ColumnDataType;

  @ContentChild('editButtonTemplate') editButtonTemplate!: TemplateRef<any>;
  @ContentChild('deleteButtonTemplate') deleteButtonTemplate!: TemplateRef<any>;

  tableConfig = input.required<TableConfigurationDetails>();

  columnDetails = input.required<ColumnDetails[]>();
  rowDetails = input.required<any[]>();

  @Output() editEmployee = new EventEmitter<Employee>();
  @Output() deleteEmployee = new EventEmitter<number>();
}
