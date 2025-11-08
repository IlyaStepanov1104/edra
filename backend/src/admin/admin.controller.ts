import {
    Body,
    Controller,
    Get,
    Post,
    Req,
    Res,
    Param,
    Redirect,
} from '@nestjs/common';
import {Request, Response} from 'express';
import {AdminService} from './admin.service';
import {Public} from "@/auth/public.decorator";

// ====== Проверка сессии ======
function checkSession(req: Request) {
    return req.cookies && req.cookies.admin_session === '1';
}

const head = (title: string) => `<head>
        <title>${title}</title>
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css">
      </head>`;

function menu() {
    return `
    <nav class="mb-4">
      <a href="/admin" class="btn btn-outline-primary btn-sm">Боты</a>
      <a href="/admin/messages" class="btn btn-outline-primary btn-sm">Сообщения</a>
      <a href="/admin/logout" class="btn btn-outline-danger btn-sm">Выйти</a>
    </nav>
  `;
}

@Controller()
export class AdminController {
    constructor(private admin: AdminService) {
    }

    // ====== Страница логина ======
    @Public()
    @Get('login')
    loginPage(@Res() res: Response) {
        return res.send(`
      <html>
      ${head('Login')}
      <body class="p-4">
        <h3>Админ-панель</h3>
        <form method="post" action="/admin/login" class="mt-3" style="max-width:300px;">
          <input name="user" class="form-control mb-2" placeholder="Логин" />
          <input type="password" name="pass" class="form-control mb-2" placeholder="Пароль" />
          <button class="btn btn-primary w-100">Войти</button>
        </form>
      </body>
      </html>
    `);
    }

    @Public()
    @Post('login')
    login(@Body() body, @Res() res: Response) {
        const USER = process.env.ADMIN_USER || 'admin';
        const PASS = process.env.ADMIN_PASS || 'password123';

        if (body.user === USER && body.pass === PASS) {
            res.cookie('admin_session', '1', {httpOnly: true});
            return res.redirect('/admin');
        }

        return res.send(`
      <html>
      ${head('Login')}
      <body class="p-4">
        <h3>Админ-панель</h3>
<div class="alert alert-danger" role="alert">
  Неверный логин или пароль!
</div>
        <form method="post" action="/admin/login" class="mt-3" style="max-width:300px;">
          <input name="user" class="form-control mb-2" placeholder="Логин" />
          <input type="password" name="pass" class="form-control mb-2" placeholder="Пароль" />
          <button class="btn btn-primary w-100">Войти</button>
        </form>
      </body>
      </html>
    `);
    }

    // ====== Выход ======
    @Public()
    @Get('logout')
    logout(@Res() res: Response) {
        res.clearCookie('admin_session');
        res.redirect('/admin/login');
    }

    // ====== Главная ======
    @Public()
    @Get()
    async botsPage(@Req() req: Request, @Res() res: Response) {
        if (!checkSession(req)) return res.redirect('/admin/login');

        const bots = await this.admin.getBots();

        return res.send(`
      <html>
      ${head('Bots')}
      <body class="p-4">
        ${menu()}
        <h2>Bots</h2>
        <a href="/admin/bot/create" class="btn btn-primary mb-3">+ Создать бота</a>
        <table class="table table-bordered">
          <tr><th>ID</th><th>Имя</th><th>Модуль</th><th>Описание</th><th>Промпт</th><th>Действия</th></tr>
          ${bots
            .map(
                (b) => `
              <tr>
                <td>${b._id}</td>
                <td>${b.name}</td>
                <td>${b.module}</td>
                <td>${b.description}</td>
                <td>${b.prompt}</td>
                <td>
                  <a class="btn btn-sm btn-warning" href="/admin/bot/${b._id}">Редактировать</a>
                  <a class="btn btn-sm btn-info" href="/admin/messages?bot=${b._id}">Сообщения</a>
                  <a class="btn btn-sm btn-danger" href="/admin/bot/${b._id}/delete">Удалить</a>
                </td>
              </tr>
            `
            )
            .join('')}
        </table>
      </body>
      </html>
    `);
    }

    // ====== Создание ======
    @Public()
    @Get('bot/create')
    async createPage(@Req() req: Request, @Res() res: Response) {
        if (!checkSession(req)) return res.redirect('/admin/login');

        return res.send(`
      <html>
      ${head('Bot')}
      <body class="p-4">
      ${menu()}
      <h2>Создать бота</h2>
      <form method="post" action="/admin/bot/create">
      <input type="text" class="form-control mb-2" required name="_id" placeholder="ID">
        <input name="name" class="form-control mb-2" placeholder="Имя" />
        <textarea name="description" class="form-control mb-2" placeholder="Описание"></textarea>
        <textarea name="prompt" class="form-control mb-2" placeholder="Prompt"></textarea>
        <input name="module" class="form-control mb-2" placeholder="Модуль" />
        <button class="btn btn-success">Создать</button>
      </form>
      </body></html>
    `);
    }

    @Public()
    @Post('bot/create')
    @Redirect('/admin')
    async createBot(@Body() body) {
        await this.admin.createBot(body);
    }

    // ====== Редактирование ======
    @Public()
    @Get('bot/:id')
    async editPage(@Param('id') id: string, @Req() req: Request, @Res() res: Response) {
        if (!checkSession(req)) return res.redirect('/admin/login');

        const bot = await this.admin.getBot(id);
        if (!bot) return res.status(404).send('Not found');

        return res.send(`
      <html>${head('Bot')}<body class="p-4">
      ${menu()}
      <h2>Редактировать бота</h2>
      <form method="post" action="/admin/bot/${id}">
        <input name="name" value="${bot.name}" class="form-control mb-2" />
        <textarea name="description" class="form-control mb-2">${bot.description}</textarea>
        <textarea name="prompt" class="form-control mb-2">${bot.prompt}</textarea>
        <input name="module" value="${bot.module}" class="form-control mb-2" />
        <button class="btn btn-success">Сохранить</button>
      </form>
      </body></html>
    `);
    }

    @Public()
    @Post('bot/:id')
    @Redirect('/admin')
    async updateBot(@Param('id') id: string, @Body() body) {
        await this.admin.updateBot(id, body);
    }

    // ====== Удаление ======
    @Public()
    @Get('bot/:id/delete')
    @Redirect('/admin')
    async deleteBot(@Param('id') id: string) {
        await this.admin.deleteBot(id);
    }

    // ====== Сообщения ======
    @Public()
    @Get('messages')
    async messagesPage(@Req() req: Request, @Res() res: Response) {
        if (!checkSession(req)) return res.redirect('/admin/login');

        const { user, bot, from, to } = req.query;

        const messages = await this.admin.getMessages({
            user: user as string,
            bot: bot as string,
            from: from ? new Date(from as string) : undefined,
            to: to ? new Date(to as string) : undefined,
        });

        const bots = await this.admin.getBots();

        return res.send(`
<html>
${head('Messages')}
<body class="p-4">
${menu()}
<h2>Сообщения</h2>

<form method="get" class="mb-3" style="max-width:600px;">
  <input name="user" value="${user ?? ''}" class="form-control mb-1" placeholder="Логин пользователя" />

  <select name="bot" class="form-control mb-1">
    <option value="">Все боты</option>
    ${bots.map(b => `<option value="${b._id}" ${bot == b._id ? 'selected' : ''}>${b.name}</option>`).join('')}
  </select>

  <input type="date" name="from" value="${from ?? ''}" class="form-control mb-1" />
  <input type="date" name="to" value="${to ?? ''}" class="form-control mb-1" />
  <button class="btn btn-primary w-100">Фильтровать</button>
</form>

<table class="table table-striped">
  <tr><th>Время</th><th>Роль</th><th>Пользователь</th><th>Бот</th><th>Текст</th></tr>
  ${messages.map(m => `
    <tr>
      <td>${new Date(m.createdAt).toLocaleString()}</td>
      <td>${m.role}</td>
      <td>${m.userId}</td>
      <td>${m.botId}</td>
      <td>${m.content}</td>
    </tr>
  `).join('')}
</table>
</body></html>
`);
    }
}
