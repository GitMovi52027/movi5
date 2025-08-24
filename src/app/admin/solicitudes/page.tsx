"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { format } from "date-fns";
import { es } from "date-fns/locale";

// Componentes UI personalizados
const Badge = ({ children, variant = "default", className }: { children: React.ReactNode; variant?: string; className?: string }) => {
  const colors: Record<string, string> = {
    default: "bg-slate-100 text-slate-800",
    PENDING: "bg-yellow-100 text-yellow-800",
    APPROVED: "bg-blue-100 text-blue-800",
    COMPLETED: "bg-green-100 text-green-800",
    REJECTED: "bg-red-100 text-red-800",
    PAID: "bg-emerald-100 text-emerald-800",
    CANCELLED: "bg-gray-100 text-gray-800",
  };
  
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${colors[variant] || colors.default} ${className || ""}`}>
      {children}
    </span>
  );
};

// Interfaz para la estructura de datos de solicitudes
interface RequestNote {
  id: string;
  content: string;
  createdBy: string;
  createdAt: string;
}

// Ampliada para incluir los nuevos campos del titular
interface Titular {
  nombre?: string;
  apellido?: string;
  tipoDocumento?: string;
  cedula?: string;
  paisPasaporte?: string;
  paisEmision?: string;
  edad?: number | string;
  email?: string;
  telefono?: string;
  documentType?: string;
  documentNumber?: string;
}

// Interfaces mejoradas para manejar ambos formatos de datos
interface Passenger {
  fullName?: string;
  firstName?: string;
  lastName?: string;
  documentType: string;
  documentNumber: string;
  email?: string;
  phone?: string;
  // Campos del nuevo formato
  nombre?: string;
  apellido?: string;
  cedula?: string;
  edad?: number | string;
}

// Interfaz para datos de pasajeros que puede incluir datos del titular
interface PassengerData {
  pasajeros?: Passenger[];
  titular?: Titular;
}

interface Request {
  id: string;
  origin: string;
  destination: string;
  departureDate: string;
  returnDate?: string;
  passengers: number;
  passengerData?: PassengerData | Passenger[];
  totalPrice: number;
  status: "PENDING" | "APPROVED" | "REJECTED" | "COMPLETED";
  paymentStatus: "PENDING" | "PAID" | "CANCELLED";
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  departureTime?: string;
  returnTime?: string;
  ticketType?: string;
  createdAt: string;
  updatedAt: string;
}

// Página de administración de solicitudes
export default function SolicitudesPage() {
  const [tab, setTab] = useState<"PENDING" | "APPROVED" | "REJECTED" | "COMPLETED">("PENDING");
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<Request | null>(null);
  const [requests, setRequests] = useState<Request[]>([]);
  const [filteredRequests, setFilteredRequests] = useState<Request[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [originFilter, setOriginFilter] = useState("todos");
  const [destinationFilter, setDestinationFilter] = useState("todos");
  const [loading, setLoading] = useState(true);
  const [notes, setNotes] = useState<RequestNote[]>([]);
  const [newNote, setNewNote] = useState("");
  const [loadingNotes, setLoadingNotes] = useState(false);
  const [savingNote, setSavingNote] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [origins, setOrigins] = useState<string[]>([]);
  const [destinations, setDestinations] = useState<string[]>([]);

  // Función para cargar las solicitudes
  const fetchRequests = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/requests");
      if (response.ok) {
        const data = await response.json();
        // Ordenar las solicitudes de la más nueva a la más antigua
        const sortedData = data.sort((a: Request, b: Request) => 
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        setRequests(sortedData);
        
        // Extraer orígenes y destinos únicos para los filtros
        const uniqueOrigins = [...new Set(data.map((req: Request) => req.origin))];
        const uniqueDestinations = [...new Set(data.map((req: Request) => req.destination))];
        setOrigins(uniqueOrigins as string[]);
        setDestinations(uniqueDestinations as string[]);
      } else {
        console.error("Error al cargar solicitudes:", await response.text());
      }
    } catch (error) {
      console.error("Error al cargar solicitudes:", error);
    } finally {
      setLoading(false);
    }
  };

  // Cargar las solicitudes al montar el componente
  useEffect(() => {
    fetchRequests();
  }, []);

  // Filtrar solicitudes según los criterios
  useEffect(() => {
    if (requests.length === 0) {
      setFilteredRequests([]);
      return;
    }
    
    let filtered = requests.filter(request => request.status === tab);
    
    if (searchTerm) {
      const search = searchTerm.toLowerCase();
      filtered = filtered.filter(
        req => 
          req.id.toLowerCase().includes(search) ||
          req.customerName.toLowerCase().includes(search) ||
          req.customerEmail.toLowerCase().includes(search)
      );
    }
    
    if (originFilter !== "todos") {
      filtered = filtered.filter(req => req.origin === originFilter);
    }
    
    if (destinationFilter !== "todos") {
      filtered = filtered.filter(req => req.destination === destinationFilter);
    }
    
    setFilteredRequests(filtered);
  }, [requests, tab, searchTerm, originFilter, destinationFilter]);

  // Obtener notas de una solicitud
  const fetchNotes = async (requestId: string) => {
    setLoadingNotes(true);
    try {
      const response = await fetch(`/api/requests/${requestId}/notes`);
      if (response.ok) {
        const data = await response.json();
        setNotes(data);
      } else {
        console.error("Error al cargar notas:", await response.text());
      }
    } catch (error) {
      console.error("Error al cargar notas:", error);
    } finally {
      setLoadingNotes(false);
    }
  };

  // Guardar una nueva nota
  const saveNote = async () => {
    if (!newNote.trim() || !selectedRequest) return;
    
    setSavingNote(true);
    try {
      const response = await fetch(`/api/requests/${selectedRequest.id}/notes`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content: newNote,
          createdBy: "Admin",
        }),
      });
      
      if (response.ok) {
        // Recargar las notas
        fetchNotes(selectedRequest.id);
        setNewNote("");
      } else {
        console.error("Error al guardar nota:", await response.text());
      }
    } catch (error) {
      console.error("Error al guardar nota:", error);
    } finally {
      setSavingNote(false);
    }
  };

  // Traducir estados a español para las notas
  const translateStatus = (status: string) => {
    const statusMap: Record<string, string> = {
      PENDING: "Pendiente",
      APPROVED: "Aprobada",
      COMPLETED: "Completada",
      REJECTED: "Rechazada",
      PAID: "Pagado",
      CANCELLED: "Cancelado"
    };
    return statusMap[status] || status;
  };

  // Actualizar el estado de una solicitud
  const updateRequestStatus = async (newStatus: string) => {
    if (!selectedRequest || selectedRequest.status === newStatus) return;
    
    setUpdatingStatus(true);
    try {
      // Primero actualizamos el estado en la base de datos
      const response = await fetch(`/api/requests/${selectedRequest.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          status: newStatus,
        }),
      });
      
      if (!response.ok) {
        throw new Error(`Error al actualizar estado: ${await response.text()}`);
      }
      
      // Actualizar la solicitud localmente con la respuesta
      const updatedRequest = await response.json();
      setSelectedRequest(updatedRequest);
      
      // Actualizar la lista de solicitudes
      setRequests(prevRequests => 
        prevRequests.map(req => 
          req.id === updatedRequest.id ? updatedRequest : req
        )
      );
      
      // Añadir una nota sobre el cambio de estado
      const oldStatus = translateStatus(selectedRequest.status);
      const newStatusTranslated = translateStatus(newStatus);
      
      const noteResponse = await fetch(`/api/requests/${selectedRequest.id}/notes`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content: `Estado cambiado de: ${oldStatus} a ${newStatusTranslated}`,
          createdBy: "Sistema",
        }),
      });
      
      if (!noteResponse.ok) {
        console.error("Error al guardar nota de cambio de estado:", await noteResponse.text());
      }
      
      // Recargar las notas para mostrar el cambio
      await fetchNotes(selectedRequest.id);
    } catch (error) {
      console.error("Error al actualizar estado:", error);
      alert("Error al actualizar el estado de la solicitud. Intente nuevamente.");
    } finally {
      setUpdatingStatus(false);
    }
  };

  // Función para ver detalles de una solicitud
  const verDetalles = (request: Request) => {
    setSelectedRequest(request);
    fetchNotes(request.id);
    setOpenDialog(true);
  };

  // Formatear fecha para mostrar
  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "dd/MM/yyyy", { locale: es });
    } catch {
      return dateString;
    }
  };

  // Formatear fecha y hora para mostrar
  const formatDateTime = (dateString: string) => {
    try {
      return format(new Date(dateString), "dd/MM/yyyy HH:mm", { locale: es });
    } catch {
      return dateString;
    }
  };

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-8">Administración de Solicitudes</h1>
      
      {/* Filtros y búsqueda */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <Input 
          placeholder="Buscar por nombre, email o ID..." 
          className="max-w-sm" 
          value={searchTerm}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
        />
        <Select value={originFilter} onValueChange={setOriginFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Origen" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="todos">Todos los orígenes</SelectItem>
            {origins.map(origin => (
              <SelectItem key={origin} value={origin}>{origin}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={destinationFilter} onValueChange={setDestinationFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Destino" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="todos">Todos los destinos</SelectItem>
            {destinations.map(destination => (
              <SelectItem key={destination} value={destination}>{destination}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      {/* Tabs */}
      <div className="w-full">
        <div className="inline-flex h-10 items-center justify-center rounded-md bg-muted p-1 text-muted-foreground mb-4">
          <button 
            className={`inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 ${tab === "PENDING" ? "bg-background text-foreground shadow-sm" : ""}`}
            onClick={() => setTab("PENDING")}
          >
            Pendientes
          </button>
          <button 
            className={`inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 ${tab === "APPROVED" ? "bg-background text-foreground shadow-sm" : ""}`}
            onClick={() => setTab("APPROVED")}
          >
            Aprobadas
          </button>
          <button 
            className={`inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 ${tab === "COMPLETED" ? "bg-background text-foreground shadow-sm" : ""}`}
            onClick={() => setTab("COMPLETED")}
          >
            Completadas
          </button>
          <button 
            className={`inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 ${tab === "REJECTED" ? "bg-background text-foreground shadow-sm" : ""}`}
            onClick={() => setTab("REJECTED")}
          >
            Rechazadas
          </button>
        </div>
        
        {/* Contenido de la tabla */}
        <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
          <div className="p-6">
            {loading ? (
              <div className="flex justify-center items-center py-10">
                <p>Cargando solicitudes...</p>
              </div>
            ) : (
              <div className="w-full overflow-auto">
                <table className="w-full caption-bottom text-sm">
                  <thead className="[&_tr]:border-b">
                    <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                      <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">ID</th>
                      <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Cliente</th>
                      <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Origen</th>
                      <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Destino</th>
                      <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Fecha del viaje</th>
                      <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Fecha de solicitud</th>
                      <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Estado</th>
                      <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Pago</th>
                      <th className="h-12 px-4 text-right align-middle font-medium text-muted-foreground">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="[&_tr:last-child]:border-0">
                    {filteredRequests.length > 0 ? (
                      filteredRequests.map((request) => (
                        <tr key={request.id} className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                          <td className="p-4 align-middle">{request.id.slice(-5)}</td>
                          <td className="p-4 align-middle">{request.customerName}</td>
                          <td className="p-4 align-middle">{request.origin}</td>
                          <td className="p-4 align-middle">{request.destination}</td>
                          <td className="p-4 align-middle">{formatDate(request.departureDate)}</td>
                          <td className="p-4 align-middle">{formatDateTime(request.createdAt)}</td>
                          <td className="p-4 align-middle">
                            <Badge variant={request.status}>{request.status}</Badge>
                          </td>
                          <td className="p-4 align-middle">
                            <Badge variant={request.paymentStatus}>{request.paymentStatus}</Badge>
                          </td>
                          <td className="p-4 align-middle text-right">
                            <Button variant="outline" size="sm" onClick={() => verDetalles(request)}>
                              Ver detalles
                            </Button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                        <td className="p-4 align-middle text-center py-10" colSpan={9}>
                          No hay solicitudes {tab === "PENDING" ? "pendientes" : tab === "APPROVED" ? "aprobadas" : tab === "COMPLETED" ? "completadas" : "rechazadas"}
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Modal de detalles */}
      {openDialog && selectedRequest && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center overflow-y-auto p-4">
          <div className="bg-background rounded-lg w-full max-w-4xl p-6 shadow-lg max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-xl font-semibold">Detalles de la Solicitud</h2>
              <button onClick={() => setOpenDialog(false)} className="rounded-full p-1 hover:bg-gray-100">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Información principal */}
              <div className="space-y-4">
                <div className="rounded-lg border p-4">
                  <h3 className="font-medium mb-3">Información Principal</h3>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="text-muted-foreground">ID:</div>
                    <div>{selectedRequest.id.slice(-5)}</div>
                    
                    <div className="text-muted-foreground">Fecha de solicitud:</div>
                    <div className="font-semibold text-blue-600">{formatDateTime(selectedRequest.createdAt)}</div>
                    
                    <div className="text-muted-foreground">Última actualización:</div>
                    <div>{formatDateTime(selectedRequest.updatedAt)}</div>
                    
                    <div className="text-muted-foreground">Origen:</div>
                    <div>{selectedRequest.origin}</div>
                    
                    <div className="text-muted-foreground">Destino:</div>
                    <div>{selectedRequest.destination}</div>
                    
                    <div className="text-muted-foreground">Fecha de salida:</div>
                    <div>{formatDate(selectedRequest.departureDate)}</div>
                    
                    {selectedRequest.returnDate && (
                      <>
                        <div className="text-muted-foreground">Fecha de regreso:</div>
                        <div>{formatDate(selectedRequest.returnDate)}</div>
                      </>
                    )}
                    
                    <div className="text-muted-foreground">Pasajeros:</div>
                    <div>{selectedRequest.passengers}</div>
                    
                    <div className="text-muted-foreground">Precio total:</div>
                    <div>${selectedRequest.totalPrice.toLocaleString()}</div>
                    
                    <div className="text-muted-foreground">Tipo de boleto:</div>
                    <div>{selectedRequest.ticketType || "No especificado"}</div>
                    
                    <div className="text-muted-foreground">Hora de salida:</div>
                    <div>{selectedRequest.departureTime || "No especificado"}</div>
                    
                    {selectedRequest.returnTime && (
                      <>
                        <div className="text-muted-foreground">Hora de regreso:</div>
                        <div>{selectedRequest.returnTime}</div>
                      </>
                    )}
                  </div>
                </div>
                
                <div className="rounded-lg border p-4">
                  <h3 className="font-medium mb-3">Cliente</h3>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="text-muted-foreground">Nombre:</div>
                    <div>{selectedRequest.customerName}</div>
                    
                    <div className="text-muted-foreground">Email:</div>
                    <div>{selectedRequest.customerEmail}</div>
                    
                    <div className="text-muted-foreground">Teléfono:</div>
                    <div>{selectedRequest.customerPhone}</div>
                    
                    {/* Intentar extraer y mostrar datos del titular independientemente de su estructura */}
                    {selectedRequest.passengerData && (
                      <>
                        {/* Mostrar datos del titular según diferentes estructuras posibles */}
                        {!Array.isArray(selectedRequest.passengerData) && selectedRequest.passengerData.titular && (
                          <>
                            <div className="col-span-2 mt-2 mb-1 border-t pt-2">
                              <span className="font-semibold text-teal-600">Datos del titular</span>
                            </div>
                            
                            <div className="text-muted-foreground">Tipo de documento:</div>
                            <div>{selectedRequest.passengerData.titular.tipoDocumento || selectedRequest.passengerData.titular.documentType || "No especificado"}</div>
                            
                            <div className="text-muted-foreground">Número de documento:</div>
                            <div>{selectedRequest.passengerData.titular.cedula || selectedRequest.passengerData.titular.documentNumber || "No especificado"}</div>
                            
                            {((selectedRequest.passengerData.titular.tipoDocumento === "Pasaporte" || 
                               selectedRequest.passengerData.titular.documentType === "Pasaporte") && 
                              (selectedRequest.passengerData.titular.paisPasaporte || selectedRequest.passengerData.titular.paisEmision)) && (
                              <>
                                <div className="text-muted-foreground">País del pasaporte:</div>
                                <div>{selectedRequest.passengerData.titular.paisPasaporte || selectedRequest.passengerData.titular.paisEmision}</div>
                              </>
                            )}
                            
                            {(selectedRequest.passengerData.titular.edad !== undefined) && (
                              <>
                                <div className="text-muted-foreground">Edad:</div>
                                <div>{selectedRequest.passengerData.titular.edad} años</div>
                              </>
                            )}
                          </>
                        )}
                      </>
                    )}
                  </div>
                </div>
                
                {/* Datos de pasajeros */}
                {selectedRequest.passengerData && (
                  <div className="rounded-lg border p-4">
                    <h3 className="font-medium mb-3">Datos de Pasajeros</h3>
                    <div className="text-sm space-y-3">
                      {!Array.isArray(selectedRequest.passengerData) && selectedRequest.passengerData.pasajeros ? (
                        // Formato nuevo: { pasajeros: [...], titular: {...} }
                        selectedRequest.passengerData.pasajeros.map((pasajero: Passenger, index) => (
                          <div key={index} className="border-t pt-2">
                            <p><span className="font-medium">Pasajero {index + 1}</span></p>
                            <p>Nombre: {pasajero.nombre} {pasajero.apellido}</p>
                            <p>Documento: {pasajero.cedula || pasajero.documentNumber}</p>
                            {pasajero.edad && <p>Edad: {pasajero.edad} años</p>}
                          </div>
                        ))
                      ) : Array.isArray(selectedRequest.passengerData) ? (
                        // Formato antiguo: passengerData como array
                        selectedRequest.passengerData.map((passenger, index) => (
                          <div key={index} className="border-t pt-2">
                            <p><span className="font-medium">Pasajero {index + 1}</span></p>
                            <p>Nombre: {passenger.fullName || (passenger.firstName && passenger.lastName ? `${passenger.firstName} ${passenger.lastName}` : "No especificado")}</p>
                            <p>Documento: {passenger.documentType} {passenger.documentNumber}</p>
                            {passenger.email && <p>Email: {passenger.email}</p>}
                            {passenger.phone && <p>Teléfono: {passenger.phone}</p>}
                          </div>
                        ))
                      ) : (
                        <p>No hay datos detallados de pasajeros</p>
                      )}
                    </div>
                  </div>
                )}
              </div>
              
              {/* Estados y Notas */}
              <div className="space-y-4">
                <div className="rounded-lg border p-4">
                  <h3 className="font-medium mb-3">Estados</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Estado de solicitud</label>
                      <div className="flex gap-2">
                        <Select 
                          value={selectedRequest.status} 
                          onValueChange={(value) => updateRequestStatus(value)}
                          disabled={updatingStatus}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="PENDING">Pendiente</SelectItem>
                            <SelectItem value="APPROVED">Aprobada</SelectItem>
                            <SelectItem value="COMPLETED">Completada</SelectItem>
                            <SelectItem value="REJECTED">Rechazada</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-1">Estado de pago</label>
                      <div className="flex items-center gap-2">
                        <Badge variant={selectedRequest.paymentStatus}>{selectedRequest.paymentStatus}</Badge>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="rounded-lg border p-4">
                  <h3 className="font-medium mb-3">Notas e Historial</h3>
                  
                  {/* Agregar nueva nota */}
                  <div className="mb-4">
                    <Textarea 
                      placeholder="Agregar una nueva nota..."
                      value={newNote}
                      onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setNewNote(e.target.value)}
                      className="w-full"
                    />
                    <Button 
                      onClick={saveNote} 
                      className="mt-2" 
                      size="sm"
                      disabled={!newNote.trim() || savingNote}
                    >
                      {savingNote ? "Guardando..." : "Guardar Nota"}
                    </Button>
                  </div>
                  
                  {/* Lista de notas */}
                  <div className="space-y-3 max-h-[300px] overflow-y-auto">
                    {loadingNotes ? (
                      <p className="text-sm text-center py-4">Cargando notas...</p>
                    ) : notes.length > 0 ? (
                      notes.map((note) => (
                        <div key={note.id} className="border-t pt-2">
                          <div className="flex justify-between text-xs text-muted-foreground mb-1">
                            <span>{note.createdBy}</span>
                            <span>{format(new Date(note.createdAt), "dd/MM/yyyy HH:mm", { locale: es })}</span>
                          </div>
                          <p className="text-sm">{note.content}</p>
                        </div>
                      ))
                    ) : (
                      <p className="text-sm text-center py-4">No hay notas para esta solicitud</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mt-6 flex justify-end">
              <Button variant="outline" onClick={() => setOpenDialog(false)}>Cerrar</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}