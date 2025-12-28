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

function parseCookies(cookieHeader?: string): Record<string, string> {
    if (!cookieHeader) return {};

    return Object.fromEntries(
        cookieHeader.split(';').map(cookie => {
            const [key, ...rest] = cookie.trim().split('=');
            return [key, decodeURIComponent(rest.join('='))];
        })
    );
}

// ====== Проверка сессии ======
function checkSession(req: Request): boolean {
    const cookies = parseCookies(req.headers.cookie);
    return cookies.admin_session === '1';
}

const head = (title: string) => `<head>
        <title>${title}</title>
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css">
      </head>`;

function menu() {
    return `
    <nav class="mb-4">
      <a href="/admin" class="btn btn-outline-primary btn-sm">Bots</a>
      <a href="/admin/messages" class="btn btn-outline-primary btn-sm">Messages</a>
      <a href="/admin/logout" class="btn btn-outline-danger btn-sm">Logout</a>
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
    loginPage(@Req() req: Request, @Res() res: Response) {
        if (checkSession(req)) return res.redirect('/admin');
        return res.send(`
      <html>
      ${head('Login')}
      <body class="p-4">
        <h3>Admin panel</h3>
        <form method="post" action="/admin/login" class="mt-3" style="max-width:300px;">
          <input name="user" class="form-control mb-2" placeholder="Login" />
          <input type="password" name="pass" class="form-control mb-2" placeholder="Password" />
          <button class="btn btn-primary w-100">Log In</button>
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
        <h3>Admin Panel</h3>
<div class="alert alert-danger" role="alert">
  Invalid username or password!
</div>
        <form method="post" action="/admin/login" class="mt-3" style="max-width:300px;">
          <input name="user" class="form-control mb-2" placeholder="Login" />
          <input type="password" name="pass" class="form-control mb-2" placeholder="Password" />
          <button class="btn btn-primary w-100">Log In</button>
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
        <a href="/admin/bot/create" class="btn btn-primary mb-3">+ Create bot</a>
        <table class="table table-bordered">
          <tr><th>ID</th><th>Name</th><th>Module</th><th>Description</th><th>Prompt</th><th>Actions</th></tr>
          ${bots
            .map(
                (b) => `
              <tr>
                <td>${b._id}</td>
                <td>${b.name}</td>
                <td>${b.module}</td>
                <td>${b.description}</td>
                <td style="white-space: pre-wrap">${b.prompt}</td>
                <td>
                  <a class="btn btn-sm btn-warning" href="/admin/bot/${b._id}">Edit</a>
                  <a class="btn btn-sm btn-info" href="/admin/messages?bot=${b._id}">Messages</a>
                  <a class="btn btn-sm btn-danger" href="/admin/bot/${b._id}/delete">Delete</a>
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
      <h2>Create bot</h2>
      <form method="post" action="/admin/bot/create">
      <input type="text" class="form-control mb-2" required name="_id" placeholder="ID">
        <input name="name" class="form-control mb-2" placeholder="Name" />
        <textarea name="description" class="form-control mb-2" placeholder="Description"></textarea>
        <textarea name="prompt" class="form-control mb-2" placeholder="Prompt"></textarea>
        <input name="module" class="form-control mb-2" placeholder="Module" />
        <button class="btn btn-success">Create</button>
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
      <h2>Edit bot</h2>
      <form method="post" action="/admin/bot/${id}">
        <input name="name" value="${bot.name}" class="form-control mb-2" placeholder="Name" />
        <textarea name="description" class="form-control mb-2" placeholder="Description">${bot.description}</textarea>
        <textarea name="prompt" class="form-control mb-2" placeholder="Prompt">${bot.prompt}</textarea>
        <input name="module" value="${bot.module}" class="form-control mb-2" placeholder="Module" />
        <button class="btn btn-success">Save</button>
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

        const {user, bot, from, to} = req.query;

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
<h2>Messages</h2>

<form method="get" class="mb-3" style="max-width:600px;">
  <input name="user" value="${user ?? ''}" class="form-control mb-1" placeholder="User ID" />

  <select name="bot" class="form-control mb-1">
    <option value="">All bots</option>
    ${bots.map(b => `<option value="${b._id}" ${bot == b._id ? 'selected' : ''}>${b.name}</option>`).join('')}
  </select>

  <input type="date" name="from" value="${from ?? ''}" class="form-control mb-1" />
  <input type="date" name="to" value="${to ?? ''}" class="form-control mb-1" />
  <button class="btn btn-primary w-100">Filter</button>
</form>

<table class="table table-striped">
  <tr><th>Time</th><th>Role</th><th>UserID</th><th>BotID</th><th>Text</th></tr>
  ${messages.map(m => `
    <tr>
      <td>${new Date(m.createdAt).toLocaleString()}</td>
      <td>${m.role}</td>
      <td>${m.userId}</td>
      <td>${m.botId}</td>
      <td style="white-space: pre-wrap">${m.content}</td>
    </tr>
  `).join('')}
</table>
</body></html>
`);
    }
}
