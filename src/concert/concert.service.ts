import {Injectable} from '@nestjs/common'
import {Repository} from 'typeorm'
import {InjectRepository} from '@nestjs/typeorm'
import {Concert} from './entities/concert.entity'
import {Schedule} from './entities/schedule.entity'
import { ConcertDto } from './dtos/concert.dto'

@Injectable()
export class ConcertService {
	constructor(
        @InjectRepository(Concert)
        private concertRepository: Repository<Concert>,
		@InjectRepository(Schedule)
        private scheduleRepository: Repository<Schedule>
    ) {}
	
	// 전체 공연 목록 보기
	async findAll(){
		return await this.concertRepository.find()
	}
	
	// 공연 등록
	async createConcert(concertDto: ConcertDto){
		const {schedules,...concert} = concertDto
		const {id,capacity:vacancy} = await this.concertRepository.save(concert)
		await this.scheduleRepository.insert(schedules.map(schedule => {return {concertId:id,vacancy,...schedule}}))
	}
}