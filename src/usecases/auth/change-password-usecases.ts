import { IBcryptService } from 'src/domain/adapters/bcrypt.interface';
import { IException } from 'src/domain/exceptions/exceptions.interface';
import { IChangePassword } from 'src/domain/interfaces/auth/change-password.interface';
import { UserRepository } from 'src/domain/repositories/user-repository.interface';

export class ChangePasswordUseCases {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly bcryptService: IBcryptService,
    private readonly exception: IException,
  ) {}

  async execute(data: IChangePassword): Promise<void> {
    const { id, oldPassword, newPassword } = data;

    const user = await this.userRepository.signIn({ id });

    const compare = await this.bcryptService.compare(
      oldPassword,
      user.password,
    );

    if (!compare) {
      this.exception.badRequestException({
        message: 'Old password is not correctly.',
      });
    }

    const newHashedPassword = await this.bcryptService.hash(newPassword);

    await this.userRepository.updateProfile(id, {
      password: newHashedPassword,
    });
  }
}
