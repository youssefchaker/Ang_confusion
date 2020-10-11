import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http'
@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http:HttpClient ) { }
  getUserSInfo(firstname,lastname){
    return this.http.post('/api/auth.php',{
      firstname,
      lastname
    }).subscribe(data =>{
      console.log(data,"bruh")
    })

  }
}
