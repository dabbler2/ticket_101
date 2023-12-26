import { Module } from '@nestjs/common';

import { PassportModule } from '@nestjs/passport'
import { ConfigService } from '@nestjs/config'
import { JwtModule } from '@nestjs/jwt'
import { JwtStrategy } from './jwt.strategy'
import { UserModule } from 'src/user/user.module'

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt', session: false }),
    JwtModule.registerAsync({
      useFactory: (config: ConfigService) => ({
        secret: config.get<string>('ACCESS_SECRET_KEY'),
      }),
      inject: [ConfigService],
    }),
    UserModule, // 추가!
  ],
  providers: [JwtStrategy],
})
export class AuthModule {}