import Joi from 'joi'
import {SnakeNamingStrategy} from 'typeorm-naming-strategies'

import {Module} from '@nestjs/common'
import {ConfigModule, ConfigService} from '@nestjs/config'
import {TypeOrmModule, TypeOrmModuleOptions} from '@nestjs/typeorm'

import {AppController} from './app.controller'
import {AppService} from './app.service'

import {UserModule} from './user/user.module'
import {AuthModule} from './auth/auth.module'
import {ConcertModule} from './concert/concert.module'
import { TicketModule } from './ticket/ticket.module';

console.log(__dirname)
const typeOrmModuleOptions = {
    useFactory: async (configService: ConfigService): Promise<TypeOrmModuleOptions> => ({
        namingStrategy: new SnakeNamingStrategy(),
        type: 'mysql',
        username: configService.get('DB_USERNAME'),
        password: configService.get('DB_PASSWORD'),
        host: configService.get('DB_HOST'),
        port: configService.get('DB_PORT'),
        database: configService.get('DB_NAME'),
        entities: [__dirname + "/*/entities/*{.js,.ts}"],
        synchronize: configService.get('DB_SYNC'),
        logging: true
    }),
    inject: [ConfigService]
}

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            validationSchema: Joi.object({
                DB_USERNAME: Joi.string().required(),
                DB_PASSWORD: Joi.string().required(),
                DB_HOST: Joi.string().required(),
                DB_PORT: Joi.number().required(),
                DB_NAME: Joi.string().required(),
                DB_SYNC: Joi.boolean().required()
            })
        }),
        TypeOrmModule.forRootAsync(typeOrmModuleOptions),
        UserModule,
        AuthModule,
        ConcertModule,
        TicketModule
    ],
    controllers: [AppController],
    providers: [AppService]
})
export class AppModule {}
