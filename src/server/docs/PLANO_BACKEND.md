### Plano de Backend — API TupperCash (v1)

Este documento descreve o plano de endpoints e a estrutura de pastas de um novo projeto de API backend, com foco na gestão de usuários, clientes, transações e relatórios. O projeto nasceu a partir de uma implementação que fiz por curiosidade, inspirada em um contexto real de empresa. Agora, a proposta é reconstruí-lo de forma mais organizada e bem estruturada, aplicando boas práticas e consolidando conhecimentos.

Para manter o aprendizado ativo, a ideia é desenvolver com o mínimo possível de auxílio de ferramentas de geração de código. Vou priorizar pesquisa e resolução de problemas com fontes tradicionais, como Google e Stack Overflow, e usar IA apenas pontualmente para entender conceitos, validar decisões e conferir práticas recomendadas.

## Visão Geral
- Objetivo: fornecer uma API REST segura, documentada e com paginação/filtragem para operações de clientes, transações e usuários.
- Versão: `v1` (prefixo em todas as rotas)
- Autenticação: JWT (Bearer) com controle de roles (`user`, `admin`).
- Padrões: respostas JSON, erros padronizados, paginação consistente, OpenAPI (Swagger) em `/docs`.

## Convenções
- Content-Type: `application/json` em requisições/respostas.
- Erros: `{ error: { code, message, details? } }` com HTTP adequado (400/401/403/404/409/422/500).
- Paginação: `page`, `pageSize`, `orderBy`, `orderDir` + `total`, `totalPages` no payload.
- Filtros: strings parciais usando `busca` e filtros específicos por campo.
- Nomes: JSON em `camelCase`; banco em `snake_case`.

## Endpoints (v1)

### Auth
- POST `/v1/auth/login` — autentica por `login` e `senha`; retorna JWT + usuário.
- POST `/v1/auth/refresh` — emite novo token a partir de refresh token (opcional).
- POST `/v1/auth/logout` — invalida refresh token (opcional).
- GET `/v1/auth/me` — retorna perfil do usuário corrente.

### Usuários (admin)
- GET `/v1/usuarios` — lista usuários.
- GET `/v1/usuarios/:id` — detalhe.
- POST `/v1/usuarios` — cria (`nome`, `login`, `senha`, `role`).
- PATCH `/v1/usuarios/:id` — atualiza `nome`, `login`, `role` (protege último admin).
- PATCH `/v1/usuarios/:id/senha` — troca senha (self ou admin).
- DELETE `/v1/usuarios/:id` — exclui (bloqueia último admin e quem tem transações).

### Clientes
- GET `/v1/clientes` — lista completa (uso leve).
- GET `/v1/clientes/paged` — pagina/filtra (`page`, `pageSize`, `busca`, `codigo`, `orderBy`, `orderDir`).
- GET `/v1/clientes/:id` — detalhe.
- POST `/v1/clientes` — cria (`nome`, `codigo`, `cpf?`, `telefone?`, `email?`, `endereco?`).
- PUT/PATCH `/v1/clientes/:id` — atualiza os campos acima.
- DELETE `/v1/clientes/:id` — exclui (bloqueia se houver transações associadas).

### Transações
- GET `/v1/transacoes` — lista completa (uso leve).
- GET `/v1/transacoes/paged` — pagina/filtra (`dataInicio`, `dataFim`, `status`, `tipoPagamento`, `codigoCliente`, `busca`, `exportado`, `page`, `pageSize`).
- GET `/v1/transacoes/:id` — detalhe.
- POST `/v1/transacoes` — cria transação (campos financeiros e relacionamentos).
- PUT/PATCH `/v1/transacoes/:id` — atualiza transação.
- DELETE `/v1/transacoes/:id` — exclui transação.
- POST `/v1/transacoes/bulk` — insere em lote.
- POST `/v1/transacoes/exportacao/marcar` — marca IDs como `exportado = true` e `status = 'Baixado'` quando elegíveis.
- POST `/v1/transacoes/exportacao/reverter` — reverte para `exportado = false` e `status = 'Aprovado'` quando aplicável.
- GET `/v1/transacoes/nao-exportadas` — lista elegíveis para exportação.

### Relatórios
- GET `/v1/relatorios/transacoes` — filtra/pagina como transações e agrega dados (opcional: somas por período). 
- GET `/v1/relatorios/clientes` — métricas por clientes (opcional: total por cliente). 

### Utilidades
- GET `/v1/health` — healthcheck simples (`status: 'ok'`).
- GET `/v1/docs` — UI do Swagger (OpenAPI).

## Estrutura de Pastas (projeto novo)

### JavaScript (Node.js + Express/Fastify)
```
backend/
  src/
    app.js                 # bootstrap do servidor e middlewares
    server/
      index.js             # instancia servidor e registra rotas
      routes/
        auth.routes.js
        usuarios.routes.js
        clientes.routes.js
        transacoes.routes.js
        relatorios.routes.js
      controllers/
        auth.controller.js
        usuarios.controller.js
        clientes.controller.js
        transacoes.controller.js
        relatorios.controller.js
      middlewares/
        auth.js            # JWT, roles
        errorHandler.js    # tratamento global de erros
        validate.js        # validação (celebrate/joi/zod)
        rateLimit.js       # rate limiting
      services/
        auth.service.js
        usuarios.service.js
        clientes.service.js
        transacoes.service.js
        relatorios.service.js
      repositories/
        usuarios.repository.js
        clientes.repository.js
        transacoes.repository.js
      models/
        usuario.model.js   # esquemas/db (Prisma/Knex/SQL)
        cliente.model.js
        transacao.model.js
      config/
        env.js             # carrega .env e valida
        db.js              # conexão e pool
        logger.js          # pino/winston
        security.js        # CORS, Helmet
      utils/
        formatters.js
        validators.js
        pagination.js
      docs/
        openapi.yaml       # especificação Swagger/OpenAPI
    tests/
      unit/
      integration/
      fixtures/
    scripts/
      migrate.js
      seed.js
  .env.example
  package.json
  README.md
  Dockerfile
  docker-compose.yml       # opcional (db local)
```

### TypeScript (se preferir)
- Mesma estrutura, trocando extensões `.js` por `.ts` e adicionando `tsconfig.json`.

## Padrões de Rotas e Segurança
- Todas as rotas (exceto `/auth/login`, `/health`, `/docs`) exigem `Authorization: Bearer <token>`.
- `admin` é obrigatório para criar/excluir usuários e algumas operações sensíveis.
- Validação de entrada centralizada no middleware `validate`.

## Paginação e Respostas
- Padrão de resposta paginada:
```json
{
  "data": [{ /* itens */ }],
  "pagination": {
    "page": 1,
    "pageSize": 20,
    "total": 123,
    "totalPages": 7
  }
}
```
- Erro padronizado:
```json
{ "error": { "code": "VALIDATION_ERROR", "message": "Campo X é obrigatório", "details": [{"field":"x","issue":"required"}] } }
```

## Documentação
- Manter OpenAPI em `src/docs/openapi.yaml` e servir UI em `/v1/docs`.
- Publicar exemplos de requisição/resposta e coleções Postman.

## Observações Finais
- Planeje migrações e seeds desde o início (scripts em `src/scripts`).
- Adote logs estruturados (`logger.js`) e healthcheck.
- Inclua CI básico (lint, test) e containers para facilitar deploy.
