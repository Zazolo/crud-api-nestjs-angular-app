import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SalaService {

  private salaAtiva:BehaviorSubject<string> = new BehaviorSubject<string>('');
  private server_path = 'http://localhost:2424/cola'
  constructor(
    private http:HttpClient
  ) { }

  getSalaAtiva():string{
    return this.salaAtiva.value
  }
  async entrarSala(nomeSala:string):Promise<boolean>{
    try {
      const response = await this.http.post(this.server_path, {id:nomeSala, texto:''}).subscribe();
      this.salaAtiva.next(nomeSala);
      return true;
    } catch (error) {
      return false;
    }
  }

  salvarTextoSala(texto:string):Promise<boolean>{
    return new Promise((resolve, reject) => {
      this.http.post(this.server_path, {id:this.salaAtiva.value, texto}).subscribe(()=>{
        resolve(true);
      })
    })
    
  }

  async pegarDadosSala():Promise<{id:string, texto:string} | undefined>{
    try {
      return new Promise((resolve, reject) => {
        this.http.get<{id:string, texto:string}>(this.server_path + '/' + this.salaAtiva.value).subscribe((response:{id:string, texto:string}) => {
          resolve(response);
        })
      })      
    } catch (error) {
      console.log(error);
      return undefined;
    }
  }

  obterIP():Promise<string>{
    return new Promise((resolve, reject) => {
      this.http.get<{ip:string}>(this.server_path + '/service/ip').subscribe((response:{ip:string}) => {
        resolve(response.ip);
      })
    })
  }

  sairSala(){
    this.salaAtiva.next('');
  }
}
