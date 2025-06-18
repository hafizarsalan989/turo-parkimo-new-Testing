import { Component, OnInit } from '@angular/core';
import { DeliveryFeeComponent } from '../delivery-fee/delivery-fee.component';
import { MatDialog } from '@angular/material/dialog';
import { SessionService } from 'src/app/shared/services/session/session.service';
import { HostService } from 'src/app/host/services/host/host.service';
import { IHost, ISimpleHost } from 'src/app/host/models/host.model';

@Component({
  selector: 'app-calculator',
  templateUrl: './calculator.component.html',
  styleUrls: ['./calculator.component.css']
})
export class CalculatorComponent implements OnInit {
  companyId: string = "";
  userId: string = "";

  constructor(private dialog: MatDialog,
    private sessionService: SessionService,
    private hostService: HostService
  ) { }
  
  ngOnInit(): void {
    this.sessionService.getUser$().subscribe(user => {
      if (user && user.id) {
        this.hostService.getHostByUserId<IHost[]>(user.id).subscribe(hosts => {
          if (hosts && hosts.length > 0) {
            this.companyId = hosts[0].id; // hosts[0].companyId 
            //console.log('Company ID:', this.companyId);
          } else {
            console.warn('No host data found for user');
          }
        });
      } else {
        console.warn('User not logged in or user ID missing');
      }
    });


  }


  openFeeCalculator() {
    this.dialog.open(DeliveryFeeComponent, {
      width: '600px',
      data: { companyId: this.companyId }
    });

  }
}
