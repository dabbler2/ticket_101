import {IsDateString,IsNotEmpty} from 'class-validator'
import {IsGreaterThan} from '../../utils/is-greater-than.decorator'

export class Schedule {
	@IsDateString()
	@IsNotEmpty({message: '시작 시간이 비어있습니다.'})
	startAt: string
	
	@IsDateString()
	@IsNotEmpty({message: '종료 시간이 비어있습니다.'})
	@IsGreaterThan('startAt',{message: '종료 시간은 시작 시간 이후여야 합니다.'})
	endAt: string
}