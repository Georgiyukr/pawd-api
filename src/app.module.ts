import { Module } from '@nestjs/common';
import { ApiModule } from './api/api.module';
import { DomainModule } from './domain/domain.module';

@Module({
  imports: [ApiModule, DomainModule],
})
export class AppModule {}
