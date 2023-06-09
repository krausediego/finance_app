import { UserRepository } from 'src/domain/repositories/user-repository.interface';

export class GetProfileUseCases {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(id: string) {
    return this.userRepository.getProfile(id);
  }
}
