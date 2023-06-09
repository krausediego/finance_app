import { Module } from '@nestjs/common';
import { AuthUseCasesProxyModule } from '../usecases-proxy/auth/usecases-proxy.module';
import { AuthController } from './auth/auth.controller';
import { TokenCache } from '../cache/redis/token.cache';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [AuthUseCasesProxyModule.register()],
  controllers: [AuthController],
  providers: [TokenCache, JwtService],
})
export class ControllersModule {}
