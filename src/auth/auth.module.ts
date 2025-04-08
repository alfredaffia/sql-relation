import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from 'src/user/user.module';

@Module({
  imports:[ UserModule,
    ConfigModule.forRoot({
      isGlobal: true
    }),  
    JwtModule.register({
    global: true,
    secret: process.env.JWTSECRET,
    signOptions: { expiresIn: '1h' },
  }),
],
  controllers: [AuthController],
  providers: [AuthService]
})
export class AuthModule {}

