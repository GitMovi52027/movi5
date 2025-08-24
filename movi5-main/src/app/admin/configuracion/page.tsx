"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { useSession } from "next-auth/react";

// Definir la interfaz para WebhookLog
interface WebhookLog {
  id: string;
  requestId: string;
  webhookUrl: string;
  payload: Record<string, unknown>;
  response: Record<string, unknown> | null;
  statusCode: number | null;
  success: boolean;
  createdAt: string;
}

// Interfaz para configuraciones generales
interface GeneralConfigs {
  contactAddress: string;
  contactPhone: string;
  contactEmail: string;
  termsAndConditions: string;
  privacyPolicy: string;
  socialFacebook: string;
  socialInstagram: string;
  socialX: string;
}

// Interfaz para información de cuenta de administrador
interface AdminAccount {
  id: string;
  name?: string | null;
  email: string;
  role: string;
}

export default function ConfiguracionPage() {
  const { update } = useSession();
  
  // Estados para webhook
  const [webhookUrl, setWebhookUrl] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [webhookLogs, setWebhookLogs] = useState<WebhookLog[]>([]);
  
  // Estados para configuraciones generales
  const [generalConfigs, setGeneralConfigs] = useState<Partial<GeneralConfigs>>({
    contactAddress: "",
    contactPhone: "",
    contactEmail: "",
    termsAndConditions: "",
    privacyPolicy: "",
    socialFacebook: "",
    socialInstagram: "",
    socialX: ""
  });
  
  // Estado para controlar qué configuración se está guardando
  const [savingConfig, setSavingConfig] = useState<string | null>(null);
  
  // Estados para configuración de cuenta
  const [adminInfo, setAdminInfo] = useState<AdminAccount | null>(null);
  const [newEmail, setNewEmail] = useState<string>("");
  const [currentPassword, setCurrentPassword] = useState<string>("");
  const [newPassword, setNewPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [loadingAccount, setLoadingAccount] = useState<boolean>(false);
  const [updatingEmail, setUpdatingEmail] = useState<boolean>(false);
  const [updatingPassword, setUpdatingPassword] = useState<boolean>(false);

  useEffect(() => {
    // Cargar todas las configuraciones
    fetchWebhookConfig();
    fetchWebhookLogs();
    fetchGeneralConfigs();
    fetchAdminInfo();
  }, []);
  
  // Actualizar el email en el estado cuando cambia la info del admin
  useEffect(() => {
    if (adminInfo?.email) {
      setNewEmail(adminInfo.email);
    }
  }, [adminInfo]);

  // Funciones para webhook
  const fetchWebhookConfig = async () => {
    try {
      const response = await fetch("/api/config/webhook");
      const data = await response.json();
      if (data.url) {
        setWebhookUrl(data.url);
      }
    } catch (error) {
      console.error("Error al cargar la configuración:", error);
      toast.error("Error al cargar la configuración de webhook");
    }
  };

  const fetchWebhookLogs = async () => {
    try {
      const response = await fetch("/api/config/webhook/logs");
      const data = await response.json();
      setWebhookLogs(data);
    } catch (error) {
      console.error("Error al cargar los logs:", error);
      toast.error("Error al cargar el historial de envíos");
    }
  };

  const saveWebhookUrl = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/config/webhook", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ url: webhookUrl }),
      });

      if (response.ok) {
        toast.success("URL del webhook guardada correctamente");
      } else {
        const data = await response.json();
        toast.error(data.error || "Error al guardar la URL");
      }
    } catch (error) {
      console.error("Error al guardar la configuración:", error);
      toast.error("Error al guardar la configuración");
    } finally {
      setIsLoading(false);
    }
  };

  // Funciones para configuraciones generales
  const fetchGeneralConfigs = async () => {
    try {
      const response = await fetch("/api/config/general");
      const data = await response.json();
      if (response.ok) {
        setGeneralConfigs(prevState => ({
          ...prevState,
          ...data
        }));
      } else {
        toast.error("Error al cargar las configuraciones generales");
      }
    } catch (error) {
      console.error("Error al cargar configuraciones generales:", error);
      toast.error("Error al cargar las configuraciones generales");
    }
  };

  const saveGeneralConfig = async (key: keyof GeneralConfigs) => {
    setSavingConfig(key);
    try {
      const response = await fetch("/api/config/general", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
          key, 
          value: generalConfigs[key] || ""
        }),
      });

      if (response.ok) {
        toast.success("Configuración guardada correctamente");
      } else {
        const data = await response.json();
        toast.error(data.error || "Error al guardar la configuración");
      }
    } catch (error) {
      console.error("Error al guardar la configuración:", error);
      toast.error("Error al guardar la configuración");
    } finally {
      setSavingConfig(null);
    }
  };

  const handleGeneralConfigChange = (key: keyof GeneralConfigs, value: string) => {
    setGeneralConfigs(prevConfigs => ({
      ...prevConfigs,
      [key]: value
    }));
  };
  
  // Funciones para configuración de cuenta
  const fetchAdminInfo = async () => {
    setLoadingAccount(true);
    try {
      const response = await fetch("/api/admin/account");
      if (response.ok) {
        const data = await response.json();
        setAdminInfo(data);
      } else {
        toast.error("Error al cargar información de la cuenta");
      }
    } catch (error) {
      console.error("Error al cargar información de la cuenta:", error);
      toast.error("Error al cargar información de la cuenta");
    } finally {
      setLoadingAccount(false);
    }
  };
  
  const updateEmail = async () => {
    if (!newEmail) {
      toast.error("El email no puede estar vacío");
      return;
    }
    
    // Validar formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(newEmail)) {
      toast.error("El formato del email no es válido");
      return;
    }
    
    setUpdatingEmail(true);
    try {
      const response = await fetch("/api/admin/account", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: newEmail }),
      });
      
      if (response.ok) {
        toast.success("Email actualizado correctamente");
        fetchAdminInfo();
        // Actualizar la sesión para reflejar el nuevo email
        update();
      } else {
        const data = await response.json();
        toast.error(data.error || "Error al actualizar el email");
      }
    } catch (error) {
      console.error("Error al actualizar el email:", error);
      toast.error("Error al actualizar el email");
    } finally {
      setUpdatingEmail(false);
    }
  };
  
  const updatePassword = async () => {
    // Validaciones
    if (!currentPassword) {
      toast.error("Debe ingresar la contraseña actual");
      return;
    }
    
    if (!newPassword) {
      toast.error("Debe ingresar la nueva contraseña");
      return;
    }
    
    if (newPassword.length < 8) {
      toast.error("La nueva contraseña debe tener al menos 8 caracteres");
      return;
    }
    
    if (newPassword !== confirmPassword) {
      toast.error("Las contraseñas no coinciden");
      return;
    }
    
    setUpdatingPassword(true);
    try {
      const response = await fetch("/api/admin/account", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          currentPassword,
          newPassword
        }),
      });
      
      if (response.ok) {
        toast.success("Contraseña actualizada correctamente");
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
      } else {
        const data = await response.json();
        toast.error(data.error || "Error al actualizar la contraseña");
      }
    } catch (error) {
      console.error("Error al actualizar la contraseña:", error);
      toast.error("Error al actualizar la contraseña");
    } finally {
      setUpdatingPassword(false);
    }
  };

  // Funciones de utilidad
  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString("es-MX", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  };

  const formatJsonDisplay = (data: Record<string, unknown> | null) => {
    if (!data) return "No hay datos disponibles";
    try {
      return JSON.stringify(data, null, 2);
    } catch {
      return "Error al formatear datos";
    }
  };

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Configuración del Sistema</h1>

      <Tabs defaultValue="webhook" className="w-full">
        <TabsList className="grid grid-cols-6 mb-6">
          <TabsTrigger value="webhook">Webhook</TabsTrigger>
          <TabsTrigger value="contacto">Datos de Contacto</TabsTrigger>
          <TabsTrigger value="terminos">Términos y Condiciones</TabsTrigger>
          <TabsTrigger value="privacidad">Política de Privacidad</TabsTrigger>
          <TabsTrigger value="redes">Redes Sociales</TabsTrigger>
          <TabsTrigger value="cuenta">Cuenta</TabsTrigger>
        </TabsList>
        
        {/* Contenido de la pestaña Webhook */}
        <TabsContent value="webhook" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Configuración de Webhook</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    URL del Webhook
                  </label>
                  <div className="flex gap-2">
                    <Input
                      type="url"
                      placeholder="https://tu-webhook.com/endpoint"
                      value={webhookUrl}
                      onChange={(e) => setWebhookUrl(e.target.value)}
                      className="flex-1"
                    />
                    <Button onClick={saveWebhookUrl} disabled={isLoading}>
                      {isLoading ? "Guardando..." : "Guardar"}
                    </Button>
                  </div>
                  <p className="text-sm text-gray-500 mt-1">
                    Esta URL recibirá una notificación cada vez que se cree una nueva solicitud
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Historial de Envíos</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Fecha</TableHead>
                      <TableHead>URL</TableHead>
                      <TableHead>Estado</TableHead>
                      <TableHead>Código</TableHead>
                      <TableHead>ID de Solicitud</TableHead>
                      <TableHead>Detalles</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {webhookLogs.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-4">
                          No hay registros de envíos
                        </TableCell>
                      </TableRow>
                    ) : (
                      webhookLogs.map((log) => (
                        <TableRow key={log.id}>
                          <TableCell>{formatDateTime(log.createdAt)}</TableCell>
                          <TableCell className="max-w-[200px] truncate">
                            {log.webhookUrl}
                          </TableCell>
                          <TableCell>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              log.success 
                                ? "bg-green-100 text-green-800" 
                                : "bg-red-100 text-red-800"
                            }`}>
                              {log.success ? "Exitoso" : "Fallido"}
                            </span>
                          </TableCell>
                          <TableCell>{log.statusCode || "N/A"}</TableCell>
                          <TableCell className="max-w-[150px] truncate">
                            {log.requestId}
                          </TableCell>
                          <TableCell>
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                >
                                  Ver detalles
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="max-w-4xl">
                                <DialogHeader>
                                  <DialogTitle>Detalles del Webhook</DialogTitle>
                                </DialogHeader>
                                <div className="py-4">
                                  <div className="flex justify-between mb-4">
                                    <div>
                                      <p className="text-sm font-medium">Fecha: {formatDateTime(log.createdAt)}</p>
                                      <p className="text-sm font-medium">Estado: {log.success ? "Exitoso" : "Fallido"}</p>
                                    </div>
                                    <div>
                                      <p className="text-sm font-medium">Código: {log.statusCode || "N/A"}</p>
                                      <p className="text-sm font-medium">URL: {log.webhookUrl}</p>
                                    </div>
                                  </div>
                                  
                                  <Tabs defaultValue="payload">
                                    <TabsList className="grid w-full grid-cols-2">
                                      <TabsTrigger value="payload">Payload (Enviado)</TabsTrigger>
                                      <TabsTrigger value="response">Respuesta (Recibida)</TabsTrigger>
                                    </TabsList>
                                    <TabsContent value="payload" className="mt-2">
                                      <div className="rounded-md bg-muted p-4 overflow-auto max-h-96">
                                        <pre className="text-sm whitespace-pre-wrap font-mono">
                                          {formatJsonDisplay(log.payload)}
                                        </pre>
                                      </div>
                                    </TabsContent>
                                    <TabsContent value="response" className="mt-2">
                                      <div className="rounded-md bg-muted p-4 overflow-auto max-h-96">
                                        <pre className="text-sm whitespace-pre-wrap font-mono">
                                          {formatJsonDisplay(log.response)}
                                        </pre>
                                      </div>
                                    </TabsContent>
                                  </Tabs>
                                </div>
                              </DialogContent>
                            </Dialog>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Contenido de la pestaña Datos de Contacto */}
        <TabsContent value="contacto" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Datos de Contacto</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Dirección
                  </label>
                  <div className="flex gap-2">
                    <Input
                      type="text"
                      placeholder="Ej: Calle 15 #12-45, Cali, Colombia"
                      value={generalConfigs.contactAddress || ""}
                      onChange={(e) => handleGeneralConfigChange("contactAddress", e.target.value)}
                      className="flex-1"
                    />
                    <Button 
                      onClick={() => saveGeneralConfig("contactAddress")} 
                      disabled={savingConfig === "contactAddress"}
                    >
                      {savingConfig === "contactAddress" ? "Guardando..." : "Guardar"}
                    </Button>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Teléfono
                  </label>
                  <div className="flex gap-2">
                    <Input
                      type="text"
                      placeholder="Ej: +57 317 123 4567"
                      value={generalConfigs.contactPhone || ""}
                      onChange={(e) => handleGeneralConfigChange("contactPhone", e.target.value)}
                      className="flex-1"
                    />
                    <Button 
                      onClick={() => saveGeneralConfig("contactPhone")} 
                      disabled={savingConfig === "contactPhone"}
                    >
                      {savingConfig === "contactPhone" ? "Guardando..." : "Guardar"}
                    </Button>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Email
                  </label>
                  <div className="flex gap-2">
                    <Input
                      type="email"
                      placeholder="Ej: info@movi5.co"
                      value={generalConfigs.contactEmail || ""}
                      onChange={(e) => handleGeneralConfigChange("contactEmail", e.target.value)}
                      className="flex-1"
                    />
                    <Button 
                      onClick={() => saveGeneralConfig("contactEmail")} 
                      disabled={savingConfig === "contactEmail"}
                    >
                      {savingConfig === "contactEmail" ? "Guardando..." : "Guardar"}
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Contenido de la pestaña Términos y Condiciones */}
        <TabsContent value="terminos" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Términos y Condiciones</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Contenido de Términos y Condiciones
                  </label>
                  <Textarea
                    placeholder="Escriba aquí los términos y condiciones de la plataforma..."
                    className="min-h-[300px]"
                    value={generalConfigs.termsAndConditions || ""}
                    onChange={(e) => handleGeneralConfigChange("termsAndConditions", e.target.value)}
                  />
                  <div className="mt-2">
                    <Button 
                      onClick={() => saveGeneralConfig("termsAndConditions")} 
                      disabled={savingConfig === "termsAndConditions"}
                    >
                      {savingConfig === "termsAndConditions" ? "Guardando..." : "Guardar"}
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Contenido de la pestaña Política de Privacidad */}
        <TabsContent value="privacidad" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Política de Privacidad</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Contenido de Política de Privacidad
                  </label>
                  <Textarea
                    placeholder="Escriba aquí la política de privacidad de la plataforma..."
                    className="min-h-[300px]"
                    value={generalConfigs.privacyPolicy || ""}
                    onChange={(e) => handleGeneralConfigChange("privacyPolicy", e.target.value)}
                  />
                  <div className="mt-2">
                    <Button 
                      onClick={() => saveGeneralConfig("privacyPolicy")} 
                      disabled={savingConfig === "privacyPolicy"}
                    >
                      {savingConfig === "privacyPolicy" ? "Guardando..." : "Guardar"}
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Contenido de la pestaña Redes Sociales */}
        <TabsContent value="redes" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Redes Sociales</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    URL de Facebook
                  </label>
                  <div className="flex gap-2">
                    <Input
                      type="url"
                      placeholder="https://facebook.com/movi5"
                      value={generalConfigs.socialFacebook || ""}
                      onChange={(e) => handleGeneralConfigChange("socialFacebook", e.target.value)}
                      className="flex-1"
                    />
                    <Button 
                      onClick={() => saveGeneralConfig("socialFacebook")} 
                      disabled={savingConfig === "socialFacebook"}
                    >
                      {savingConfig === "socialFacebook" ? "Guardando..." : "Guardar"}
                    </Button>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">
                    URL de Instagram
                  </label>
                  <div className="flex gap-2">
                    <Input
                      type="url"
                      placeholder="https://instagram.com/movi5"
                      value={generalConfigs.socialInstagram || ""}
                      onChange={(e) => handleGeneralConfigChange("socialInstagram", e.target.value)}
                      className="flex-1"
                    />
                    <Button 
                      onClick={() => saveGeneralConfig("socialInstagram")} 
                      disabled={savingConfig === "socialInstagram"}
                    >
                      {savingConfig === "socialInstagram" ? "Guardando..." : "Guardar"}
                    </Button>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">
                    URL de X
                  </label>
                  <div className="flex gap-2">
                    <Input
                      type="url"
                      placeholder="https://x.com/movi5"
                      value={generalConfigs.socialX || ""}
                      onChange={(e) => handleGeneralConfigChange("socialX", e.target.value)}
                      className="flex-1"
                    />
                    <Button 
                      onClick={() => saveGeneralConfig("socialX")} 
                      disabled={savingConfig === "socialX"}
                    >
                      {savingConfig === "socialX" ? "Guardando..." : "Guardar"}
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Contenido de la pestaña Cuenta */}
        <TabsContent value="cuenta" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Configuración de Cuenta</CardTitle>
            </CardHeader>
            <CardContent>
              {loadingAccount ? (
                <div className="flex justify-center items-center h-32">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-teal"></div>
                </div>
              ) : (
                <div className="space-y-8">
                  {/* Sección de Email */}
                  <div>
                    <h3 className="text-lg font-medium mb-4">Actualizar Email</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium mb-1">
                          Email Actual
                        </label>
                        <Input
                          type="email"
                          value={adminInfo?.email || ""}
                          disabled
                          className="max-w-md bg-gray-50"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium mb-1">
                          Nuevo Email
                        </label>
                        <div className="flex gap-2 max-w-md">
                          <Input
                            type="email"
                            placeholder="nuevo@email.com"
                            value={newEmail}
                            onChange={(e) => setNewEmail(e.target.value)}
                            className="flex-1"
                          />
                          <Button 
                            onClick={updateEmail} 
                            disabled={updatingEmail || !newEmail || newEmail === adminInfo?.email}
                          >
                            {updatingEmail ? "Actualizando..." : "Actualizar"}
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Separador */}
                  <div className="border-t border-gray-200 my-6"></div>
                  
                  {/* Sección de Contraseña */}
                  <div>
                    <h3 className="text-lg font-medium mb-4">Cambiar Contraseña</h3>
                    <div className="space-y-4 max-w-md">
                      <div>
                        <label className="block text-sm font-medium mb-1">
                          Contraseña Actual
                        </label>
                        <Input
                          type="password"
                          placeholder="Ingrese su contraseña actual"
                          value={currentPassword}
                          onChange={(e) => setCurrentPassword(e.target.value)}
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium mb-1">
                          Nueva Contraseña
                        </label>
                        <Input
                          type="password"
                          placeholder="Mínimo 8 caracteres"
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium mb-1">
                          Confirmar Nueva Contraseña
                        </label>
                        <Input
                          type="password"
                          placeholder="Confirme la nueva contraseña"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                        />
                      </div>
                      
                      <Button 
                        onClick={updatePassword} 
                        disabled={updatingPassword || !currentPassword || !newPassword || !confirmPassword || newPassword !== confirmPassword}
                        className="w-full mt-2"
                      >
                        {updatingPassword ? "Actualizando contraseña..." : "Actualizar contraseña"}
                      </Button>
                      
                      <p className="text-sm text-gray-500 mt-1">
                        La contraseña debe tener al menos 8 caracteres.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
} 