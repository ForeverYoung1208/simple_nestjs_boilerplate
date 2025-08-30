import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from './../src/app.module';
import { AppService } from '../src/app.service';

describe('AppController (integration)', () => {
  let app: INestApplication<App>;
  let appService: AppService;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
    appService = moduleFixture.get<AppService>(AppService);
  });
  afterAll(async () => {
    await app.close();
  });

  it('shoud call appService.checkHealth', async () => {
    const spyOnCheckHealth = jest.spyOn(appService, 'checkHealth');
    spyOnCheckHealth.mockImplementation(() => 'OK');
    await request(app.getHttpServer()).get('/health');
    expect(spyOnCheckHealth).toHaveBeenCalledTimes(1);
  });
});
