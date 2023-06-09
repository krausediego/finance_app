import { Prisma, User } from '@prisma/client';
import { UserRepository } from 'src/domain/repositories/user-repository.interface';

export class UpdateProfileUseCases {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(id: string, data: Prisma.UserUpdateInput): Promise<User> {
    return this.userRepository.updateProfile(id, data);
  }
}
