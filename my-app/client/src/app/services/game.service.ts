import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Injectable, OnInit } from '@angular/core';
import { BehaviorSubject, Observable, of, tap } from 'rxjs';
import { Game } from '../models/game';
import { Metadata } from '../models/metadata';
import { Token } from '../models/token';
import { User } from '../models/user';

@Injectable({
  providedIn: 'root'
})

export class GameService implements OnInit{
  
  public metaSubject : BehaviorSubject<Metadata|undefined> = new BehaviorSubject<Metadata|undefined>( undefined );
  private URL : string = "http://localhost:3000/api/v2";
  private meta? : Metadata = undefined;
  private user? : User = undefined;

  ngOnInit(): void {
    this.getAuthenticatedUser().subscribe();
    this.getMeta().subscribe();
  }

  constructor(private http : HttpClient) { 
    this.ngOnInit();
  }

  //The following methods are used to get the metadata and to set the metadata
/*
 * This method makes an HTTP GET request to the /meta endpoint in order to retrieve the metadata
*/
  getMeta() : Observable<Metadata> {
    return this.http.get<Metadata>(this.URL + "/meta", { }).pipe( tap( meta => {
      this.setMeta( meta );
    }) );
  }

  setMeta( meta : Metadata | undefined  ) : void {
    this.meta = meta;
    this.metaSubject.next(meta);
  }

  /*
 * The following methods are used to check if the user is authenticated or not and to get the authenticated user
*/
  getAuthenticatedUser() : Observable<User> {
    let txt = window.localStorage.getItem('user');
    if( txt ) {
      let user : User = JSON.parse(txt as string) as User;
      this.setUser( user );
      return of(user);
    } else {
      return this.fetchUser();
    }
  }

  fetchUser() : Observable<User> {
    return this.http.get<User>(this.URL + "/who").pipe( tap( user => {
      this.setUser( user );
    }) );
  }

  setUser( user : User | undefined  ) : void {
    this.user = user;
  }

  //This is a function that is used to get the url of the token that matches the token parameter name
  getTokenUrl( tokenName : string ) : string | undefined{
    if(this.meta && this.meta.tokens){
      const tokenList : any = this.meta.tokens;
      //search in the token list for the token that matches the tokenName parameter
      for (let i = 0; i < tokenList.length; i++) {
        if(tokenList[i].name == tokenName){
          return tokenList[i].url;
        }
      }
      return undefined;
    }
    return undefined;
  }

  //This function is used to make a move on the board
  //It hits the endpoint POST /api/v2/gids/:gid with the gid as a parameter and the column number as a query parameter
  makeMove( gid : string, col : number ) : Observable<Token> {
    return this.http.post<Token>(this.URL + "/gids/" + gid + "?" + "move=" + col, { }, { } );
  }

  //This function is used to get the game state
  //It hits the endpoint GET /api/v2/gids/:gid with the gid as a parameter
  getGame( gid : string ) : Observable<Game> {
    return this.http.get<Game>(this.URL + "/gids/" + gid, { } );
  }
}
