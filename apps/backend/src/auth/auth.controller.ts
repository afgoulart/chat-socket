import { Controller, Post, Body, HttpException, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() body: { email: string; password: string }) {
    const user = await this.authService.login(body.email, body.password);

    if (!user) {
      throw new HttpException('Invalid credentials', HttpStatus.UNAUTHORIZED);
    }

    return { user, message: 'Login successful' };
  }

  @Post('register')
  async register(
    @Body() body: { email: string; password: string; name: string; role?: 'admin' | 'consultant' }
  ) {
    try {
      const user = await this.authService.register(
        body.email,
        body.password,
        body.name,
        body.role
      );
      return { user, message: 'Registration successful' };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
}
