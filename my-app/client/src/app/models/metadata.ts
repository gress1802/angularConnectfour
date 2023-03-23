//Metadata object
//This object is used to store the metadata information
//tokens: A list of all token objects supported by the game
//default: a theme object denoting the default theme for new game creation
import { Token } from './token';
import { Theme } from './theme';
export interface Metadata{
    tokens : Token;
    default : Theme;
}