/*
  Warnings:

  - You are about to alter the column `busPrice` on the `Route` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Integer`.
  - You are about to alter the column `boatPrice` on the `Route` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Integer`.
  - Added the required column `endTime` to the `Route` table without a default value. This is not possible if the table is not empty.
  - Added the required column `frequency` to the `Route` table without a default value. This is not possible if the table is not empty.
  - Added the required column `startTime` to the `Route` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Route" ADD COLUMN     "endTime" TEXT NOT NULL DEFAULT '18:00',
ADD COLUMN     "frequency" TEXT NOT NULL DEFAULT '1 hora',
ADD COLUMN     "operatingDays" TEXT[] DEFAULT ARRAY['lunes', 'martes', 'miércoles', 'jueves', 'viernes']::TEXT[],
ADD COLUMN     "startTime" TEXT NOT NULL DEFAULT '08:00',
ALTER COLUMN "busPrice" DROP NOT NULL,
ALTER COLUMN "busPrice" SET DATA TYPE INTEGER,
ALTER COLUMN "boatPrice" DROP NOT NULL,
ALTER COLUMN "boatPrice" SET DATA TYPE INTEGER;

-- Actualizar los datos existentes que tienen busPrice = 0 para que sea NULL
UPDATE "Route" SET "busPrice" = NULL WHERE "busPrice" = 0;

-- Actualizar los datos existentes que tienen boatPrice = 0 para que sea NULL
UPDATE "Route" SET "boatPrice" = NULL WHERE "boatPrice" = 0;

-- Eliminar los valores por defecto después de la migración
ALTER TABLE "Route" 
ALTER COLUMN "endTime" DROP DEFAULT,
ALTER COLUMN "frequency" DROP DEFAULT,
ALTER COLUMN "operatingDays" DROP DEFAULT,
ALTER COLUMN "startTime" DROP DEFAULT;
