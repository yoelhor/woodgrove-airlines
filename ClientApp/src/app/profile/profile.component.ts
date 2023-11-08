import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})

export class ProfileComponent {
  public claims: Claim[] = [];
  public accessToken: string = "";
  public errorMessage: string = "";

  constructor(private http: HttpClient) {


    const formData = new FormData();

    this.accessToken = `${localStorage.getItem('accessToken')}`;

    if (this.accessToken == null || this.accessToken == "")
    {
      this.errorMessage = "You first need to sign-in";
      return;
    }

    formData.append('accessToken', this.accessToken);

    this.http.post<any>(environment.appUrl + "profile", formData /*, { headers: headers }**/).subscribe(result => {
      console.log("Result from RetrieveDisplayName:");
      console.log(Object.keys(result));

      for (var key of Object.keys(result)) {
        //console.log(key + " -> " + result[key])
        var c:Claim = new Claim();
        c.key = key;
        c.value = result[key]
        this.claims.push(c)
    }

    }, error => console.error(error));
  }
}

class Claim {
  public key: string = "";
  public value: string = "";
}
