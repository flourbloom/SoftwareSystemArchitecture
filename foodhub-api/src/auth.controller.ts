import { Controller, Get, Post, Query, Req, Res, UnauthorizedException } from '@nestjs/common';
import type { Request, Response } from 'express';
import { randomBytes } from 'node:crypto';
import { SESSIONS } from './data.js';
 
@Controller('v1')
export class AuthController {
  @Post('login')
  login(@Query('username') username: string, @Res({ passthrough: true }) res: Response) {
    const sid = randomBytes(32).toString('base64url');
    SESSIONS.set(sid, username);
    res.cookie('sid', sid, { httpOnly: true, sameSite: 'lax' }); // add secure: true behind HTTPS
    return { ok: true };
  }
 
  @Get('me')
  me(@Req() req: Request) {
    const username = SESSIONS.get(req.cookies?.sid);
    if (!username) throw new UnauthorizedException('not logged in');
    return { username };
  }
}
