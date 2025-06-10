# Theo Afrique website

This is the source code for the congolese clothing brand.

## Getting Started
2. Copy `.env.example` and rename to `.env` and add your keys found in the dashboard.

```
    mv .env.example .env
```

3. Run `pnpm install` or `npm install` to install dependencies
```
 pnpm install
```
<!-- 4. Once installed, ./start-database.sh will start the database -->
<!-- > !NOTE: -->
<!-- > You should have docker installed. -->
<!-- ``` -->
<!-- ./start-database.sh -->
<!-- ``` -->

5. Initialize the prisma database:
```
pnpm db:push
```

6. Start the server
```
pnpm dev
```
