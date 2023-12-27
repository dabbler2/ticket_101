import {Injectable, NotFoundException} from '@nestjs/common'
import {Like, Repository} from 'typeorm'
import {InjectRepository} from '@nestjs/typeorm'
import {Concert} from './entities/concert.entity'
import {Schedule} from './entities/schedule.entity'
import {ConcertDto} from './dtos/concert.dto'

@Injectable()
export class ConcertService {
    constructor(
        @InjectRepository(Concert)
        private concertRepository: Repository<Concert>,
        @InjectRepository(Schedule)
        private scheduleRepository: Repository<Schedule>
    ) {}

    // 전체 공연 목록 보기
    async findAll() {
        return await this.concertRepository.find()
    }

    // 공연 상세 정보 보기
    async findOne(id: number) {
        const concert = await this.concertRepository.findOne({
            where: {id},
            relations: {
                schedules: true
            }
        })
        if (!concert) throw new NotFoundException('해당 공연을 찾을 수 없습니다.')
        return concert
    }

    // 공연 검색
    async search(keyword: string) {
        return await this.concertRepository.find({where: {name: Like(`%${keyword}%`)}})
    }

    // 공연 등록
    async createConcert(concertDto: ConcertDto) {
        const {schedules, ...concert} = concertDto
        const {id, capacity: vacancy} = await this.concertRepository.save(concert)
        await this.scheduleRepository.insert(
            schedules.map(schedule => {
                return {concertId: id, vacancy, ...schedule}
            })
        )
    }
}
