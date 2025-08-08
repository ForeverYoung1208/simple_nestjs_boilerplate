import { ConfigModule } from '@nestjs/config';
import { DataSource } from 'typeorm';
import { dataSourceOptions } from '../config/db/data-source-options.config';
import { envFilePath } from '../config';

void ConfigModule.forRoot({
  isGlobal: true,
  load: [dataSourceOptions],
  envFilePath: envFilePath(),
});

export default new DataSource(dataSourceOptions());
