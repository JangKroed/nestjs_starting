import { ConfigModule } from '@nestjs/config';
import { JwtStrategy } from './jwt/jwt.strategy';
import { Module, forwardRef } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { CatsModule } from 'src/cats/cats.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    PassportModule.register({ defaultStategy: 'jwt', sesstion: false }),
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '1y' },
    }),
    forwardRef(() => CatsModule),
  ],
  providers: [AuthService, JwtStrategy],
  exports: [AuthService],
})
export class AuthModule {}
