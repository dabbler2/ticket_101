import {Roles} from 'src/auth/roles.decorator'
import {RolesGuard} from 'src/auth/roles.guard'
import {Role} from 'src/user/types/userRole.type'
import {Query, Param, Get, Post, Body, UseGuards, Controller, BadRequestException} from '@nestjs/common'
import {ConcertService} from './concert.service'
import {ConcertDto} from './dtos/concert.dto'
import {Id} from '../utils/id'

@Controller('concert')
export class ConcertController {
    constructor(private readonly concertService: ConcertService) {}

    // 전체 공연 목록 보기
    @Get()
    async findAll() {
        return await this.concertService.findAll()
    }

    // 공연 상세 정보 보기
    @Get('/detail/:id')
    async findConcert(@Param() params: Id) {
        const {id} = params
        return await this.concertService.findConcert(id)
    }

    // 공연 검색
    @Get('/search')
    async search(@Query('keyword') keyword: string) {
        if (!keyword) throw new BadRequestException('검색어를 입력해주세요.')
        return await this.concertService.search(keyword)
    }

    // 공연 등록
    @UseGuards(RolesGuard)
    @Roles(Role.Admin)
    @Post()
    async createConcert(@Body() concertDto: ConcertDto) {
        await this.concertService.createConcert(concertDto)
        return {message: '공연이 등록되었습니다.'}
    }
}
