import { CanDeactivateFn } from '@angular/router';
import { EmployeeForm } from '../employee-form/employee-form';

export const unsavedChangesGuard: CanDeactivateFn<EmployeeForm> = (component) => {
    if(!component.hasUnsavedChanges()){
      return true;
    }

    return confirm('You have unsaved changes. Are you sure you want to leave this page?');
};
