import { DatePipe, NgFor } from '@angular/common';
import { Component } from '@angular/core';
import { TabViewModule } from 'primeng/tabview';

@Component({
    selector: 'app-date-filter',
    standalone: true,
    imports: [TabViewModule, DatePipe, NgFor],
    templateUrl: './date-filter.component.html',
    styleUrl: './date-filter.component.scss',
    providers: [DatePipe],
})
export class DateFilterComponent {
    public day = new Date();

    public date = new Date();

    public currentMonth = this.date.getMonth() + 1;

    public numberOfDays = new Date(this.date.getFullYear(), this.currentMonth, 0).getDate();

    public activeIndex: number = 0;

    public scrollableTabs = Array.from({ length: this.numberOfDays }, (_, i) => ({
        day: `${this.datePipe.transform(this.day, 'MMMM')}`,
        monthDay: ` ${i + 1}`,
        dayOfTheWeek: `${this.datePipe.transform(new Date(this.day.getFullYear(), this.day.getMonth(), i), 'EEEE')}`,
        content: `Content ${i + 1}`, //
    }));

    constructor(private datePipe: DatePipe) {}
}
