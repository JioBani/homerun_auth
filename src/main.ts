import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as admin from 'firebase-admin';
import * as serviceAccount from 'homerun-3e122-firebase-adminsdk-up403-3442c4fda6.json';

async function bootstrap() {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount as admin.ServiceAccount)
  });

  const app = await NestFactory.create(AppModule);
  await app.listen(3000);
}
bootstrap();
