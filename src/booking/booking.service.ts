import {Scope, Inject, Injectable, BadRequestException, ConflictException} from '@nestjs/common'
import {Repository, QueryFailedError} from 'typeorm'
import {InjectRepository} from '@nestjs/typeorm'
import {Booking} from './entities/booking.entity'
import {Schedule} from '../concert/entities/schedule.entity'
import {User} from '../user/entities/user.entity'
import {DataSource} from 'typeorm'
import {REQUEST} from '@nestjs/core'
import {RequestWithInfo} from '../utils/request-with-info'

@Injectable({scope: Scope.REQUEST})
export class BookingService {
    constructor(
        @InjectRepository(Booking)
        private readonly bookingRepository: Repository<Booking>,
        @InjectRepository(Schedule)
        private readonly scheduleRepository: Repository<Schedule>,
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
        private readonly dataSource: DataSource,
        @Inject(REQUEST) private req: RequestWithInfo
    ) {}

    // 공연 예매, 일단 1장씩만 가능
    async book() {
        const queryRunner = this.dataSource.createQueryRunner()
        await queryRunner.connect()
        await queryRunner.startTransaction()
        try {
            const {user, schedule, concert} = this.req
            const spending = concert.price
            if (user.point < spending) throw new BadRequestException('포인트가 부족합니다.')
            user.point -= spending
            await queryRunner.manager.save(user)
            --schedule.vacancy
            await queryRunner.manager.save(schedule)
            await queryRunner.manager.save(Booking, {userId: user.id, scheduleId: schedule.id, count: 1, spending})
            await queryRunner.commitTransaction()
        } catch (e) {
            await queryRunner.rollbackTransaction()
            if (e instanceof QueryFailedError) throw new ConflictException('이미 예매하신 공연입니다.')
            throw e
        } finally {
            await queryRunner.release()
        }
    }
	
	// 내 예매 목록 확인
	async findByUser(userId){
		return await this.bookingRepository.find({where:{userId}})
	}
}
