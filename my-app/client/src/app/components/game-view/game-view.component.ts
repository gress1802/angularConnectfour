import { Component, ElementRef, OnInit, ViewChild, Renderer2 } from '@angular/core';
import { Router } from '@angular/router';
import { User } from 'src/app/models/user';
import { AuthService } from 'src/app/services/auth.service';
import { ActivatedRoute } from '@angular/router';
import { Metadata } from 'src/app/models/metadata';
import { GameService } from 'src/app/services/game.service';
import { combineLatest } from 'rxjs';
import { Game } from 'src/app/models/game';


@Component({
  selector: 'app-game-view',
  templateUrl: './game-view.component.html',
  styleUrls: ['./game-view.component.css']
})
export class GameViewComponent implements OnInit {

  @ViewChild('winIMG', {static: false}) winIMG! : ElementRef;
  @ViewChild('loseIMG', {static: false}) loseIMG! : ElementRef;
  @ViewChild('playerVS', {static: false}) playerVS! : ElementRef;
  @ViewChild('computerVS', {static: false}) computerVS! : ElementRef;
  //These are the divs that will be used to display the game board
  //Buttons
  @ViewChild('divTop0', {static: false}) divTop0! : ElementRef;
  @ViewChild('divTop1', {static: false}) divTop1! : ElementRef;
  @ViewChild('divTop2', {static: false}) divTop2! : ElementRef;
  @ViewChild('divTop3', {static: false}) divTop3! : ElementRef;
  @ViewChild('divTop4', {static: false}) divTop4! : ElementRef;
  @ViewChild('divTop5', {static: false}) divTop5! : ElementRef;
  @ViewChild('divTop6', {static: false}) divTop6! : ElementRef;
  //End of buttons
  //Board
  @ViewChild('div00', {static: false}) div00! : ElementRef;
  @ViewChild('div01', {static: false}) div01! : ElementRef;
  @ViewChild('div02', {static: false}) div02! : ElementRef;
  @ViewChild('div03', {static: false}) div03! : ElementRef;
  @ViewChild('div04', {static: false}) div04! : ElementRef;
  @ViewChild('div05', {static: false}) div05! : ElementRef;
  @ViewChild('div06', {static: false}) div06! : ElementRef;
  @ViewChild('div10', {static: false}) div10! : ElementRef;
  @ViewChild('div11', {static: false}) div11! : ElementRef;
  @ViewChild('div12', {static: false}) div12! : ElementRef;
  @ViewChild('div13', {static: false}) div13! : ElementRef;
  @ViewChild('div14', {static: false}) div14! : ElementRef;
  @ViewChild('div15', {static: false}) div15! : ElementRef;
  @ViewChild('div16', {static: false}) div16! : ElementRef;
  @ViewChild('div20', {static: false}) div20! : ElementRef;
  @ViewChild('div21', {static: false}) div21! : ElementRef;
  @ViewChild('div22', {static: false}) div22! : ElementRef;
  @ViewChild('div23', {static: false}) div23! : ElementRef;
  @ViewChild('div24', {static: false}) div24! : ElementRef;
  @ViewChild('div25', {static: false}) div25! : ElementRef;
  @ViewChild('div26', {static: false}) div26! : ElementRef;
  @ViewChild('div30', {static: false}) div30! : ElementRef;
  @ViewChild('div31', {static: false}) div31! : ElementRef;
  @ViewChild('div32', {static: false}) div32! : ElementRef;
  @ViewChild('div33', {static: false}) div33! : ElementRef;
  @ViewChild('div34', {static: false}) div34! : ElementRef;
  @ViewChild('div35', {static: false}) div35! : ElementRef;
  @ViewChild('div36', {static: false}) div36! : ElementRef;
  @ViewChild('div40', {static: false}) div40! : ElementRef;
  @ViewChild('div41', {static: false}) div41! : ElementRef;
  @ViewChild('div42', {static: false}) div42! : ElementRef;
  @ViewChild('div43', {static: false}) div43! : ElementRef;
  @ViewChild('div44', {static: false}) div44! : ElementRef;
  @ViewChild('div45', {static: false}) div45! : ElementRef;
  @ViewChild('div46', {static: false}) div46! : ElementRef;
  //End of game board display divs

  public user? : User;
  public meta? : Metadata;
  public playerTokenSRC? : string;
  public computerTokenSRC? : string;
  public gid? : string;
  public buttons : Array<ElementRef> = [];
  public divs? : Array<ElementRef>;
  public gameStatus : String = "UNFINISHED";
  public paragraphText : String = "UNFINISHED";
  public boardBackground : String = "#E66465";

  constructor( private authService : AuthService, private router : Router, private route : ActivatedRoute, private gameView : GameService, private renderer : Renderer2 ) {
  }


  /*
   * This method makes use of combineLatest, which ensures that both the route parameters and metadata are available before setting the token URLs
  */
  ngOnInit() : void {
    this.authService.userSubject.subscribe( (user:User|undefined) => {
      this.user = user;
    });
  combineLatest([this.route.params, this.gameView.metaSubject]).subscribe(([params, meta]) => {
    if (meta) {
      this.meta = meta;
      let playerName = params['playerOption'];
      let computerName = params['computerOption'];
      this.gid = params['gameId'];
      this.playerTokenSRC = this.gameView.getTokenUrl(playerName);
      this.computerTokenSRC = this.gameView.getTokenUrl(computerName);
      if(this.gid) {
        this.gameView.getGame(this.gid).subscribe( (game:Game) => {
          this.removePreviousGame();
          this.renderGame(game);
        });
      }
    }});
  }

  ngAfterViewInit() : void {
    //initialize the divs array for traversing through in rendering the board
    this.divs = [
      this.div00, this.div01, this.div02, this.div03, this.div04, this.div05, this.div06, 
      this.div10, this.div11, this.div12, this.div13, this.div14, this.div15, this.div16, 
      this.div20, this.div21, this.div22, this.div23, this.div24, this.div25, this.div26, 
      this.div30, this.div31, this.div32, this.div33, this.div34, this.div35, this.div36, 
      this.div40, this.div41, this.div42, this.div43, this.div44, this.div45, this.div46
    ];
    this.buttons = [
      this.divTop0, this.divTop1, this.divTop2, this.divTop3, this.divTop4, this.divTop5, this.divTop6
    ]
  }

  logout(){
    this.authService.logout().subscribe( () => this.router.navigate(["/"]) );
  }

  /*
   * This function is envoked when the player click to make a move
  */
  playerMove(event : any) : void {
    if(this.gameStatus != "UNFINISHED") {
      return;
    }
    let parent = event.target.parentElement;
    let column = parent.id;
    if( this.user && this.gid && column) {
      this.gameView.makeMove( this.gid, column ).subscribe( (game : any) => {
        this.renderGame(game);
      });
    }
  }

  /*
   * This function is envoked after a move is made and the corresponding game object is returned
   * This function renders the game board and the game status for the new game object
  */
  renderGame(game : Game) : void {
    this.removePreviousGame();
    this.gameStatus = game.status;
    this.paragraphText = game.status;
    this.boardBackground = game.theme.color;
    let grid = game.grid;
    for (let i = 0; i < grid.length; i++) {
      for (let j = 0; j < grid[i].length; j++) {
        if(grid[i][j] == "x" && this.playerTokenSRC) {
          //create a new image inside of the div whose class is "token" and set the src to this.playerTokenSRC
          let img = this.renderer.createElement('img');
          this.renderer.setAttribute(img, 'src', this.playerTokenSRC);
          this.renderer.addClass(img, 'token');
          this.renderer.appendChild(this.divs![i*7+j].nativeElement, img);
        } 
        else if (grid[i][j] == "o" && this.computerTokenSRC) {
          //create a new image inside of the div whose class is "token" and set the src to this.computerTokenSRC
          let img = this.renderer.createElement('img');
          this.renderer.setAttribute(img, 'src', this.computerTokenSRC);
          this.renderer.addClass(img, 'token');
          this.renderer.appendChild(this.divs![i*7+j].nativeElement, img);
        }
      }
      if(this.gameStatus == "LOSS") {
        const target = this.loseIMG.nativeElement;
        this.renderer.setStyle(target, 'visibility', 'visible');
        this.removeButtonVisibility();
      } else if (this.gameStatus == "VICTORY") {
        const target = this.winIMG.nativeElement;
        this.renderer.setStyle(target, 'visibility', 'visible');
        this.removeButtonVisibility();
      } else if (this.gameStatus == "UNFINISHED") {
        const target = this.loseIMG.nativeElement;
        this.renderer.setStyle(target, 'visibility', 'hidden');
        const target2 = this.winIMG.nativeElement;
        this.renderer.setStyle(target2, 'visibility', 'hidden');
        this.addButtonVisibility();
      }
    }
  }
  //This is a function that removes all of the previous tokens on the board so that the board can be rendered again
  removePreviousGame() : void {
    if(this.divs) {
      for (let i = 0; i < this.divs.length; i++) {
        let div = this.divs[i].nativeElement;
        while(div.firstChild) {
          div.removeChild(div.firstChild);
        }
      }
    }
    const target = this.loseIMG.nativeElement;
    this.renderer.setStyle(target, 'visibility', 'hidden');
    const target2 = this.winIMG.nativeElement;
    this.renderer.setStyle(target2, 'visibility', 'hidden');
  }

  //This is a function that is envoked when the player clicks "return"
  return() : void {
    this.router.navigate(["/list/" + this.gid]);
  }

  //These functions are used to hide and show the buttons on the top of the board (depending on the status of the game)
  removeButtonVisibility() : void {
    for (let i = 0; i < this.buttons.length; i++) {
      let target = this.buttons[i].nativeElement;
      target = target.parentElement;
      this.renderer.addClass(target, 'disableTop');
    }
  }

  addButtonVisibility() : void {
    for (let i = 0; i < this.buttons.length; i++) {
      let target = this.buttons[i].nativeElement;
      target = target.parentElement;
      this.renderer.setStyle(target, 'visibility', 'visible');
      this.renderer.removeClass(target, 'disableTop');
    }
  }

}


