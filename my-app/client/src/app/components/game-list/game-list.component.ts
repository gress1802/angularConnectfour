import { Component, ElementRef, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { User } from 'src/app/models/user';
import { Game } from 'src/app/models/game';
import { AuthService } from 'src/app/services/auth.service';
import { ListService } from 'src/app/services/list.service';
import { Metadata } from 'src/app/models/metadata';
import { Token } from 'src/app/models/token';
import { ViewChild } from '@angular/core';
import { filter, Observable, switchMap } from 'rxjs';

@Component({
  selector: 'app-game-list',
  templateUrl: './game-list.component.html',
  styleUrls: ['./game-list.component.css']
})
export class GameListComponent implements OnInit {
  public user? : User;
  private meta? : Metadata;
  public computerOption? : string;
  public playerOption? : string;
  public computers? : Token[];
  public players? : Token[];
  public playerDisabled : boolean = false;
  public computerDisabled : boolean = false;
  public selectedColor : string = "#1a1a1a";
  public gameList? : Observable<Game[]>;

  isAuthenticated() {
    return this.user != undefined;
  }

  constructor( private authService : AuthService, private router : Router, private listService : ListService ) {
  }
  
  logout(){
    this.authService.logout().subscribe( () => this.router.navigate(["/"]) );
  } 
  
  ngOnInit(): void {
    console.log("oninit");
    this.authService.userSubject.subscribe( (user:User|undefined) => {
      this.user = user;
    });
    this.listService.metaSubject.subscribe( (meta:Metadata|undefined) => {
      this.meta = meta;
      if (this.meta){
        let tokenArray = Object.values(this.meta.tokens);
        this.computers = tokenArray;
        this.players = tokenArray;
      }
    });
    this.gameList = this.getGames();
  }

  createGame() {
    if(this.playerOption && this.computerOption) {
      var curGame : Game;
      this.listService.createGame(this.playerOption, this.computerOption, this.selectedColor, this.players ? this.players : [])   
      .subscribe( (response : any) => {
        let game = response.game ? response.game : JSON.parse(response);
        if(game && game.id && this.playerOption && this.computerOption){
          this.router.navigate(["/games", encodeURIComponent(game.id), "players", encodeURIComponent(this.playerOption), "computers", encodeURIComponent(this.computerOption)]);
        }
      });
    }
  }

  //This function gets a list of the games Observable<Game[]>
  getGames() : Observable<Game[]> {
    return this.listService.getGames();
  }

  joinGame(event : Event){
    let target = event.target as HTMLElement;
    let gameID = target.getAttribute("data-game-id");
    if(gameID){
      this.listService.getGame(gameID).subscribe( (game : Game) => {
        if(game) {
          let playerOption = game.theme.playerToken.name;
          let computerOption = game.theme.computerToken.name;
          this.router.navigate(["/games", encodeURIComponent(game.id), "players", encodeURIComponent(playerOption as string), "computers", encodeURIComponent(computerOption as string)]);
        }
      });
    }
  }
}
