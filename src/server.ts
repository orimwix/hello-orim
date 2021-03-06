import {Router} from 'express';
import * as wixRenderer from 'wix-renderer';
import * as wixRunMode from 'wix-run-mode';
import * as wixExpressRenderingModel from 'wix-express-rendering-model';
import * as wixExpressCsrf from 'wix-express-csrf';
import * as wixExpressRequireHttps from 'wix-express-require-https';

module.exports = (app: Router, context) => {
  const config = context.config.load('ztp2');

  app.use(wixExpressCsrf());
  app.use(wixExpressRequireHttps);

  app.get('/', wrapAsync(async (req, res) => {
    const templatePath = './src/index.ejs';
    const data = {title: 'Wix Full Stack Project Boilerplate'};

    const renderModel = await wixExpressRenderingModel.generate(req, config);
    const html = await wixRenderer.render(templatePath, renderModel, data, wixRunMode.isProduction());

    res.send(html);
  }));

  return app;
};

function wrapAsync(asyncFn) {
  return (req, res, next) => asyncFn(req, res, next).catch(next);
}
