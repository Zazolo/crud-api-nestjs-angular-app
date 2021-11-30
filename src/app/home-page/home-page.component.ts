import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { debounceTime, distinctUntilChanged, fromEvent, map } from 'rxjs';
import { SalaService } from '../services/sala.service';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.scss']
})
export class HomePageComponent implements OnInit, AfterViewInit {

  @ViewChild(ElementRef) textarea!:ElementRef;
  inputNomeSala:string = '';
  inputTextArea:string ='';
  introductionTextVisibility:boolean = true;
  serverProps = {
    host:{
      ip:'',
      timestamp:new Date()
    }
  }
  constructor(
    private salaService:SalaService
  ) { }

  ngAfterViewInit(): void {
    if(this.textarea){
      fromEvent(this.textarea.nativeElement, 'input')
      .pipe(map((event:any) => (event.target as HTMLInputElement).value))
      .pipe(debounceTime(3000))
      .pipe(distinctUntilChanged())
      .subscribe(data => this.salvarTexto());
    }
  }

  ngOnInit(): void {
    if(this.temSalaAberta()){
      this.inputNomeSala = this.salaService.getSalaAtiva();
        this.introductionTextVisibility = false;
      this.pegarTextoSala();
      
    }
  }

  


  lastInputDigitado = '';

  async startSala(){
    try {
      await this.salaService.entrarSala(this.inputNomeSala);  
      await this.pegarTextoSala();
      await this.salvarTexto();
      this.introductionTextVisibility = false;
      
    } catch (error) {
      alert('Erro ao entrr na sala:\n\n' + JSON.stringify(error));
      
    }
  }

  temSalaAberta():boolean{
    return this.salaService.getSalaAtiva().length ? true : false;
  }

  async pegarTextoSala(){
    const dadosSala = await this.salaService.pegarDadosSala();
    this.inputTextArea = dadosSala?.texto || 'aaa';//'Você é o primeiro nessa sala! \n\nComece a alterar para salvar as mudanças!';
    this.pegarIP();
  }

  salvarTexto(){
    this.salaService.salvarTextoSala(this.inputTextArea).then(()=>{
      this.pegarTextoSala();
    })
  }

  pegarIP(){
    this.salaService.obterIP().then((ip) => {
      this.serverProps.host.ip = ip;
      this.serverProps.host.timestamp = new Date();
    })
  }

  sairSala(){
    this.inputNomeSala = '';
    this.inputTextArea = '';
    this.introductionTextVisibility = true;
  }

}
