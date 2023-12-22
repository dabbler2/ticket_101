import {Body, Controller, Get, Post, Res, BadRequestException} from '@nestjs/common'
import {User} from './entities/user.entity'
import {UserService} from './user.service'
import {SignupDto, SigninDto} from './user.dto'

@Controller('')
export class UserController {
    constructor(private readonly userService: UserService) {}

    // 회원가입
    @Post('signup')
    async signup(@Body() signupDto: SignupDto) {
        const {email, nickname, password, confirmPW, role} = signupDto
        if (password !== confirmPW)
            throw new BadRequestException('확인용 비밀번호가 일치하지 않습니다.')
        return await this.userService.signup(email, nickname, password, role)
    }

    // 로그인
    @Post('signin')
    async signin(@Body() signinDto: SigninDto, @Res() res) {
        const {email, password} = signinDto
        const {accessToken} = await this.userService.signin(email, password)
		res.setHeader('accessToken',accessToken)
        console.log(accessToken)
        return res.json({message: '로그인에 성공했습니다.'})
    }
}
