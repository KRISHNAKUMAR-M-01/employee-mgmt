import { Component, OnInit, signal, computed } from '@angular/core';
import { EmployeeService } from '../services/employee';
import { Employee } from '../models/employee';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Loader } from '../../shared/loader/loader';
import { ErrorMessage } from '../../shared/error-message/error-message';
import { ConfirmDialog } from '../../shared/confirm-dialog/confirm-dialog';
import { PageHeader } from '../../shared/page-header/page-header';

@Component({
  standalone: true,
  imports: [CommonModule, RouterLink, Loader,ErrorMessage, ConfirmDialog, PageHeader],
  selector: 'app-employee-list',
  styleUrl: './employee-list.css',
  templateUrl: './employee-list.html',
})
export class EmployeeList implements OnInit {
  //Inject EmployeeService to fetch employee data
  constructor(private employeeService: EmployeeService) {}

  // Signals to hold the employee data, loading state, and error message
  employees = signal<Employee[]>([]);
  isLoading = signal(false);
  errorMessage = signal('');

  // Signals to hold the search term and selected department for filtering employees
  searchTerm = signal('');
  selectedDepartment = signal('All');

  departments = ['All', 'Engineering', 'Product', 'Design', 'Finance', 'HR'];

  selectedEmployee = signal<Employee | null>(null);
  showDeleteDialog = signal(false);
  
  successMessage = signal('');

  // Fetch employee data when the component loads.
  ngOnInit(): void {
    this.loadEmployees();
  }

  //method to fetch the employee data from the service and update the signals
  loadEmployees(): void {
    this.isLoading.set(true);
    this.errorMessage.set('');

    //subscribe to observable to fetch the employee data
    this.employeeService.getEmployees().subscribe({
      //executed when the data is successfully fetched
      next: (data) => {
        this.employees.set(data);
        this.isLoading.set(false);
      },

      //executed when there is an error while fetching the data
      error: (err) => {
        console.error('Error fetching employees:', err);
        this.errorMessage.set('Unable to load employees. Please try again');
        this.isLoading.set(false);
      },
    });
  }

  filteredEmployees = computed(() => {
    const search = this.searchTerm().trim().toLowerCase();
    const department = this.selectedDepartment();

    return this.employees().filter((employee) => {
      const matchesSearch =
        employee.name.toLowerCase().includes(search) ||
        employee.email.toLowerCase().includes(search);

      const matchesDepartments = department === 'All' || employee.department === department;

      return matchesSearch && matchesDepartments;
    });
  });

  openDeleteDialog(employee: Employee): void {
    this.selectedEmployee.set(employee);
    this.showDeleteDialog.set(true);
  }

  cancelDelete(): void {
    this.showDeleteDialog.set(false);
    this.selectedEmployee.set(null);
  }

  deleteEmployee(employee: Employee): void {

    this.successMessage.set('');

    this.employeeService.deleteEmployee(employee.id).subscribe({
      next: () => {
        this.employees.update(employees => employees.filter(item => item.id !== employee.id));

        this.successMessage.set('Employee deleted successfully.');
        this.cancelDelete();

        setTimeout(() => {
          this.successMessage.set('');
        }, 3000);
      },
      error: (error) => {
        console.error('Failed to delete employee:', error);
        this.cancelDelete();
      }
    })
  }
}
