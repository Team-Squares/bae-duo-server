import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import connection from './db';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(3000);

  connection.query('SELECT * FROM `funding`', function (err, results, fields) {
    console.log(results);
  });
}
bootstrap();
