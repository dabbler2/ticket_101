import {Column, Entity, ManyToOne, JoinColumn, Unique, PrimaryGeneratedColumn} from 'typeorm'
import {User} from '../../user/entities/user.entity'
import {Schedule} from '../../concert/entities/schedule.entity'

@Entity({name: 'bookings'})
@Unique(['userId', 'scheduleId'])
@Unique(['scheduleId', 'seatNum'])
export class Booking {
    @PrimaryGeneratedColumn()
    id: number

    @ManyToOne(() => User, user => user.Bookings, {onDelete: 'CASCADE'})
    @JoinColumn({name: 'user_id'})
    user: User

    @Column('int')
    userId: number

    @ManyToOne(() => Schedule, schedule => schedule.Bookings, {onDelete: 'CASCADE'})
    @JoinColumn({name: 'schedule_id'})
    schedule: Schedule

    @Column('int')
    scheduleId: number

    @Column('int')
    seatNum: number

    @Column('int')
    count: number

    @Column('int')
    spending: number
	
	@Column('datetime',{default:() => 'CURRENT_TIMESTAMP'})
	createdAt: Date
}
