import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { User } from './entities/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Profile } from 'src/profile/entities/profile.entity';
import { JwtModule } from '@nestjs/jwt';
import{PassportModule} from '@nestjs/passport';
import { JwtStrategy } from 'src/auth/jwt.strategy';

@Module({
  imports: [TypeOrmModule.forFeature([User, Profile]),
  JwtModule.register({
    global: true,
    secret: process.env.JWTSecret,
    signOptions: { expiresIn: '1h' },
  }),

  PassportModule.register({
    defaultStrategy: 'jwt',
    session: true
  })
],
  controllers: [UserController],
  providers: [UserService, JwtStrategy],
  exports:[UserService,
    PassportModule , JwtStrategy
  ]
})
export class UserModule {}
