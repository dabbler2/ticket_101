import {Body, HttpCode, Controller, Get, Post, Req, Res, BadRequestException, UseGuards} from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'

import {User} from './entities/user.entity'
import {UserService} from './user.service'

import {SignupDto} from './dtos/signup.dto'
import {SigninDto} from './dtos/signin.dto'

@Controller('')
export class UserController {
    constructor(private readonly userService: UserService) {}

    // 회원가입
    @Post('signup')
    async signup(@Body() signupDto: SignupDto) {
        const {email, nickname, password, confirmPW, role} = signupDto
        if (password !== confirmPW)
            throw new BadRequestException('확인용 비밀번호가 일치하지 않습니다.')
        const {isUser} = await this.userService.signup(email, nickname, password, role)
		return {message: (isUser ? '회원가입이' : '관리자 등록이') + ' 완료되었습니다.'}
    }

    // 로그인
    @Post('signin')
    async signin(@Body() signinDto: SigninDto, @Res() res) {
        const {email, password} = signinDto
        const {accessToken} = await this.userService.signin(email, password)
		res.cookie('accessToken',accessToken)
        return res.status(200).json({message: '로그인에 성공했습니다.'})
    }
	
	// 내 정보 보기
	// 데코레이터 써야되려나?
	@UseGuards(AuthGuard('jwt'))
	@Get('myInfo')
	getMyInfo(@Req() req){
		const {email, point, nickname} = req.user
		return {email, nickname, point}
	}
}
