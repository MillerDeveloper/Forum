import { User } from './User';
export interface Comment {
     _id: string,
     user?: User,
     ip?: string,
     nameUser: string,
     text: string,
     date: Date,
     replies?: Comment[],
     idCompany?: string,
     root: boolean,
     pickedRating: number,
     replyForName: string,
     userData: {
          country: string,
          city: string
     },
     hidden: boolean,
     isNotFirstUserComment: boolean,
}
