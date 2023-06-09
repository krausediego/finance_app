import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export class AuthSignUpDto {
  @ApiProperty({ required: true })
  @IsNotEmpty()
  @IsString()
  readonly username: string;

  @ApiProperty({ required: true })
  @IsNotEmpty()
  @IsString()
  @IsEmail()
  readonly email: string;

  @ApiProperty({ required: true })
  @IsNotEmpty()
  @IsString()
  readonly password: string;
}

export class AuthSignInDto {
  @ApiProperty({ required: true })
  @IsNotEmpty()
  readonly emailOrUsername: string;

  @ApiProperty({ required: true })
  @IsNotEmpty()
  @IsString()
  readonly password: string;

  @ApiProperty()
  @IsOptional()
  @IsBoolean()
  readonly remember?: boolean;
}

export class AuthLogoutDto {
  @ApiProperty({ required: true })
  @IsNotEmpty()
  @IsString()
  readonly id: string;
}

export class GetProfileDto {
  @ApiProperty({ required: true })
  @IsString()
  readonly id?: string;
}

export class UpdateProfileDto {
  @ApiProperty()
  @IsString()
  @IsOptional()
  readonly username?: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  readonly email?: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  readonly phone?: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  readonly avatar_url?: string;
}

export class UpdatePasswordDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  readonly oldPassword: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  readonly newPassword: string;
}
