import { Component, View } from 'angular2/core';
import { CORE_DIRECTIVES, FORM_DIRECTIVES } from 'angular2/common';
import { Http, Headers } from 'angular2/http';
import { AuthHttp } from 'angular2-jwt';
import { Router, ROUTER_DIRECTIVES, ROUTER_PROVIDERS } from 'angular2/router';


let styles = require('./home.css');
let template = require('./home.html');

@Component({
  selector: 'home'
})

@View({
  directives: [CORE_DIRECTIVES, ROUTER_DIRECTIVES, FORM_DIRECTIVES],
  template: template,
  styles: [styles]
})

export class Home {
  jwt: string;
  decodedJwt: string;
  response: Array<any>;
  api: string;
  url: string;

  constructor(public router: Router, public http: Http, public authHttp: AuthHttp) {
    this.jwt = localStorage.getItem('jwt');
    this.decodedJwt = this.jwt && window.jwt_decode(this.jwt);
    this._callApi('Secured', 'http://localhost:8080/api/adTest/');
  }

  logout() {
    localStorage.removeItem('jwt');
    this.router.parent.navigateByUrl('/login');
  }

  createTest() {
    let url: string;
    url = 'http://localhost:8080/api/adTest/' + encodeURIComponent(this.url);
    this.authHttp.post(url, '')
      .subscribe(
        response => {
            let r = response.json().response;
            this.router.navigate(['AdTest', {id: r.id}]);
        },
        error => this.response = error.text()
      );
  }
  _callApi(type, url) {
    this.response = null;
    if (type === 'Anonymous') {
      // For non-protected routes, just use Http
      this.http.get(url)
        .subscribe(
          response => {
              console.log(response.json());
              this.response = response.json();
          },
          error => this.response = error.text()
        );
    }

    if (type === 'Secured') {
      // For protected routes, use AuthHttp
      this.authHttp.get(url)
        .subscribe(
          response => {
              let r = response.json().response;
              console.log(r);
              this.response = r;
          },
          error => this.response = error.text()
        );
    }
  }
}
