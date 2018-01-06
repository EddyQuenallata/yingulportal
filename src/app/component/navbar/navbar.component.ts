import { Component, OnInit,Output,EventEmitter } from '@angular/core';
import { LoginService } from '../../service/login.service';
import { QueryServiceService } from '../../service/query-service.service';
import { Router } from '@angular/router';
import { user } from '../../model/user';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
	@Output() Menu = new EventEmitter();
	loggedIn: boolean=false;
	User: user=new user();
	queries:number=0;

	constructor(private loginService: LoginService, private router : Router,private queryService : QueryServiceService) {
    if(localStorage.getItem('user') == '' || localStorage.getItem('user') == null) {
			this.loggedIn = false;
			this.User = new user();
		
		} else {
			this.loggedIn = true;
			this.User=JSON.parse(localStorage.getItem("user"));
			this.getQueries();
		}
	}

	logout(){
		localStorage.setItem('user', '');
		localStorage.removeItem('user');
		this.loginService.logout().subscribe(
			res => {
				localStorage.setItem('user', '');
				localStorage.removeItem('user');
			},
			err => console.log(err)
			);
		location.reload();
		//this.router.navigate(['/login']);
	}

	getDisplay() {
    if(!this.loggedIn){
      return "none";
    } else {
      return "";
    }
  }

  ngOnInit() {
		
  }

	menu(){
    this.Menu.emit('menu');
	}
	getQueries(){
		this.queryService.getQueriesByUser(this.User.username).subscribe(
			res => {
            this.queries = JSON.parse(JSON.parse(JSON.stringify(res))._body);
      		},
      		error => console.log(error)
    );
	}

}

