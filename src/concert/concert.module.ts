import {Module} from '@nestjs/common'
import {TypeOrmModule} from '@nestjs/typeorm'
import {ConcertService} from './concert.service'
import {ConcertController} from './concert.controller'
import {Concert} from './entities/concert.entity'
import {Schedule} from './entities/schedule.entity'

@Module({
	imports: [TypeOrmModule.forFeature([Concert,Schedule])],
    providers: [ConcertService],
    controllers: [ConcertController]
})
export class ConcertModule {}
