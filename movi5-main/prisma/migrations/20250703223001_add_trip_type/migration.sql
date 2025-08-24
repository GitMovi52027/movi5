-- Agregar el tipo ENUM triptype
CREATE TYPE "TripType" AS ENUM ('BUS', 'BUS_BOAT', 'BOAT');

-- Agregar la columna tripType a la tabla Route
ALTER TABLE "Route" ADD COLUMN     "tripType" "TripType" NOT NULL DEFAULT 'BUS';

-- Eliminar el valor por defecto después de la migración
ALTER TABLE "Route" ALTER COLUMN "tripType" DROP DEFAULT; 