import { All, Controller, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';
import { auth } from './better-auth';

@Controller('auth')
export class AuthController {
  @All('*')
  async handleAuth(@Req() req: Request, @Res() res: Response) {
    const response = await auth.handler(req as any);
    const body = await response.text();
    res.status(response.status);
    response.headers.forEach((value, key) => {
      res.setHeader(key, value);
    });
    res.send(body);
  }
}
