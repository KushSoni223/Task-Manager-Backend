import { User } from "./model";

export class AuthRepository {
  async findByEmail(email: string) {
    return await User.findOne({ email });
  }

  async createUser(userData: any) {
    return await User.create(userData);
  }
}
