import {Module} from '@nestjs/common'
import {TypeOrmModule} from '@nestjs/typeorm'
import {ConfigService} from '@nestjs/config'
import {JwtModule} from '@nestjs/jwt'
import {UserService} from './user.service'
import {UserController} from './user.controller'
import {User} from './entities/user.entity'

@Module({
    imports: [
        JwtModule.registerAsync({
            useFactory: (config: ConfigService) => ({
                secret: config.get<string>('JWT_SECRET_KEY')
            }),
            inject: [ConfigService]
        }),
        TypeOrmModule.forFeature([User])
    ],
    providers: [UserService],
    controllers: [UserController]
})
export class UserModule {}
