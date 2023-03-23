import { Theme } from './theme';
export interface User {
   id : string,
   first : string,
   last : string,
   email : string,
   defaults: Theme
}