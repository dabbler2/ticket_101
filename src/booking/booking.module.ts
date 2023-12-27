import {Module} from '@nestjs/common'
import {TypeOrmModule} from '@nestjs/typeorm'
import {BookingService} from './booking.service'
import {BookingController} from './booking.controller'
import {Booking} from './entities/booking.entity'
import {Schedule} from '../concert/entities/schedule.entity'
import {User} from '../user/entities/user.entity'
import {ConcertModule} from '../concert/concert.module'

@Module({
    imports: [TypeOrmModule.forFeature([Booking, Schedule, User]), ConcertModule],
    providers: [BookingService],
    controllers: [BookingController]
})
export class BookingModule {}
