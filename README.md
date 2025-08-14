# Rentmate Backend

Ez a projekt egy NestJS alapú backend, amely Prisma ORM-et és MinIO-t használ fájlkezeléshez.

## Fejlesztői környezet

- Node.js
- NestJS
- Prisma ORM
- MySQL adatbázis
- MinIO (fájlkezeléshez)

## Prisma használata

### Prisma migráció futtatása

Az adatbázis sémát a `prisma/schema.prisma` fájlban tudod módosítani.  
A módosítások után a migrációt így futtathatod:

```bash
npx prisma migrate dev
```

Ez létrehozza vagy frissíti az adatbázist a séma alapján.

### Prisma entityk generálása

A Prisma TypeScript entityket (modelleket) automatikusan generálja a következő paranccsal:

```bash
npx prisma generate
```

## Hasznos parancsok

- Prisma migráció:  
  `npx prisma migrate dev`
- Prisma entity generálás:  
  `npx prisma generate`
- Backend indítása:  
  `npm
