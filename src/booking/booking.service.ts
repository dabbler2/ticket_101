import {
    Scope,
    Inject,
    Injectable,
    BadRequestException,
    NotFoundException,
    ConflictException,
    ForbiddenException
} from '@nestjs/common'
import {Repository, QueryFailedError} from 'typeorm'
import {InjectRepository} from '@nestjs/typeorm'
import {Booking} from './entities/booking.entity'
import {DataSource} from 'typeorm'
import {REQUEST} from '@nestjs/core'
import {RequestWithInfo} from '../utils/request-with-info'
import {ConcertService} from 'src/concert/concert.service'

@Injectable({scope: Scope.REQUEST})
export class BookingService {
    constructor(
        @InjectRepository(Booking)
        private readonly bookingRepository: Repository<Booking>,
        private readonly dataSource: DataSource,
        @Inject(REQUEST) private req: RequestWithInfo,
        @Inject(ConcertService) private concertService: ConcertService
    ) {}

    // 공연 예매, 일단 1장씩만 가능
    async book(id, seatNum) {
        const schedule = await this.concertService.findSchedule(id)
        if (!schedule) throw new NotFoundException('해당 일정을 찾을 수 없습니다.')
        const {concertId, vacancy} = schedule
        if (!vacancy) throw new BadRequestException('죄송합니다. 해당 일정은 매진입니다.')
        const concert = await this.concertService.findConcert(concertId, false)
        const {capacity} = concert
        if (seatNum > capacity) throw new BadRequestException('잘못된 좌석 번호입니다.')
        const {user} = this.req
        const existBooking = await this.bookingRepository.findOne({where: {userId: user.id, scheduleId: id}})
        if (existBooking) throw new ConflictException('이미 예매하신 공연입니다.')
        const queryRunner = this.dataSource.createQueryRunner()
        await queryRunner.connect()
        await queryRunner.startTransaction()
        try {
            const spending = concert.price
            if (user.point < spending) throw new BadRequestException('포인트가 부족합니다.')
            user.point -= spending
            await queryRunner.manager.save(user)
            --schedule.vacancy
            await queryRunner.manager.save(schedule)
            const booking = {userId: user.id, scheduleId: id, count: 1, seatNum, spending}
            await queryRunner.manager.save(Booking, booking)
            await queryRunner.commitTransaction()
            return booking
        } catch (e) {
            await queryRunner.rollbackTransaction()
            if (e instanceof QueryFailedError) throw new ConflictException('해당 좌석은 이미 예매되었습니다.')
            throw e
        } finally {
            await queryRunner.release()
        }
    }

    // 사용자별 목록 확인
    async findByUser(userId: number) {
        return await this.bookingRepository.find({where: {userId}, order: {createdAt: 'DESC'}})
    }

    // 스케줄별 목록 확인
    async findBySchedule(scheduleId: number) {
        return await this.bookingRepository.find({where: {scheduleId}})
    }

    // 예매 취소
    async cancel(id: number) {
        const booking = await this.bookingRepository.findOne({where: {id}})
        const {user} = this.req
        if (!booking || booking.userId !== user.id) throw new ForbiddenException('권한이 없습니다.')
        const queryRunner = this.dataSource.createQueryRunner()
        await queryRunner.connect()
        await queryRunner.startTransaction('REPEATABLE READ')
        try {
            const {scheduleId, spending} = booking
            const schedule = await this.concertService.findSchedule(scheduleId)
			const startAt = new Date(schedule.startAt).getTime()
			if(startAt-Date.now()<10800000) throw new BadRequestException('공연 시작 전 3시간 이내에는 예매 취소가 불가능합니다.')
            user.point += spending
            await queryRunner.manager.save(user)
            await queryRunner.manager.delete(Booking, booking)
            ++schedule.vacancy
            await queryRunner.manager.save(schedule)
            await queryRunner.commitTransaction()
        } catch (e) {
            await queryRunner.rollbackTransaction()
            throw e
        } finally {
            await queryRunner.release()
        }
    }
}
