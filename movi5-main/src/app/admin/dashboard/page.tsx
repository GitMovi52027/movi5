"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function DashboardPage() {
  // Tipos para los datos del dashboard
  type DashboardStats = {
    totalRutas: number;
    rutasActivas: number;
    solicitudesPendientes: number;
    solicitudesCompletadas: number;
  };
  
  type ActividadReciente = {
    type: string;
    description: string;
    time: string;
  };
  
  type RutaPopular = {
    route: string;
    count: number;
    percent: number;
  };
  
  // Estados para almacenar los datos del dashboard
  const [stats, setStats] = useState<DashboardStats>({
    totalRutas: 0,
    rutasActivas: 0,
    solicitudesPendientes: 0,
    solicitudesCompletadas: 0,
  });
  
  const [actividadReciente, setActividadReciente] = useState<ActividadReciente[]>([]);
  const [rutasPopulares, setRutasPopulares] = useState<RutaPopular[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

  // Función para cargar los datos del dashboard
  const loadDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch('/api/dashboard');
      
      if (!response.ok) {
        throw new Error('Error al cargar los datos del dashboard');
      }
      
      const data = await response.json();
      
      setStats(data.stats);
      setActividadReciente(data.actividadReciente);
      setRutasPopulares(data.rutasPopulares);
      setLastUpdated(new Date());
    } catch (err) {
      console.error('Error al cargar datos del dashboard:', err);
      setError('No se pudieron cargar los datos del dashboard');
    } finally {
      setLoading(false);
    }
  };

  // Cargar los datos al montar el componente
  useEffect(() => {
    loadDashboardData();
    
    // Opcionalmente, actualizar los datos cada cierto tiempo (ej: cada 5 minutos)
    const interval = setInterval(loadDashboardData, 5 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
        <div className="flex items-center space-x-4">
          <button 
            onClick={loadDashboardData}
            className="bg-teal/10 text-teal p-2 rounded-full hover:bg-teal/20"
            disabled={loading}
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </button>
          <div className="text-sm text-gray-500">
            Última actualización: {lastUpdated.toLocaleString()}
          </div>
        </div>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          <strong className="font-bold">Error:</strong>
          <span className="block sm:inline"> {error}</span>
        </div>
      )}

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal"></div>
        </div>
      ) : (
        <>
          {/* Tarjetas de estadísticas */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">Total Rutas</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalRutas}</p>
                </div>
                <div className="bg-teal/10 p-3 rounded-full">
                  <svg
                    className="h-6 w-6 text-teal"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"
                    ></path>
                  </svg>
                </div>
              </div>
              <div className="mt-4">
                <Link
                  href="/admin/rutas"
                  className="text-sm font-medium text-teal hover:underline"
                >
                  Ver todas las rutas
                </Link>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">Rutas Activas</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.rutasActivas}</p>
                </div>
                <div className="bg-green-100 p-3 rounded-full">
                  <svg
                    className="h-6 w-6 text-green-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M5 13l4 4L19 7"
                    ></path>
                  </svg>
                </div>
              </div>
              <div className="mt-4">
                <div className="bg-gray-100 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-green-500 h-full"
                    style={{
                      width: `${stats.totalRutas ? (stats.rutasActivas / stats.totalRutas) * 100 : 0}%`,
                    }}
                  ></div>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  {stats.totalRutas ? Math.round((stats.rutasActivas / stats.totalRutas) * 100) : 0}% del
                  total
                </p>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">
                    Solicitudes Pendientes
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {stats.solicitudesPendientes}
                  </p>
                </div>
                <div className="bg-yellow-100 p-3 rounded-full">
                  <svg
                    className="h-6 w-6 text-yellow-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    ></path>
                  </svg>
                </div>
              </div>
              <div className="mt-4">
                <Link
                  href="/admin/solicitudes"
                  className="text-sm font-medium text-yellow-600 hover:underline"
                >
                  Ver solicitudes pendientes
                </Link>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">
                    Solicitudes Completadas
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {stats.solicitudesCompletadas}
                  </p>
                </div>
                <div className="bg-blue-100 p-3 rounded-full">
                  <svg
                    className="h-6 w-6 text-blue-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                    ></path>
                  </svg>
                </div>
              </div>
              <div className="mt-4">
                <div className="text-sm text-gray-500">
                  {stats.solicitudesCompletadas} solicitudes procesadas
                </div>
              </div>
            </div>
          </div>

          {/* Secciones adicionales */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Actividad reciente */}
            <div className="bg-white rounded-lg shadow">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-medium text-gray-800">
                  Actividad Reciente
                </h2>
              </div>
              <div className="p-6">
                {actividadReciente.length === 0 ? (
                  <p className="text-gray-500 text-center py-4">No hay actividad reciente</p>
                ) : (
                  <ul className="space-y-4">
                    {actividadReciente.map((activity, index) => (
                      <li key={index} className="flex items-start">
                        <div
                          className={`flex-shrink-0 h-10 w-10 rounded-full flex items-center justify-center 
                          ${
                            activity.type === "solicitud"
                              ? "bg-yellow-100 text-yellow-600"
                              : activity.type === "ruta"
                              ? "bg-teal/10 text-teal"
                              : "bg-blue-100 text-blue-600"
                          }`}
                        >
                          {activity.type === "solicitud" ? (
                            <svg
                              className="h-5 w-5"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                              ></path>
                            </svg>
                          ) : activity.type === "ruta" ? (
                            <svg
                              className="h-5 w-5"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"
                              ></path>
                            </svg>
                          ) : (
                            <svg
                              className="h-5 w-5"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                              ></path>
                            </svg>
                          )}
                        </div>
                        <div className="ml-4">
                          <p className="text-sm font-medium text-gray-900">
                            {activity.description}
                          </p>
                          <p className="text-sm text-gray-500">{activity.time}</p>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
                <div className="mt-5">
                  <Link href="/admin/solicitudes" className="text-sm font-medium text-teal hover:underline">
                    Ver todas las solicitudes
                  </Link>
                </div>
              </div>
            </div>

            {/* Rutas populares */}
            <div className="bg-white rounded-lg shadow">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-medium text-gray-800">
                  Rutas Más Solicitadas
                </h2>
              </div>
              <div className="p-6">
                {rutasPopulares.length === 0 ? (
                  <p className="text-gray-500 text-center py-4">No hay datos de rutas disponibles</p>
                ) : (
                  <ul className="space-y-2">
                    {rutasPopulares.map((route, index) => (
                      <li key={index} className="py-2">
                        <div className="flex justify-between mb-1">
                          <span className="text-sm font-medium text-gray-700">
                            {route.route}
                          </span>
                          <span className="text-sm font-medium text-gray-700">
                            {route.count} solicitudes
                          </span>
                        </div>
                        <div className="bg-gray-100 h-2 rounded-full overflow-hidden">
                          <div
                            className="bg-teal h-full"
                            style={{ width: `${route.percent}%` }}
                          ></div>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
                <div className="mt-5">
                  <Link
                    href="/admin/rutas"
                    className="text-sm font-medium text-teal hover:underline"
                  >
                    Ver todas las rutas
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
} 