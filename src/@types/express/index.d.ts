import { UserDocument } from "../../models/user.model";

// declare global {
//   namespace Express {
//     // eslint-disable-next-line @typescript-eslint/no-empty-interface
//     interface User extends UserDocument {}
//   }
// }

// interface ExpressUser extends Express.User, UserDocument {}

declare global {
  namespace Express {
    interface User extends UserDocument {}
  }
}
