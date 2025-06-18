import { Component, OnInit } from "@angular/core";
import { MatDialogRef } from "@angular/material/dialog";
import { SessionService } from "src/app/shared/services/session/session.service";
import { MatIconModule } from '@angular/material/icon';
@Component({
  selector: "app-reserved-space-list",
  templateUrl: "./reserved-space-list.component.html",
  styleUrls: ["./reserved-space-list.component.scss"],
})
export class ReservedSpaceListComponent implements OnInit {
  companyId: string;

  constructor(private sessionService: SessionService, private dialogRef: MatDialogRef<ReservedSpaceListComponent>) { }

  ngOnInit(): void {
    this.sessionService.getHost$().subscribe((host) => {
      this.companyId = host?.id;
    });
  }
  closeDialog(): void {
    this.dialogRef.close(); // Optionally pass data if needed
  }
}
