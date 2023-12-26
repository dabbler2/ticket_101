import {IsEmail, IsNotEmpty, IsString, MinLength, MaxLength, IsInt, Min, ValidateIf, IsArray, ArrayMaxSize, ValidateNested} from 'class-validator'
import {Type} from 'class-transformer'
import {Schedule} from './schedule.dto'

export class ConcertDto {
	@IsString()
	@IsNotEmpty({message: '공연 이름을 입력해주세요.'})
	name: string
	
	@IsString()
	@ValidateIf((o,v) => v!==undefined)
	description: string | undefined
	
	@IsString()
	@IsNotEmpty({message: '공연 장소를 입력해주세요.'})
	venue: string
	
	@IsInt()
	@Min(0)
	capacity: number
	
	@IsString()
	@ValidateIf((o,v) => v!==undefined)
	thumbnail: string | undefined
	
	@IsString()
	@ValidateIf((o,v) => v!==undefined)
	category: string | undefined
	
	@IsArray()
	@ValidateNested({ each: true })
	@ArrayMaxSize(20)
	@Type(() => Schedule)
	schedules: Schedule[]
}