import {Request} from 'express'

export interface RequestWithInfo extends Request {
    user: any
    schedule: any
    concert: any
}
