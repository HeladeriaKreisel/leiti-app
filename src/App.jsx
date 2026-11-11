import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Toast from './components/Toast';
import DashboardView from './views/DashboardView';
import LecheDiaView from './views/LecheDiaView';
import MiFincaView from './views/MiFincaView';
import VentasView from './views/VentasView';
import ClientesView from './views/ClientesView';
import {
  getFincaData,
  saveFincaData,
  getRegistrosLeche,
  addRegistroLeche,
  getClientes,
  addCliente,
  deleteCliente,
  getVentas,
  addVenta,
  updateEstadoVenta
} from './services/supabaseService';
import { isSupabaseConfigured } from './lib/supabase';

export default function App() {
  const [currentTab, setCurrentTab] = useState('inicio');
  const [finca, setFinca] = useState(null);
  const [registros, setRegistros] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [ventas, setVentas] = useState([]);
  const [isSyncing, setIsSyncing] = useState(false);
  const [toast, setToast] = useState({ visible: false, title: '', message: '', type: 'success' });

  const showToast = (title, message, type = 'success') => {
    setToast({ visible: true, title, message, type });
    setTimeout(() => {
      setToast((prev) => ({ ...prev, visible: false }));
    }, 4000);
  };

  const loadData = async () => {
    setIsSyncing(true);
    try {
      const [fincaRes, registrosRes, clientesRes, ventasRes] = await Promise.all([
        getFincaData(),
        getRegistrosLeche(),
        getClientes(),
        getVentas()
      ]);

      if (fincaRes?.data) setFinca(fincaRes.data);
      if (registrosRes?.data) setRegistros(registrosRes.data);
      if (clientesRes?.data) setClientes(clientesRes.data);
      if (ventasRes?.data) setVentas(ventasRes.data);

      return true;
    } catch (err) {
      console.error('Error cargando datos:', err);
      showToast('Error', 'No se pudieron sincronizar los datos', 'error');
      return false;
    } finally {
      setIsSyncing(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSync = async () => {
    const ok = await loadData();
    if (ok) {
      showToast(
        'Sincronización Completa',
        isSupabaseConfigured ? 'Datos actualizados desde Supabase PostgreSQL.' : 'Datos actualizados desde almacenamiento local.'
      );
    }
  };

  const handleAddRegistro = async (nuevoRegistro) => {
    const res = await addRegistroLeche(nuevoRegistro);
    if (res?.data) {
      setRegistros((prev) => [res.data, ...prev]);
    }
    return res;
  };

  const handleSaveFinca = async (datosFinca) => {
    const res = await saveFincaData(datosFinca);
    if (res?.success) {
      setFinca(datosFinca);
    }
    return res;
  };

  const handleAddVenta = async (nuevaVenta) => {
    const res = await addVenta(nuevaVenta);
    if (res?.data) {
      setVentas((prev) => [res.data, ...prev]);
    }
    return res;
  };

  const handleToggleEstadoVenta = async (id, nuevoEstado) => {
    await updateEstadoVenta(id, nuevoEstado);
    setVentas((prev) => prev.map((v) => (v.id === id ? { ...v, estado: nuevoEstado } : v)));
    showToast('Estado Actualizado', `La remisión ahora está marcada como ${nuevoEstado === 'paid' ? 'Pagada' : 'Pendiente'}.`);
  };

  const handleAddCliente = async (nuevoCliente) => {
    const res = await addCliente(nuevoCliente);
    if (res?.data) {
      setClientes((prev) => [...prev, res.data]);
    }
    return res;
  };

  const handleDeleteCliente = async (id) => {
    await deleteCliente(id);
    setClientes((prev) => prev.filter((c) => c.id !== id));
    showToast('Cliente Eliminado', 'El cliente fue eliminado de Supabase.');
  };

  return (
    <div className="bg-background min-h-screen text-on-surface antialiased font-body-md selection:bg-secondary-container">
      <Sidebar
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        finca={finca}
        isConnected={isSupabaseConfigured}
      />

      <div className="pl-72 min-h-screen flex flex-col">
        <Header
          onSync={handleSync}
          isSyncing={isSyncing}
          isConnected={isSupabaseConfigured}
        />

        <main className="relative pt-24 w-full px-space-2xl py-space-xl flex-1 max-w-[1600px] mx-auto">
          {currentTab === 'inicio' && (
            <DashboardView
              finca={finca}
              registros={registros}
              ventas={ventas}
              onNavigate={setCurrentTab}
            />
          )}

          {currentTab === 'leche-del-dia' && (
            <LecheDiaView
              finca={finca}
              registros={registros}
              onAddRegistro={handleAddRegistro}
              onNotify={showToast}
            />
          )}

          {currentTab === 'mi-finca' && (
            <MiFincaView
              finca={finca}
              onSaveFinca={handleSaveFinca}
              onNotify={showToast}
            />
          )}

          {currentTab === 'ventas' && (
            <VentasView
              clientes={clientes}
              ventas={ventas}
              onAddVenta={handleAddVenta}
              onToggleEstadoVenta={handleToggleEstadoVenta}
              onNotify={showToast}
            />
          )}

          {currentTab === 'clientes' && (
            <ClientesView
              clientes={clientes}
              onAddCliente={handleAddCliente}
              onDeleteCliente={handleDeleteCliente}
              onNotify={showToast}
            />
          )}
        </main>
      </div>

      <Toast
        toast={toast}
        onClose={() => setToast((prev) => ({ ...prev, visible: false }))}
      />
    </div>
  );
}
