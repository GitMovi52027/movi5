"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";

// Toast temporal hasta que se implemente el componente
interface ToastProps {
  title: string;
  description: string;
  variant?: string;
}

const toast = (props: ToastProps) => {
  console.log("Toast:", props);
};

// Definición de tipos
interface Ruta {
  id: string;
  origin: string;
  destination: string;
  busPrice: number | null;
  boatPrice: number | null;
  startTime: string;
  endTime: string;
  frequencyType: "INTERVAL" | "SPECIFIC";
  intervalMinutes: number | null;
  specificTimes: string[];
  operatingDays: string[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  tripType: "BUS" | "BUS_BOAT" | "BOAT";
}

interface NuevaRuta {
  origin: string;
  destination: string;
  busPrice: string;
  boatPrice: string;
  startTime: string;
  endTime: string;
  frequencyType: "INTERVAL" | "SPECIFIC";
  intervalMinutes: string;
  specificTimes: string[];
  operatingDays: string[];
  tripType: "BUS" | "BUS_BOAT" | "BOAT";
}

interface DiaSemana {
  id: string;
  label: string;
}

const diasSemana: DiaSemana[] = [
  { id: "lunes", label: "Lunes" },
  { id: "martes", label: "Martes" },
  { id: "miércoles", label: "Miércoles" },
  { id: "jueves", label: "Jueves" },
  { id: "viernes", label: "Viernes" },
  { id: "sábado", label: "Sábado" },
  { id: "domingo", label: "Domingo" },
];

export default function RutasPage() {
  const [rutas, setRutas] = useState<Ruta[]>([]);
  const [cargando, setCargando] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [filtro, setFiltro] = useState("");
  const [ordenarPor, setOrdenarPor] = useState<string>("origin");
  const [ordenAscendente, setOrdenAscendente] = useState(true);
  const [nuevaRuta, setNuevaRuta] = useState<NuevaRuta>({
    origin: "",
    destination: "",
    busPrice: "",
    boatPrice: "",
    startTime: "",
    endTime: "",
    frequencyType: "INTERVAL",
    intervalMinutes: "",
    specificTimes: [],
    operatingDays: [],
    tripType: "BUS",
  });
  const [rutaEnEdicion, setRutaEnEdicion] = useState<Ruta | null>(null);
  const [dialogoAbierto, setDialogoAbierto] = useState(false);
  const [guardando, setGuardando] = useState(false);

  // Cargar rutas
  useEffect(() => {
    const cargarRutas = async () => {
      try {
        setCargando(true);
        const respuesta = await fetch("/api/routes");

        if (!respuesta.ok) {
          throw new Error("Error al cargar las rutas");
        }

        const datos = await respuesta.json();
        setRutas(datos);
      } catch (error) {
        console.error("Error:", error);
        setError(error instanceof Error ? error.message : "Error desconocido");
        toast({
          title: "Error",
          description: "No se pudieron cargar las rutas",
          variant: "destructive",
        });
      } finally {
        setCargando(false);
      }
    };

    cargarRutas();
  }, []);

  const rutasFiltradas = rutas
    .filter((ruta) => {
      if (!filtro) return true;
      const terminoBusqueda = filtro.toLowerCase();
      return (
        ruta.origin.toLowerCase().includes(terminoBusqueda) ||
        ruta.destination.toLowerCase().includes(terminoBusqueda)
      );
    })
    .sort((a, b) => {
      const factor = ordenAscendente ? 1 : -1;

      if (ordenarPor === "busPrice") {
        const costoBusA = a.busPrice || 0;
        const costoBusB = b.busPrice || 0;
        return (costoBusA - costoBusB) * factor;
      } else if (ordenarPor === "boatPrice") {
        const costoLanchaA = a.boatPrice || 0;
        const costoLanchaB = b.boatPrice || 0;
        return (costoLanchaA - costoLanchaB) * factor;
      } else {
        return (
          (a[ordenarPor as keyof Ruta] as string).localeCompare(
            b[ordenarPor as keyof Ruta] as string
          ) * factor
        );
      }
    });

  const handleOrdenar = (campo: string) => {
    if (ordenarPor === campo) {
      setOrdenAscendente(!ordenAscendente);
    } else {
      setOrdenarPor(campo);
      setOrdenAscendente(true);
    }
  };

  const handleCambioEstado = async (id: string) => {
    try {
      const ruta = rutas.find((r) => r.id === id);
      if (!ruta) return;

      const respuesta = await fetch(`/api/routes/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ isActive: !ruta.isActive }),
      });

      if (!respuesta.ok) {
        throw new Error("Error al actualizar el estado de la ruta");
      }

      // Actualiza el estado local
      setRutas(
        rutas.map((r) => {
          if (r.id === id) {
            return {
              ...r,
              isActive: !r.isActive,
            };
          }
          return r;
        })
      );

      toast({
        title: "Éxito",
        description: `Ruta ${
          !ruta.isActive ? "activada" : "desactivada"
        } correctamente`,
      });
    } catch (error) {
      console.error("Error:", error);
      toast({
        title: "Error",
        description: "No se pudo actualizar el estado de la ruta",
        variant: "destructive",
      });
    }
  };

  const handleEditar = (ruta: Ruta) => {
    setRutaEnEdicion(ruta);
    setNuevaRuta({
      origin: ruta.origin,
      destination: ruta.destination,
      busPrice: ruta.busPrice !== null ? ruta.busPrice.toString() : "",
      boatPrice: ruta.boatPrice !== null ? ruta.boatPrice.toString() : "",
      startTime: ruta.startTime,
      endTime: ruta.endTime,
      frequencyType: ruta.frequencyType,
      intervalMinutes:
        ruta.intervalMinutes !== null ? ruta.intervalMinutes.toString() : "",
      specificTimes: ruta.specificTimes || [],
      operatingDays: ruta.operatingDays || [],
      tripType: ruta.tripType,
    });
    setDialogoAbierto(true);
  };

  const handleGuardar = async () => {
    try {
      setGuardando(true);

      const rutaActualizada = {
        origin: nuevaRuta.origin,
        destination: nuevaRuta.destination,
        busPrice: nuevaRuta.busPrice ? parseInt(nuevaRuta.busPrice) : null,
        boatPrice: nuevaRuta.boatPrice ? parseInt(nuevaRuta.boatPrice) : null,
        startTime: nuevaRuta.startTime,
        endTime: nuevaRuta.endTime,
        frequencyType: nuevaRuta.frequencyType,
        intervalMinutes:
          nuevaRuta.frequencyType === "INTERVAL" && nuevaRuta.intervalMinutes
            ? parseInt(nuevaRuta.intervalMinutes)
            : null,
        specificTimes:
          nuevaRuta.frequencyType === "SPECIFIC" ? nuevaRuta.specificTimes : [],
        operatingDays: nuevaRuta.operatingDays,
        tripType: nuevaRuta.tripType,
      };

      let respuesta;

      if (rutaEnEdicion) {
        // Editar ruta existente
        respuesta = await fetch(`/api/routes/${rutaEnEdicion.id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(rutaActualizada),
        });
      } else {
        // Crear nueva ruta
        respuesta = await fetch("/api/routes", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(rutaActualizada),
        });
      }

      if (!respuesta.ok) {
        const errorData = await respuesta.json().catch(() => ({}));
        console.error("Error response:", errorData);
        throw new Error(
          rutaEnEdicion
            ? `Error al actualizar la ruta: ${
                errorData.error || respuesta.statusText
              }`
            : `Error al crear la ruta: ${
                errorData.error || respuesta.statusText
              }`
        );
      }

      const rutaGuardada = await respuesta.json();

      if (rutaEnEdicion) {
        // Actualizar ruta en el estado
        setRutas(
          rutas.map((ruta) => {
            if (ruta.id === rutaEnEdicion.id) {
              return rutaGuardada;
            }
            return ruta;
          })
        );
        toast({
          title: "Éxito",
          description: "Ruta actualizada correctamente",
        });
      } else {
        // Añadir nueva ruta al estado
        setRutas([...rutas, rutaGuardada]);
        toast({
          title: "Éxito",
          description: "Ruta creada correctamente",
        });
      }

      setDialogoAbierto(false);
      setRutaEnEdicion(null);
      setNuevaRuta({
        origin: "",
        destination: "",
        busPrice: "",
        boatPrice: "",
        startTime: "",
        endTime: "",
        frequencyType: "INTERVAL",
        intervalMinutes: "",
        specificTimes: [],
        operatingDays: [],
        tripType: "BUS" as "BUS" | "BUS_BOAT" | "BOAT",
      });
    } catch (error) {
      console.error("Error:", error);
      toast({
        title: "Error",
        description: rutaEnEdicion
          ? "No se pudo actualizar la ruta"
          : "No se pudo crear la ruta",
        variant: "destructive",
      });
    } finally {
      setGuardando(false);
    }
  };

  const handleInputChange = (campo: string, valor: string) => {
    setNuevaRuta({
      ...nuevaRuta,
      [campo]: valor,
    });
  };

  const handleDiaSemanaChange = (dia: string) => {
    if (nuevaRuta.operatingDays.includes(dia)) {
      setNuevaRuta({
        ...nuevaRuta,
        operatingDays: nuevaRuta.operatingDays.filter((d) => d !== dia),
      });
    } else {
      setNuevaRuta({
        ...nuevaRuta,
        operatingDays: [...nuevaRuta.operatingDays, dia],
      });
    }
  };

  const formatoDiaSemana = (dias: string[] | undefined) => {
    if (!dias || dias.length === 0) return "Ninguno";
    if (dias.length === 7) return "Todos los días";

    return dias
      .map((dia) => diasSemana.find((d) => d.id === dia)?.label.substring(0, 3))
      .join(", ");
  };

  const formatoFrecuencia = (ruta: Ruta) => {
    if (ruta.frequencyType === "INTERVAL" && ruta.intervalMinutes) {
      if (ruta.intervalMinutes >= 60) {
        const horas = Math.floor(ruta.intervalMinutes / 60);
        return horas === 1 ? "1 hora" : `${horas} horas`;
      } else {
        return `${ruta.intervalMinutes} min`;
      }
    } else if (
      ruta.frequencyType === "SPECIFIC" &&
      ruta.specificTimes?.length
    ) {
      return `Salidas: ${ruta.specificTimes.join(", ")}`;
    }
    return "-";
  };

  if (cargando) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-50 text-red-800 rounded-lg">
        <p>Error al cargar las rutas: {error}</p>
        <Button onClick={() => window.location.reload()} className="mt-2">
          Reintentar
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">
          Gestión de Rutas y Precios
        </h1>
        <Button
          onClick={() => {
            setRutaEnEdicion(null);
            setNuevaRuta({
              origin: "",
              destination: "",
              busPrice: "",
              boatPrice: "",
              startTime: "",
              endTime: "",
              frequencyType: "INTERVAL",
              intervalMinutes: "",
              specificTimes: [],
              operatingDays: [],
              tripType: "BUS" as "BUS" | "BUS_BOAT" | "BOAT",
            });
            setDialogoAbierto(true);
          }}
          className="bg-teal-500 hover:bg-teal-600"
        >
          <PlusIcon className="mr-2 h-4 w-4" />
          Nueva Ruta
        </Button>
      </div>

      {/* Filtros y búsqueda */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative sm:w-1/2">
          <SearchIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            type="text"
            placeholder="Buscar por origen o destino..."
            className="pl-8"
            value={filtro}
            onChange={(e) => setFiltro(e.target.value)}
          />
        </div>
        <div className="sm:w-1/2 grid grid-cols-2 gap-4">
          <Select value={ordenarPor} onValueChange={setOrdenarPor}>
            <SelectTrigger>
              <SelectValue placeholder="Ordenar por" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="origin">Origen</SelectItem>
              <SelectItem value="destination">Destino</SelectItem>
              <SelectItem value="busPrice">Costo Bus</SelectItem>
              <SelectItem value="boatPrice">Costo Lancha</SelectItem>
            </SelectContent>
          </Select>
          <Button
            variant="outline"
            onClick={() => setOrdenAscendente(!ordenAscendente)}
          >
            {ordenAscendente ? (
              <ArrowUpIcon className="mr-2 h-4 w-4" />
            ) : (
              <ArrowDownIcon className="mr-2 h-4 w-4" />
            )}
            {ordenAscendente ? "Ascendente" : "Descendente"}
          </Button>
        </div>
      </div>

      {/* Tabla de rutas */}
      <div className="bg-white rounded-lg shadow overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead
                className="cursor-pointer"
                onClick={() => handleOrdenar("origin")}
              >
                Origen
                {ordenarPor === "origin" &&
                  (ordenAscendente ? (
                    <ArrowUpIcon className="inline ml-1 h-4 w-4" />
                  ) : (
                    <ArrowDownIcon className="inline ml-1 h-4 w-4" />
                  ))}
              </TableHead>
              <TableHead
                className="cursor-pointer"
                onClick={() => handleOrdenar("destination")}
              >
                Destino
                {ordenarPor === "destination" &&
                  (ordenAscendente ? (
                    <ArrowUpIcon className="inline ml-1 h-4 w-4" />
                  ) : (
                    <ArrowDownIcon className="inline ml-1 h-4 w-4" />
                  ))}
              </TableHead>
              <TableHead
                className="text-right cursor-pointer"
                onClick={() => handleOrdenar("busPrice")}
              >
                Costo Bus
                {ordenarPor === "busPrice" &&
                  (ordenAscendente ? (
                    <ArrowUpIcon className="inline ml-1 h-4 w-4" />
                  ) : (
                    <ArrowDownIcon className="inline ml-1 h-4 w-4" />
                  ))}
              </TableHead>
              <TableHead
                className="text-right cursor-pointer"
                onClick={() => handleOrdenar("boatPrice")}
              >
                Costo Lancha
                {ordenarPor === "boatPrice" &&
                  (ordenAscendente ? (
                    <ArrowUpIcon className="inline ml-1 h-4 w-4" />
                  ) : (
                    <ArrowDownIcon className="inline ml-1 h-4 w-4" />
                  ))}
              </TableHead>
              <TableHead>Tipo de Viaje</TableHead>
              <TableHead>Horario</TableHead>
              <TableHead>Frecuencia</TableHead>
              <TableHead>Días</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead>Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rutasFiltradas.length === 0 ? (
              <TableRow>
                <TableCell colSpan={10} className="text-center py-4">
                  {filtro
                    ? "No se encontraron rutas que coincidan con tu búsqueda"
                    : "No hay rutas disponibles"}
                </TableCell>
              </TableRow>
            ) : (
              rutasFiltradas.map((ruta) => (
                <TableRow key={ruta.id}>
                  <TableCell>{ruta.origin}</TableCell>
                  <TableCell>{ruta.destination}</TableCell>
                  <TableCell className="text-right">
                    {ruta.busPrice
                      ? `$${ruta.busPrice.toLocaleString("es-CO")} COP`
                      : "-"}
                  </TableCell>
                  <TableCell className="text-right">
                    {ruta.boatPrice
                      ? `$${ruta.boatPrice.toLocaleString("es-CO")} COP`
                      : "-"}
                  </TableCell>
                  <TableCell>
                    {ruta.tripType === "BUS"
                      ? "Solo Bus"
                      : ruta.tripType === "BUS_BOAT"
                      ? "Bus + Lancha"
                      : ruta.tripType === "BOAT"
                      ? "Solo Lancha"
                      : "-"}
                  </TableCell>
                  <TableCell>
                    {ruta.startTime} - {ruta.endTime}
                  </TableCell>
                  <TableCell>{formatoFrecuencia(ruta)}</TableCell>
                  <TableCell>{formatoDiaSemana(ruta.operatingDays)}</TableCell>
                  <TableCell>
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        ruta.isActive
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {ruta.isActive ? "Activa" : "Inactiva"}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEditar(ruta)}
                      >
                        <PencilIcon className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleCambioEstado(ruta.id)}
                      >
                        {ruta.isActive ? (
                          <EyeOffIcon className="h-4 w-4" />
                        ) : (
                          <EyeIcon className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Diálogo para crear/editar ruta */}
      <Dialog open={dialogoAbierto} onOpenChange={setDialogoAbierto}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {rutaEnEdicion ? "Editar Ruta" : "Crear Nueva Ruta"}
            </DialogTitle>
            <DialogDescription>
              Completa la información para{" "}
              {rutaEnEdicion ? "actualizar" : "crear"} la ruta
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="origin">Origen</Label>
                <Input
                  id="origin"
                  value={nuevaRuta.origin}
                  onChange={(e) => handleInputChange("origin", e.target.value)}
                />
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="destination">Destino</Label>
                <Input
                  id="destination"
                  value={nuevaRuta.destination}
                  onChange={(e) =>
                    handleInputChange("destination", e.target.value)
                  }
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="busPrice">Costo Bus (COP)</Label>
                <Input
                  id="busPrice"
                  type="number"
                  placeholder="Opcional"
                  value={nuevaRuta.busPrice}
                  onChange={(e) =>
                    handleInputChange("busPrice", e.target.value)
                  }
                />
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="boatPrice">Costo Lancha (COP)</Label>
                <Input
                  id="boatPrice"
                  type="number"
                  placeholder="Opcional"
                  value={nuevaRuta.boatPrice}
                  onChange={(e) =>
                    handleInputChange("boatPrice", e.target.value)
                  }
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="startTime">Hora de Inicio</Label>
                <Input
                  id="startTime"
                  type="time"
                  value={nuevaRuta.startTime}
                  onChange={(e) =>
                    handleInputChange("startTime", e.target.value)
                  }
                />
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="endTime">Hora Final</Label>
                <Input
                  id="endTime"
                  type="time"
                  value={nuevaRuta.endTime}
                  onChange={(e) => handleInputChange("endTime", e.target.value)}
                />
              </div>
            </div>
            <div className="flex flex-col space-y-3">
              <Label htmlFor="frequencyType">Tipo de Frecuencia</Label>
              <Select
                value={nuevaRuta.frequencyType}
                onValueChange={(valor) =>
                  handleInputChange("frequencyType", valor)
                }
              >
                <SelectTrigger id="frequencyType">
                  <SelectValue placeholder="Seleccione el tipo de frecuencia" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="INTERVAL">
                    Por intervalos de tiempo
                  </SelectItem>
                  <SelectItem value="SPECIFIC">Horarios específicos</SelectItem>
                </SelectContent>
              </Select>

              {nuevaRuta.frequencyType === "INTERVAL" && (
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="intervalMinutes">Intervalo (minutos)</Label>
                  <Input
                    id="intervalMinutes"
                    type="number"
                    placeholder="Ej: 30"
                    value={nuevaRuta.intervalMinutes}
                    onChange={(e) =>
                      handleInputChange("intervalMinutes", e.target.value)
                    }
                  />
                </div>
              )}

              {nuevaRuta.frequencyType === "SPECIFIC" && (
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="specificTimes">Horarios Específicos</Label>
                  <div className="flex flex-wrap gap-2">
                    {nuevaRuta.specificTimes.map((horario, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-1 bg-gray-100 p-1 rounded"
                      >
                        <span>{horario}</span>
                        <button
                          type="button"
                          className="text-red-500 hover:text-red-700"
                          onClick={() => {
                            const nuevosHorarios = [...nuevaRuta.specificTimes];
                            nuevosHorarios.splice(index, 1);
                            setNuevaRuta({
                              ...nuevaRuta,
                              specificTimes: nuevosHorarios,
                            });
                          }}
                        >
                          &times;
                        </button>
                      </div>
                    ))}
                    <div className="flex items-center gap-1">
                      <Input
                        id="nuevoHorario"
                        type="time"
                        className="w-24"
                        onChange={(e) => {
                          if (e.target.value) {
                            const nuevoHorario = e.target.value;
                            if (
                              !nuevaRuta.specificTimes.includes(nuevoHorario)
                            ) {
                              setNuevaRuta({
                                ...nuevaRuta,
                                specificTimes: [
                                  ...nuevaRuta.specificTimes,
                                  nuevoHorario,
                                ].sort(),
                              });
                              e.target.value = "";
                            }
                          }
                        }}
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="tripType">Tipo de viaje</Label>
              <Select
                value={nuevaRuta.tripType}
                onValueChange={(valor) => handleInputChange("tripType", valor)}
              >
                <SelectTrigger id="tripType">
                  <SelectValue placeholder="Seleccione el tipo de viaje" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="BUS">Solo Bus</SelectItem>
                  <SelectItem value="BUS_BOAT">Bus + Lancha</SelectItem>
                  <SelectItem value="BOAT">Solo Lancha</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label>Días de la semana</Label>
              <div className="grid grid-cols-4 gap-2">
                {diasSemana.map((dia) => (
                  <div key={dia.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={`dia-${dia.id}`}
                      checked={nuevaRuta.operatingDays.includes(dia.id)}
                      onCheckedChange={() => handleDiaSemanaChange(dia.id)}
                    />
                    <label
                      htmlFor={`dia-${dia.id}`}
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      {dia.label}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogoAbierto(false)}>
              Cancelar
            </Button>
            <Button
              onClick={handleGuardar}
              className="bg-teal-500 hover:bg-teal-600"
              disabled={
                guardando ||
                !nuevaRuta.origin ||
                !nuevaRuta.destination ||
                !nuevaRuta.startTime ||
                !nuevaRuta.endTime ||
                (nuevaRuta.frequencyType === "INTERVAL" &&
                  !nuevaRuta.intervalMinutes) ||
                (nuevaRuta.frequencyType === "SPECIFIC" &&
                  nuevaRuta.specificTimes.length === 0) ||
                nuevaRuta.operatingDays.length === 0 ||
                (nuevaRuta.busPrice === "" && nuevaRuta.boatPrice === "")
              }
            >
              {guardando ? (
                <span className="flex items-center gap-1">
                  <span className="animate-spin h-4 w-4 border-2 border-white rounded-full border-t-transparent"></span>
                  Guardando...
                </span>
              ) : rutaEnEdicion ? (
                "Actualizar"
              ) : (
                "Crear"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// Iconos
function PlusIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M5 12h14" />
      <path d="M12 5v14" />
    </svg>
  );
}

function SearchIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.3-4.3" />
    </svg>
  );
}

function ArrowUpIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m5 12 7-7 7 7" />
      <path d="M12 19V5" />
    </svg>
  );
}

function ArrowDownIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 5v14" />
      <path d="m19 12-7 7-7-7" />
    </svg>
  );
}

function PencilIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
      <path d="m15 5 4 4" />
    </svg>
  );
}

function EyeIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

function EyeOffIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24" />
      <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68" />
      <path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61" />
      <line x1="2" x2="22" y1="2" y2="22" />
    </svg>
  );
}
