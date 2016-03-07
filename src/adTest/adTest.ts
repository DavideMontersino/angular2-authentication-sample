import { Component, View, OnInit } from 'angular2/core';
import { CORE_DIRECTIVES } from 'angular2/common';
import { Http, Headers } from 'angular2/http';
import { AuthHttp } from 'angular2-jwt';
import { Router, RouteParams } from 'angular2/router';

let styles = require('./adTest.css');
let template = require('./adTest.html');

@Component({
  selector: 'adTest'
})

@View({
  directives: [CORE_DIRECTIVES],
  template: template,
  styles: [styles]
})

export class AdTest implements OnInit {
  jwt: string;
  decodedJwt: string;
  har: any;
  results: any;
  api: string;

  constructor(
    public router: Router,
    public routeParams: RouteParams,
    public http: Http,
    public authHttp: AuthHttp
  ) {
    this.jwt = localStorage.getItem('jwt');
    this.decodedJwt = this.jwt && window.jwt_decode(this.jwt);
  }

  ngOnInit() {
    let id = this.routeParams.get('id');
    let harUrl = 'http://localhost:8080/api/adTest/' + id + '/har';
    let resultUrl = 'http://localhost:8080/api/adTest/' + id + '/results';
    this.authHttp.get(harUrl).subscribe(
      response => {
          let r = response.json().response;
          console.log(r);
          this.har = r;
      },
      error => this.har = error.text()
    );
    this.authHttp.get(resultUrl).subscribe(
      response => {
          let r = response.json().response;
          console.log(r);
          this.results = r;
      },
      error => this.results = error.text()
    );
  }

}
