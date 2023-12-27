import {Column, Entity, ManyToOne, JoinColumn,  PrimaryGeneratedColumn} from 'typeorm'
import {User} from '../../user/entities/user.entity'
import {Schedule} from '../../concert/entities/schedule.entity'

@Entity({name: 'tickets'})
export class Ticket{
	@PrimaryGeneratedColumn()
    id: number
	
	@ManyToOne(() => User, user => user.tickets, {onDelete:'CASCADE'})
	@JoinColumn({name:'user_id'})
	user: User
	
	@Column('int')
	userId: number
	
	@ManyToOne(() => Schedule, schedule => schedule.tickets, {onDelete:'CASCADE'})
	@JoinColumn({name:'schedule_id'})
	schedule: Schedule
	
	@Column('int')
	scheduleId: number
	
	@Column('int')
	count: number
	
	@Column('int')
	spending: number
}