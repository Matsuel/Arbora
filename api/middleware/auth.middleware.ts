import type { Request, Response, NextFunction } from 'express'
import { supabase } from '../lib/supabase'
import AppError from '../models/error.model'

const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization?.split('Bearer ')[1]
    if (!token) return next(new AppError('Unauthorized', 401))

    const { data, error } = await supabase.auth.getUser(token)
    if (error) {
        console.error('Authentication error:', error)
        return next(new AppError('Unauthorized', 401))
    }

    if (!data?.user) {
        console.error('No user found for token')
        return next(new AppError('Unauthorized', 401))
    }

    req.userId = data.user.id
    next()
}

export default authMiddleware