import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-general-info',
  templateUrl: './general-info.component.html',
  styleUrls: ['./general-info.component.scss']
})
export class GeneralInfoComponent implements OnInit {
  @Input() public ecmr: any;
  @Input() public selectedColumns: boolean[];
  public selectedImage: boolean[];

  public constructor() {
    this.selectedImage = [false, false, false, false];
  }

  public selectColumn(number) {
    if (this.ecmr.status === 'DELIVERED') {
      this.selectedImage.forEach((val, index) => {
        if (number === index) {
          this.selectedImage[index] = true;
          this.selectedColumns[index] = true;
        } else {
          this.selectedImage[index] = false;
          this.selectedColumns[index] = false;
        }
      });
    }
  }

  public defineSelectedColumn(): void {
    this.selectedColumns.forEach((val, index) => {
      if (this.selectedColumns[index]) {
        this.selectedImage[index] = true;
        this.selectedColumns[index] = true;
      }
    });
  }

  public ngOnInit() {
    this.defineSelectedColumn();
  }
}
