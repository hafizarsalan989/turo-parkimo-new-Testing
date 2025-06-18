import { Injectable } from "@angular/core";

import swal from "sweetalert2";

@Injectable({
  providedIn: "root",
})
export class SwalService {
  fire(
    html: string,
    title?: string,
    icon?: 'success' | 'info' | 'warning' | 'error' | 'question',
    confirmButtonText?: string,
    cancelButtonText?: string,
    showCancelButton?: boolean,
    onSuccess?: Function,
    onCancel?: Function
  ): void {
    swal
      .fire({
        title,
        html,
        icon,
        confirmButtonText: confirmButtonText ?? 'Ok',
        cancelButtonText: cancelButtonText ?? 'Cancel',
        showCancelButton,
        buttonsStyling: false,
        customClass: {
          confirmButton: "btn btn-success",
          cancelButton: "btn btn-danger",
        },
      })
      .then((result) => {
        if (result.value) {
          if (onSuccess) {
          onSuccess();
        }
        } else {
          if (onCancel) {
            onCancel();
          }
        }
      });
  }
}
