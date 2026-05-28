# API — Architecture & Conventions

## Runtime

Default to Bun instead of Node.js.

- `bun <file>` not `node` / `ts-node`
- `bun test` not jest / vitest
- `bun install` not npm / yarn / pnpm
- `bun run <script>` not npm run
- `bunx <pkg>` not npx
- Bun auto-loads `.env` — no dotenv
- `Bun.file` over `node:fs` readFile/writeFile
- `Bun.$\`cmd\`` over execa

This project uses **Express**, not `Bun.serve()`.

---

## Folder Structure

```
api/
├── controllers/        # Parse request, call service, send response
├── services/           # Business logic, validation
├── repositories/       # Prisma queries only
├── routes/
│   └── <feature>/
│       ├── index.ts            # Express Router export
│       └── <feature>.routes.ts # RouteDescriptor array
├── middleware/         # Express middlewares
├── errors/             # AppError subclasses
├── interfaces/         # DTOs and request/response types
├── models/             # Shared model types (RouteDescriptor, AppError base)
├── utils/              # logger, asyncHandler, db health check
├── lib/                # External client setup (supabase)
├── builder/            # Route registration utility
├── types/              # Global TypeScript augmentations
├── generated/          # Prisma generated — never edit manually
├── prisma/             # Schema and migrations
├── prisma.ts           # Prisma client singleton
├── env.ts              # Validated env vars
└── index.ts            # App entry point
```

---

## Architecture Layers

Each feature follows this chain: **route → controller → service → repository**

### Routes (`routes/<feature>/<feature>.routes.ts`)

Return a `RouteDescriptor[]`. Use `asyncHandler` on every handler.

```ts
import type { RouteDescriptor } from "../../models/route.model";
import authMiddleware from "../../middleware/auth.middleware";
import asyncHandler from "../../utils/handler";
import { createPortfolio } from "../../controllers/portfolio.controller";

const PREFIX = "/portfolio";

const portfolioRoutes = (): RouteDescriptor[] => [
    {
        method: "post",
        path: PREFIX,
        middlewares: [authMiddleware],
        handler: asyncHandler(createPortfolio),
    },
];

export default portfolioRoutes;
```

Route index (`routes/<feature>/index.ts`) wires descriptors into an Express router:

```ts
import { Router } from "express";
import { registerRoutes } from "../../builder/route";
import portfolioRoutes from "./portfolio.routes";

const router = Router();
registerRoutes(router, portfolioRoutes());

export default router;
```

### Controllers (`controllers/<feature>.controller.ts`)

Plain async functions. Parse `req`, call service, send response. No business logic.

```ts
import type { Request, Response } from "express";
import { createPortfolioService } from "../services/portfolio.service";

export async function createPortfolio(req: Request, res: Response) {
    const { name, baseCurrency } = req.body;
    const portfolio = await createPortfolioService(req.userId!, name, baseCurrency);
    res.status(201).json(portfolio);
}
```

### Services (`services/<feature>.service.ts`)

Plain async functions. Validation and business logic. Throw typed errors.

```ts
import BadRequestError from "../errors/badrequest.error";
import { createPortfolioRepo } from "../repositories/portfolio.repository";

export async function createPortfolioService(
    userId: string,
    name: string,
    baseCurrency: string,
) {
    if (!name || !baseCurrency) {
        throw new BadRequestError("Name and base currency are required");
    }
    return createPortfolioRepo(userId, { name, baseCurrency });
}
```

### Repositories (`repositories/<feature>.repository.ts`)

Plain async functions. Prisma calls only — no logic.

```ts
import type { Portfolio } from "../generated/prisma/client";
import type { CreatePortfolioDTO } from "../interfaces/portfolio.interface";
import { prisma } from "../prisma";

export async function createPortfolioRepo(
    userId: string,
    data: CreatePortfolioDTO,
): Promise<Portfolio> {
    return prisma.portfolio.create({
        data: { ...data, userId },
    });
}
```

---

## Error Handling

Throw subclasses of `AppError` from services. The global error middleware (`middleware/error.middleware.ts`) catches everything forwarded by `asyncHandler`.

```
errors/
├── badrequest.error.ts    # 400
├── unauthorized.error.ts  # 401
├── forbidden.error.ts     # 403
├── notfound.error.ts      # 404
└── internal.error.ts      # 500
```

Never catch errors in controllers — let them propagate to the middleware.

---

## Interfaces & Types

- DTOs live in `interfaces/<feature>.interface.ts`
- Express augmentations (e.g. `req.userId`) live in `types/`
- Shared models (RouteDescriptor, AppError base) live in `models/`

---

## Code Style

- **Functions, not classes** — no class-based services, repositories, or controllers
- Named exports for functions; default export only for routers and route arrays
- `type` imports for types: `import type { ... }`
- No inline comments unless the behaviour is non-obvious
- No trailing semicolons on type/interface blocks; semicolons on statements
- 4-space indentation

---

## Testing

```ts
import { test, expect } from "bun:test";

test("example", () => {
    expect(1).toBe(1);
});
```
