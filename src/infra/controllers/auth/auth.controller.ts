import {
  Body,
  Controller,
  Get,
  Inject,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { UseCaseProxy } from 'src/infra/usecases-proxy/usecases-proxy';
import { AuthUseCasesProxyModule } from 'src/infra/usecases-proxy/auth/usecases-proxy.module';
import {
  AuthLogoutDto,
  AuthSignInDto,
  AuthSignUpDto,
  GetProfileDto,
  UpdatePasswordDto,
  UpdateProfileDto,
} from './auth.dto';
import { AuthGuard } from 'src/infra/guards/auth.guard';
import {
  SignUpUseCases,
  SignInUseCases,
  LogoutUseCases,
  GetProfileUseCases,
  UpdateProfileUseCases,
} from 'src/usecases/auth';
import { ChangePasswordUseCases } from 'src/usecases/auth/change-password-usecases';

@Controller('auth')
@ApiTags('auth')
@ApiResponse({
  status: 401,
  description: 'No authorization token was found',
})
@ApiResponse({ status: 500, description: 'Internal error' })
export class AuthController {
  constructor(
    @Inject(AuthUseCasesProxyModule.SIGN_UP_USECASES_PROXY)
    private readonly signUpUsecaseProxy: UseCaseProxy<SignUpUseCases>,
    @Inject(AuthUseCasesProxyModule.SIGN_IN_USECASES_PROXY)
    private readonly signInUsecaseProxy: UseCaseProxy<SignInUseCases>,
    @Inject(AuthUseCasesProxyModule.LOGOUT_USECASES_PROXY)
    private readonly logoutUsecaseProxy: UseCaseProxy<LogoutUseCases>,
    @Inject(AuthUseCasesProxyModule.GET_PROFILE_USECASES_PROXY)
    private readonly getProfileUsecaseProxy: UseCaseProxy<GetProfileUseCases>,
    @Inject(AuthUseCasesProxyModule.UPDATE_PROFILE_USECASES_PROXY)
    private readonly updateProfileUsecaseProxy: UseCaseProxy<UpdateProfileUseCases>,
    @Inject(AuthUseCasesProxyModule.UPDATE_PASSWORD_USECASES_PROXY)
    private readonly updatePasswordUsecaseProxy: UseCaseProxy<ChangePasswordUseCases>,
  ) {}

  @Post('signUp')
  @ApiBearerAuth()
  @ApiBody({ type: AuthSignUpDto })
  @ApiOperation({ description: 'Sign Up' })
  async signUp(@Body() data: AuthSignUpDto) {
    await this.signUpUsecaseProxy.getInstance().createUser(data);
  }

  @Post('signIn')
  @ApiBearerAuth()
  @ApiBody({ type: AuthSignInDto })
  @ApiOperation({ description: 'Sign In' })
  async signIn(@Body() data: AuthSignInDto) {
    const { emailOrUsername, password, remember } = data;
    return this.signInUsecaseProxy
      .getInstance()
      .validateLogin({ emailOrUsername, password }, remember);
  }

  @Post('logout')
  @ApiBearerAuth()
  @ApiBody({ type: AuthLogoutDto })
  @ApiOperation({ description: 'Logout' })
  async logout(@Body() data: AuthLogoutDto) {
    const { id } = data;
    return this.logoutUsecaseProxy.getInstance().disconnectAccount(id);
  }

  @UseGuards(AuthGuard)
  @Get('profile')
  @ApiBearerAuth()
  @ApiQuery({ type: GetProfileDto })
  @ApiOperation({ description: 'get profile' })
  getProfile(@Query() data: GetProfileDto) {
    const { id } = data;
    return this.getProfileUsecaseProxy.getInstance().execute(id);
  }

  @UseGuards(AuthGuard)
  @Put('profile')
  @ApiBearerAuth()
  @ApiBody({ type: UpdateProfileDto })
  @ApiOperation({ description: 'update profile' })
  updateProfile(@Body() data: UpdateProfileDto, @Query() query: any) {
    const { id } = query;
    return this.updateProfileUsecaseProxy.getInstance().execute(id, data);
  }

  @UseGuards(AuthGuard)
  @Put('change-password')
  @ApiBearerAuth()
  @ApiBody({ type: UpdatePasswordDto })
  @ApiOperation({ description: 'update password' })
  updatePassword(@Body() data: UpdatePasswordDto, @Query() query: any) {
    const { id } = query;
    const { oldPassword, newPassword } = data;
    return this.updatePasswordUsecaseProxy
      .getInstance()
      .execute({ id, oldPassword, newPassword });
  }
}
