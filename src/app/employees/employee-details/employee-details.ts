import { CommonModule } from '@angular/common';
import { Component, OnInit, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Loader } from '../../shared/loader/loader';
import { Employee } from '../models/employee';
import { EmployeeService } from '../services/employee';

@Component({
  imports: [CommonModule, RouterLink, Loader],
  selector: 'app-employee-details',
  styleUrl: './employee-details.css',
  templateUrl: './employee-details.html',
})
export class EmployeeDetails implements OnInit {

  employee = signal<Employee | null>(null);
  isLoading = signal(false);
  errorMessage = signal('');

  //Injecting the services
  constructor(
    private route: ActivatedRoute,
    private employeeService: EmployeeService) {}

  //loads employee details when the component is initialized
  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));

    if(!Number.isFinite(id) || id <= 0) {
      this.errorMessage.set('Invalid employee ID');
      return;
    }
    this.loadEmployee(id);
  }

  loadEmployee(id: number): void {
    this.isLoading.set(true);
    this.errorMessage.set('');

    this.employeeService.getEmployeeById(id).subscribe({
      next: (data) => {
        this.employee.set(data);
        this.isLoading.set(false)
      },
      error: (error) => {
        console.log('Failed to load employee:', error);
        this.errorMessage.set('Unable to load employee details');
        this.isLoading.set(false);
        
      }
    })
  }
}
