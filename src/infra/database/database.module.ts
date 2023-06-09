import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ORMCompany } from './entities/ORMCompany';
import { ORMMember } from './entities/ORMMember';
import { ORMModule } from './entities/orm.module';
import { ORMAddress } from './entities/ORMAddress';

@Module({
  imports: [
    ORMModule,
    ConfigModule,
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('DATABASE_HOST'),
        port: Number(configService.get('DATABASE_PORT')),
        username: configService.get('DATABASE_USER'),
        password: configService.get('DATABASE_PASSWORD'),
        database: configService.get('DATABASE_NAME'),
        entities: [ORMCompany, ORMMember, ORMAddress],
        synchronize: true,
      }),
      inject: [ConfigService],
    }),
  ],
  exports: [TypeOrmModule],
})
export class DatabaseModule {
  constructor(private connection: DataSource) {}
}
