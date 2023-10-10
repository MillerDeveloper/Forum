export interface User {
     _id?: string,
     name?: string,
     email: string,
     password?: string,
     dateCreate?: Date,
     companies?: string[],
     phone?: string,
     city?: string,
     logo?: string,
     rules?: {
          moderator: Boolean,
          admin: Boolean,
          canEditComments: Boolean
     }
}