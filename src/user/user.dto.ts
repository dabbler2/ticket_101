import {IsEmail, IsNotEmpty, IsString, MinLength, MaxLength, IsEnum} from 'class-validator'
import {Role} from './types/userRole.type'

export class SignupDto {
    @IsEmail()
    @IsNotEmpty({message: '이메일을 입력해주세요.'})
    email: string

    @IsString()
    @MinLength(6, {message: '닉네임은 6자리 이상이어야 합니다.'})
    @MaxLength(20, {message: '닉네임은 20자리 이하여야 합니다.'})
    @IsNotEmpty({message: '닉네임을 입력해주세요.'})
    nickname: string

    @IsString()
    @MinLength(6, {message: '비밀번호는 6자리 이상이어야 합니다.'})
    @MaxLength(20, {message: '비밀번호는 20자리 이하여야 합니다.'})
    @IsNotEmpty({message: '비밀번호를 입력해주세요.'})
    password: string

    @IsString()
    @IsNotEmpty({message: '확인용 비밀번호를 입력해주세요.'})
    confirmPW: string

    @IsEnum(Role)
    role: Role
}

export class SigninDto {
    @IsEmail()
    @IsNotEmpty({message: '이메일을 입력해주세요.'})
    email: string

    @IsString()
    @IsNotEmpty({message: '비밀번호를 입력해주세요.'})
    password: string
}
