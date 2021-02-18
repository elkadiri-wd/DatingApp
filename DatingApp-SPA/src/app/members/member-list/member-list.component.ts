import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ActivatedRouteSnapshot } from '@angular/router';
import { error } from 'protractor';
import { PaginatedResult, Pagination } from 'src/app/_models/Pagination';
import { UserParams } from 'src/app/_models/UserParams';
import { User } from '../../_models/user';
import { AlertifyService } from '../../_services/alertify.service';
import { UserService } from '../../_services/user.service';

@Component({
  selector: 'app-member-list',
  templateUrl: './member-list.component.html',
  styleUrls: ['./member-list.component.scss']
})
export class MemberListComponent implements OnInit {
  users: User[];
  pagination: Pagination;
  userParams: UserParams;
  user: User;
  genderList = [{ value: 'male', display:'males' }, { value:'female', display: 'females' }];

  constructor(private userService: UserService,
    private alertify: AlertifyService, private route: ActivatedRoute) {
      this.userParams = this.userService.getUserParams();
     }

  ngOnInit() {
    this.route.data.subscribe(data => {
      this.users = data['users'].result;
      this.pagination = data['users'].pagination;
      this.user = data['user'];
    });
    this.userParams.gender = this.user?.gender === "female" ? "female" : "male";
    this.userParams.minAge = 18;
    this.userParams.maxAge = 99;
    this.userParams.orderBy = 'lastActive';
  }

  pageChanged(event: any): void {
    this.pagination.currentPage = event.page;
    this.loadUsers();
  }

  resetFilter(){
    this.userParams.gender = this.user?.gender === "female" ? "female" : "male";
    this.userParams.minAge = 18;
    this.userParams.maxAge = 99;
    this.loadUsers();
  }

  loadUsers(){
    this.userService.getUsers(this.pagination.currentPage, this.pagination.itemsPerPage, this.userParams)
    .subscribe((res: PaginatedResult<User[]>) => {
      this.users = res.result;
      this.pagination = res.pagination;
    }, error => {
      this.alertify.error(error);
    });
  }
}
