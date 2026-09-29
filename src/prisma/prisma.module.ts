import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service.js';

@Global() // @Global allows you to inject PrismaService anywhere without re-importing PrismaModule
@Module({
  providers: [PrismaService],
  exports: [PrismaService],
})
export class PrismaModule {}