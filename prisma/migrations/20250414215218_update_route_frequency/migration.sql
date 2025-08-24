/*
  Warnings:

  - You are about to drop the column `frequency` on the `Route` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "FrequencyType" AS ENUM ('INTERVAL', 'SPECIFIC');

-- Primero, agregamos los nuevos campos con valores por defecto temporales
ALTER TABLE "Route" 
ADD COLUMN "frequencyType" "FrequencyType",
ADD COLUMN "intervalMinutes" INTEGER,
ADD COLUMN "specificTimes" TEXT[];

-- Actualizar los datos existentes basados en el campo 'frequency'
-- Las que tienen formato "XX min" o "X hora(s)" se convierten a INTERVAL
UPDATE "Route" 
SET 
  "frequencyType" = 'INTERVAL',
  "intervalMinutes" = 
    CASE 
      WHEN "frequency" LIKE '%min%' THEN NULLIF(regexp_replace("frequency", '[^0-9]', '', 'g'), '')::INTEGER
      WHEN "frequency" LIKE '%hora%' THEN NULLIF(regexp_replace("frequency", '[^0-9]', '', 'g'), '')::INTEGER * 60
      ELSE 30 -- valor por defecto
    END
WHERE 
  "frequency" LIKE '%min%' OR "frequency" LIKE '%hora%';

-- Las que tienen formato "Salidas: XX:XX, YY:YY" se convierten a SPECIFIC
UPDATE "Route" 
SET 
  "frequencyType" = 'SPECIFIC',
  "specificTimes" = 
    string_to_array(
      regexp_replace(
        regexp_replace("frequency", 'Salidas: ', ''),
        '[^0-9:,]', '', 'g'
      ),
      ','
    )
WHERE 
  "frequency" LIKE 'Salidas:%';

-- Para cualquier otra frecuencia que no hayamos manejado, establecemos un valor por defecto
UPDATE "Route" 
SET 
  "frequencyType" = 'INTERVAL',
  "intervalMinutes" = 30
WHERE 
  "frequencyType" IS NULL;

-- Establecer NOT NULL constraint después de la migración de datos
ALTER TABLE "Route" 
ALTER COLUMN "frequencyType" SET NOT NULL;

-- Finalmente, eliminamos la columna frequency
ALTER TABLE "Route" DROP COLUMN "frequency";
