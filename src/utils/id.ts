import {IsInt, Min} from 'class-validator'
import {Type} from 'class-transformer'

export class Id {
    @IsInt()
    @Type(() => Number)
    @Min(1)
    id: number
}
