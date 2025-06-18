import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ICalculator } from 'src/app/host/models/host.model';
import { HostService } from 'src/app/host/services/host/host.service';
import { NotificationService } from 'src/app/shared/services/notification/notification.service';

@Component({
  selector: 'app-delivery-fee',
  templateUrl: './delivery-fee.component.html',
  styleUrls: ['./delivery-fee.component.css']
})
export class DeliveryFeeComponent implements OnInit {

  averageTrips: number = 4.25;
  public results: ICalculator = null;
  private response: ICalculator = null;
  companyId: string;
  constructor(
    public dialogRef: MatDialogRef<DeliveryFeeComponent>,
    private hostService: HostService,
    private notifcationService: NotificationService,
    @Inject(MAT_DIALOG_DATA) public data: { companyId: string }
  ) {
    this.companyId = data.companyId;
  }
  onAverageTripsInput(event: any): void {
    let value = parseFloat(event.target.value);

    // Handle empty input case
    if (isNaN(value)) {
      this.averageTrips = null; // or 0, depending on your needs
      return;
    }

    // Clamp value between 1 and 10
    if (value < 1) {
      value = 1;
    } else if (value > 10) {
      value = 10;
    }

    // Limit to 2 decimal places
    value = Math.floor(value * 100) / 100;

    this.averageTrips = value;
  }

 onDecimalInput(event: KeyboardEvent, currentValue: string | null): void {
  const inputChar = event.key;
  
  // Allow control characters (backspace, delete, tab, etc.)
  if (event.ctrlKey || event.altKey || event.metaKey || 
      inputChar === 'Backspace' || inputChar === 'Delete' || inputChar === 'Tab' || 
      inputChar === 'ArrowLeft' || inputChar === 'ArrowRight' || 
      inputChar === 'ArrowUp' || inputChar === 'ArrowDown') {
    return;
  }

  // Convert null/undefined to empty string
  const safeCurrentValue = currentValue ? currentValue.toString() : '';

  // Allow digits and single decimal point
  if (!/^[\d.]$/.test(inputChar)) {
    event.preventDefault();
    return;
  }

  // If the input is a decimal point
  if (inputChar === '.') {
    // Prevent multiple decimal points
    if (safeCurrentValue.includes('.')) {
      event.preventDefault();
      return;
    }
    // Allow decimal point as first character (will become "0." automatically)
    return;
  }

  // If we're adding to existing value
  if (safeCurrentValue) {
    const parts = safeCurrentValue.split('.');
    // Prevent more than 2 decimal places
    if (parts[1] && parts[1].length >= 2) {
      event.preventDefault();
    }
  }
}

  calculate() {
    //const { AvgTripPerVehiclePerMonth , companyIdId } = this.form.value;
    let query = "";
    let companyId = this.companyId;
    let AvgTripPerVehiclePerMonth = this.averageTrips;

    if (AvgTripPerVehiclePerMonth !== 0) {
      query += `AvgTripPerVehiclePerMonth=${AvgTripPerVehiclePerMonth}`;
    }
    if (companyId !== "") {
      query += query ? `&CompanyId=${companyId}` : `CompanyId=${companyId}`;
    }


    this.hostService.getCalculatedValue<ICalculator>(`?${query}`).subscribe({
      next: (response) => {
        if (response === null) {
          this.notifcationService.notify
            (
              "notification",
              "warning",
              `No results for "${AvgTripPerVehiclePerMonth}"`
            )
        }
        else {
          this.results = {
            avgTripPerVehiclePerMonth: response.avgTripPerVehiclePerMonth,
            avgCostPerTrip: response.avgCostPerTrip,
            totalPaid: response.totalPaid,
            totalTrips: response.totalTrips,
            percentDailyParking: response.percentDailyParking,
            percentReservedParking: response.percentReservedParking,
            percentUnlimitedPass: response.percentUnlimitedPass,
            percentCoveredByFuelTank: response.percentCoveredByFuelTank,
            amountUsedFromFuelTank: response.amountUsedFromFuelTank,
            oldestPaymentDate: response.oldestPaymentDate,
            newestPaymentDate: response.newestPaymentDate
          }
        }
      }

    });

  }

  close() {
    this.dialogRef.close();
  }

  ngOnInit(): void {
    console.log("companyId:", this.companyId);
  }

}
