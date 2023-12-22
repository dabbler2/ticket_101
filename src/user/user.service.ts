import {Injectable, ConflictException, UnauthorizedException} from '@nestjs/common'
import {JwtService} from '@nestjs/jwt'
import {compare, hash} from 'bcrypt'
import {Repository, QueryFailedError} from 'typeorm'
import {InjectRepository} from '@nestjs/typeorm'
import {Role} from './types/userRole.type'
import {User} from './entities/user.entity'

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User)
        private userRepository: Repository<User>,
        private readonly jwtService: JwtService
    ) {}

    // 회원가입
    async signup(email: string, nickname: string, password: string, role: Role) {
        const hashPW = await hash(password, 10)
        try {
            await this.userRepository.save({
                email,
                nickname,
                hashPW,
                role,
                point: role === Role.User ? 1000000 : 0
            })
            return {
                message: (role === Role.User ? '회원가입이' : '관리자 등록이') + ' 완료되었습니다.'
            }
        } catch (e) {
            if (e instanceof QueryFailedError)
                throw new ConflictException('이메일이 이미 사용중입니다.')
            throw e
        }
    }

    // 로그인
    async signin(email: string, password: string) {
        const user = await this.userRepository.findOne({
            where: {email},
            select: {id: true, hashPW: true}
        })
        if (!user || !(await compare(password, user.hashPW)))
            throw new UnauthorizedException('이메일이나 비밀번호를 확인해주세요.')
        const payload = {email, id: user.id}
        console.log(user.id)
        return {accessToken: this.jwtService.sign(payload)}
    }
}
