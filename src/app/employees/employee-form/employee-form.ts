import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import {
  ReactiveFormsModule,
  FormGroup,
  FormControl,
  Validators,
  AbstractControl,
  ValidationErrors,
} from '@angular/forms';
import { EmployeeService } from '../services/employee';
import { Employee } from '../models/employee';
import { PageHeader } from '../../shared/page-header/page-header';

function noFutureDate(control: AbstractControl): ValidationErrors | null {
  const value = control.value;

  if (!value) {
    return null;
  }
  const now = new Date();

  const today =
    `${now.getFullYear()}-` +
    `${String(now.getMonth() + 1).padStart(2, '0')}-` +
    `${String(now.getDate()).padStart(2, '0')}`;
  return value > today ? { futureDate: true } : null;
}

@Component({
  imports: [RouterLink, ReactiveFormsModule, PageHeader],
  selector: 'app-employee-form',
  styleUrl: './employee-form.css',
  templateUrl: './employee-form.html',
})
export class EmployeeForm implements OnInit {
  employeeId: number | null = null;

  constructor(
    private employeeService: EmployeeService,
    private router: Router,
    private route: ActivatedRoute,
  ) { }

  employeeForm = new FormGroup({
    name: new FormControl('', {
      validators: [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(50),
        Validators.pattern(/^[A-Za-z ]+$/),
      ],
    }),
    email: new FormControl('', {
      validators: [
        Validators.required,
        Validators.email,
        Validators.pattern(/^[A-Za-z0-9._%+-]+@codeboard\.com$/i),
      ],
    }),
    department: new FormControl('', {
      validators: [Validators.required],
    }),
    joiningDate: new FormControl('', {
      validators: [Validators.required, noFutureDate],
    }),
  });

  isSaving = false;

  departments = ['Engineering', 'Product', 'Design', 'Finance', 'HR'];

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');

    if (id !== null) {
      this.employeeId = Number(id);

      if (!Number.isInteger(this.employeeId) || this.employeeId <= 0) {
        this.router.navigate(['/employees']);
        return;
      }

      this.loadEmployee(this.employeeId);
    }
  }

  loadEmployee(id: number): void {
    this.employeeService.getEmployeeById(id).subscribe({
      next: (employee) => {
        this.employeeForm.patchValue({
          name: employee.name,
          email: employee.email,
          department: employee.department,
          joiningDate: employee.joiningDate,
        });
      },
      error: (error) => {
        console.log('Failed to load employee:', error);
        this.router.navigate(['/employees']);
      },
    });
  }

  onSubmit(): void {
    if (this.employeeForm.invalid || this.isSaving) {
      this.employeeForm.markAllAsTouched();
      return;
    }

    const formValue = this.employeeForm.getRawValue();

    const employeeData: Omit<Employee, 'id'> = {
      name: formValue.name ?? '',
      email: formValue.email ?? '',
      department: formValue.department ?? '',
      joiningDate: formValue.joiningDate ?? '',
    };

    this.isSaving = true;

    const request$ =
      this.employeeId !== null
        ? this.employeeService.updateEmployee(this.employeeId, employeeData)
        : this.employeeService.createEmployee(employeeData);

    request$.subscribe({
      next: (createdEmployee) => {
        console.log('Employee created:', createdEmployee);

        this.employeeForm.reset();
        this.isSaving = false;
        this.router.navigate(['/employees']);
      },
      error: (error) => {
        console.error('Failed to create emloyee:', error);

        this.isSaving = false;
      },
    });
    console.log('Valid employee data:', this.employeeForm.value);
  }

  hasUnsavedChanges(): boolean {
    return this.employeeForm.dirty && !this.isSaving;
  }
}
