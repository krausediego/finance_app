import { DynamicModule, Module } from '@nestjs/common';
import { RepositoriesModule } from '../../repositories/repositories.module';
import { DatabaseUserRepository } from '../../repositories/user.repository';
import { UseCaseProxy } from 'src/infra/usecases-proxy/usecases-proxy';
import {
  SignUpUseCases,
  SignInUseCases,
  LogoutUseCases,
  GetProfileUseCases,
  UpdateProfileUseCases,
} from 'src/usecases/auth';
import { BcryptService } from '../../services/bcrypt/bcrypt.service';
import { BcryptModule } from '../../services/bcrypt/bcrypt.module';
import { ExceptionsService } from '../../exceptions/exceptions.service';
import { JwtTokenService } from '../../services/jwt/jwt.service';
import { ExceptionsModule } from '../../exceptions/exceptions.module';
import { JwtTokenModule } from '../../services/jwt/jwt.module';
import { RedisCacheModule } from '../../cache/redis/redis-cache.module';
import { TokenCache } from '../../cache/redis/token.cache';
import { ChangePasswordUseCases } from 'src/usecases/auth/change-password-usecases';

@Module({
  imports: [
    RepositoriesModule,
    BcryptModule,
    ExceptionsModule,
    JwtTokenModule,
    RedisCacheModule,
  ],
})
export class AuthUseCasesProxyModule {
  static SIGN_UP_USECASES_PROXY = 'SignUpUsecasesProxy';
  static SIGN_IN_USECASES_PROXY = 'SignInUsecasesProxy';
  static LOGOUT_USECASES_PROXY = 'LogoutUsecasesProxy';
  static GET_PROFILE_USECASES_PROXY = 'GetProfileUsecasesProxy';
  static UPDATE_PROFILE_USECASES_PROXY = 'UpdateProfileUsecasesProxy';
  static UPDATE_PASSWORD_USECASES_PROXY = 'UpdatePasswordUsecasesProxy';

  static register(): DynamicModule {
    return {
      module: AuthUseCasesProxyModule,
      providers: [
        {
          inject: [DatabaseUserRepository, BcryptService],
          provide: AuthUseCasesProxyModule.SIGN_UP_USECASES_PROXY,
          useFactory: (
            userRepo: DatabaseUserRepository,
            bcrypt: BcryptService,
          ) => new UseCaseProxy(new SignUpUseCases(userRepo, bcrypt)),
        },
        {
          inject: [
            DatabaseUserRepository,
            BcryptService,
            ExceptionsService,
            JwtTokenService,
            TokenCache,
          ],
          provide: AuthUseCasesProxyModule.SIGN_IN_USECASES_PROXY,
          useFactory: (
            userRepo: DatabaseUserRepository,
            bcrypt: BcryptService,
            exceptions: ExceptionsService,
            jwt: JwtTokenService,
            tokenCache: TokenCache,
          ) =>
            new UseCaseProxy(
              new SignInUseCases(userRepo, bcrypt, exceptions, jwt, tokenCache),
            ),
        },
        {
          inject: [TokenCache],
          provide: AuthUseCasesProxyModule.LOGOUT_USECASES_PROXY,
          useFactory: (tokenCache: TokenCache) =>
            new UseCaseProxy(new LogoutUseCases(tokenCache)),
        },
        {
          inject: [DatabaseUserRepository],
          provide: AuthUseCasesProxyModule.GET_PROFILE_USECASES_PROXY,
          useFactory: (userRepo: DatabaseUserRepository) =>
            new UseCaseProxy(new GetProfileUseCases(userRepo)),
        },
        {
          inject: [DatabaseUserRepository],
          provide: AuthUseCasesProxyModule.UPDATE_PROFILE_USECASES_PROXY,
          useFactory: (userRepo: DatabaseUserRepository) =>
            new UseCaseProxy(new UpdateProfileUseCases(userRepo)),
        },
        {
          inject: [DatabaseUserRepository, BcryptService, ExceptionsService],
          provide: AuthUseCasesProxyModule.UPDATE_PASSWORD_USECASES_PROXY,
          useFactory: (
            userRepo: DatabaseUserRepository,
            bcrypt: BcryptService,
            exceptions: ExceptionsService,
          ) =>
            new UseCaseProxy(
              new ChangePasswordUseCases(userRepo, bcrypt, exceptions),
            ),
        },
      ],
      exports: [
        AuthUseCasesProxyModule.SIGN_UP_USECASES_PROXY,
        AuthUseCasesProxyModule.SIGN_IN_USECASES_PROXY,
        AuthUseCasesProxyModule.LOGOUT_USECASES_PROXY,
        AuthUseCasesProxyModule.GET_PROFILE_USECASES_PROXY,
        AuthUseCasesProxyModule.UPDATE_PROFILE_USECASES_PROXY,
        AuthUseCasesProxyModule.UPDATE_PASSWORD_USECASES_PROXY,
      ],
    };
  }
}
