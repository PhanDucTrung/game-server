import { Controller, Get, Res } from '@nestjs/common';
import { Response } from 'express';

@Controller()
export class RootController {
  @Get()
  redirectToViews(@Res() res: Response) {
    res.redirect('/views');
  }
}
