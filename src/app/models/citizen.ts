import {User} from './user'
import {Address} from './address'
export class Citizen{
        public user: User = new User();
        public address:Address = new Address();
        public firstName:String;
        public lastName:String;
}