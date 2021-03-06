import { IsEmail, IsString, Matches } from 'class-validator';
import { validPasswordRegex } from '../../constants';

export class ClientRegisterDto {
  @IsString()
  firstName: string;

  @IsString()
  lastName: string;

  @IsEmail()
  email: string;

  @Matches(validPasswordRegex, { message: 'Пароль должен быть не менее 6 символов, состоять из цифр и латинских букв, в том числе заглавных' })
  password: string;
}
