import {IsInt, Min, IsOptional} from 'class-validator'
import {Type} from 'class-transformer'

export class Id {
    @IsInt()
    @Type(() => Number)
    @Min(1)
    id: number
	
	@IsOptional()
	@IsInt()
    @Type(() => Number)
    @Min(1)
    seatNum: number
}
