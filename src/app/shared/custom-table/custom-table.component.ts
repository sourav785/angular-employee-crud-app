import { Component, Output, EventEmitter, input, Input } from '@angular/core';
import { ColumnDataType, ColumnDetails, Employee } from '../../employee/models/employee.models';
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

  @Input() tableConfig!: {
    showActionColumn: boolean,
    showEditButton: boolean,
    showDeleteButton: boolean,
  }

  @Input() actions!: {
    showActionColumn: boolean,
    showEditButton: boolean,
    editEmployee: { action: (employee: Employee) => void, text: string, styles: string };
    showDeleteButton: boolean,
    deleteEmployee: { action: (id: number) => void, text: string, styles: string };
  };

  columnDetails = input.required<ColumnDetails[]>();
  rowDetails = input.required<any[]>();

  @Output() editEmployee = new EventEmitter<Employee>();
  @Output() deleteEmployee = new EventEmitter<number>();
}
