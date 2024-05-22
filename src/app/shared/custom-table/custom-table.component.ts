import { Component, Output, EventEmitter, input, Input, TemplateRef, ContentChild } from '@angular/core';
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

  // @Input() editButtonTemplate!: TemplateRef<any>;
  // @Input() deleteButtonTemplate!: TemplateRef<any>;

  @ContentChild('editButtonTemplate') editButtonTemplate!: TemplateRef<any>;
  @ContentChild('deleteButtonTemplate') deleteButtonTemplate!: TemplateRef<any>;

  @Input() actions!: {
    showActionColumn: boolean,
    showEditButton: boolean,
    // editEmployee: { action: (employee: Employee) => void, text: string, styles: string };
    showDeleteButton: boolean,
    // deleteEmployee: { action: (id: number) => void, text: string, styles: string };
  };

  columnDetails = input.required<ColumnDetails[]>();
  rowDetails = input.required<any[]>();

  @Output() editEmployee = new EventEmitter<Employee>();
  @Output() deleteEmployee = new EventEmitter<number>();
}
