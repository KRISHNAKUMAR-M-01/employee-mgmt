import { Routes } from '@angular/router';
import { unsavedChangesGuard } from './employees/guards/unsaved-changes-guard';
import { authGuard } from './employees/guards/auth-guard';

export const routes: Routes = [
    {
        path: 'employees', 
        loadComponent: () => 
            import('./employees/employee-list/employee-list')
        .then(m => m.EmployeeList)
    },
    {
        path: 'employees/new',
        loadComponent: () => 
            import('./employees/employee-form/employee-form')
        .then(m => m.EmployeeForm),
        canActivate: [authGuard],
        canDeactivate: [unsavedChangesGuard]
    },
    {
        path: 'employees/:id/edit',
        loadComponent: () => import('./employees/employee-form/employee-form')
        .then(m => m.EmployeeForm),
        canActivate: [authGuard],
        canDeactivate: [unsavedChangesGuard]
    },
    {
        path: 'employees/:id',
        loadComponent: () => import('./employees/employee-details/employee-details')
        .then(m => m.EmployeeDetails)
    },
    {
        path:'access-denied',
        loadComponent: () => import('./access-denied/access-denied')
        .then(m => m.AccessDenied)
    },
    {
        path: '',
        redirectTo: 'employees',
        pathMatch: 'full'
    },
    {
        path: '**',
        loadComponent: () => import('./not-found/not-found')
        .then(m => m.NotFound)
    }
];
