import { Component, OnInit } from '@angular/core';
import { User } from '../user';
import { UserService } from '../user.service';
import { FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit{
  users: User[] = [];
  filterEmail: string = '';
  filteredUsers: User[] = [];

  constructor(public userService: UserService) { }

  ngOnInit(): void {
    this.userService.getAll().subscribe((data: User[])=>{
      this.users = data;
      this.applyFilter(); // Aplica el filtro inicialmente
      console.log(this.users);
    })
  }

  // Método para aplicar el filtro
  applyFilter(): void {
    if (!this.filterEmail) {
      // If no filter, show all users
      this.filteredUsers = this.users;
    } else {
      // Filter users by email
      this.filteredUsers = this.users.filter(user => user.email.includes(this.filterEmail));
    }
  }
}
