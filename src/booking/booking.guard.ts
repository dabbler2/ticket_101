import {BadRequestException, NotFoundException, CanActivate, ExecutionContext, Inject, Injectable} from '@nestjs/common'
import {Reflector} from '@nestjs/core'
import {ConcertService} from 'src/concert/concert.service'

@Injectable()
export class BookingGuard implements CanActivate {
    constructor(@Inject(ConcertService) private concertService: ConcertService) {}

    async canActivate(context: ExecutionContext) {
        const req = context.switchToHttp().getRequest()
        const {concertId, scheduleId} = req.params
        const schedule = await this.concertService.findSchedule(+scheduleId)
        if (!schedule || +concertId !== schedule.concertId) throw new NotFoundException('해당 일정을 찾을 수 없습니다.')
        const {vacancy} = schedule
        if (!vacancy) throw new BadRequestException('죄송합니다. 해당 일정은 매진입니다.')
        const concert = await this.concertService.findConcert(+concertId, false)
        req.concert = concert
        req.schedule = schedule
        return true
    }
}
