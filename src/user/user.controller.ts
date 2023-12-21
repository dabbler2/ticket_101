import {Body, Controller, Get, Post, BadRequestException} from '@nestjs/common'
import {User} from './entities/user.entity'
import {UserService} from './user.service'
import {SignupDto} from './user.dto'

@Controller('user')
export class UserController {
    constructor(private readonly userService: UserService) {}

    @Post('signup')
    async signup(@Body() signupDto: SignupDto) {
        const {email, nickname, password, confirmPW} = signupDto
        if (password !== confirmPW)
            throw new BadRequestException('확인용 비밀번호가 일치하지 않습니다.')
        return await this.userService.signup(email, nickname, password)
    }
}
