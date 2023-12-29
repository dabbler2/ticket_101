import {Roles} from 'src/auth/roles.decorator'
import {RolesGuard} from 'src/auth/roles.guard'
import {Role} from 'src/user/types/userRole.type'
import {Req, Param, Get, Post, Delete, UseGuards, Controller} from '@nestjs/common'
import {BookingService} from './booking.service'
import {Id} from '../utils/id'

@UseGuards(RolesGuard)
@Controller('booking')
export class BookingController {
    constructor(private readonly bookingService: BookingService) {}

    // 공연 예매, 일단 1장씩만 가능
    @Roles(Role.User)
    @Post(':id/:seatNum')
    async book(@Param() param: Id) {
        const {id, seatNum} = param
        const booking = await this.bookingService.book(id, seatNum)
        return {message: '예매가 완료되었습니다.', booking}
    }

    // 내 예매 목록 확인
    @Roles(Role.User)
    @Get('myBooking')
    async getMyBooking(@Req() req) {
        return await this.bookingService.findByUser(req.user.id)
    }

    // 예매 취소
    @Roles(Role.User)
    @Delete(':id')
    async cancel(@Param() param: Id) {
        const {id} = param
        return await this.bookingService.cancel(id)
    }
}
