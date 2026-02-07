import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  User, Package, MapPin, Settings, LogOut, ChevronRight,
  Clock, CheckCircle, Truck, XCircle, Edit2, Plus, Trash2,
  Mail, Phone, ArrowRight, X
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { Button } from '../components/UI/Button';
import { cn } from '@/lib/utils';
import { formatPrice } from '../context/CartContext';

// ===========================================
// TYPES
// ===========================================

interface Order {
  id: string;
  order_number: string;
  status: 'pending' | 'paid' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  payment_status: string;
  total: number;
  created_at: string;
  items_count?: number;
}

interface Address {
  id: string;
  label: string;
  name: string;
  street: string;
  city: string;
  postal_code: string;
  country: string;
  phone: string;
  is_default_shipping: boolean;
  is_default_billing: boolean;
}

type Tab = 'orders' | 'addresses' | 'settings';

// ===========================================
// STATUS HELPERS
// ===========================================

const statusConfig = {
  pending: { label: 'Čaká na platbu', color: 'amber', icon: Clock },
  paid: { label: 'Zaplatená', color: 'green', icon: CheckCircle },
  processing: { label: 'Spracováva sa', color: 'blue', icon: Package },
  shipped: { label: 'Odoslaná', color: 'purple', icon: Truck },
  delivered: { label: 'Doručená', color: 'green', icon: CheckCircle },
  cancelled: { label: 'Zrušená', color: 'red', icon: XCircle },
};

// ===========================================
// MAIN COMPONENT
// ===========================================

export const Account = () => {
  const navigate = useNavigate();
  const { user, profile, isAuthenticated, isLoading, signOut, updateProfile } = useAuth();

  const [activeTab, setActiveTab] = useState<Tab>('orders');
  const [orders, setOrders] = useState<Order[]>([]);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [isLoadingData, setIsLoadingData] = useState(true);

  // Settings form
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  // Address CRUD
  const [addressModalOpen, setAddressModalOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);
  const [addressForm, setAddressForm] = useState({
    label: '', name: '', street: '', city: '', postal_code: '', country: 'SK', phone: '', is_default_shipping: false,
  });
  const [isSavingAddress, setIsSavingAddress] = useState(false);
  const [deletingAddressId, setDeletingAddressId] = useState<string | null>(null);

  // Redirect if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate('/login', { state: { from: { pathname: '/ucet' } } });
    }
  }, [isAuthenticated, isLoading, navigate]);

  // Load profile data
  useEffect(() => {
    if (profile) {
      setName(profile.name || '');
      setPhone(profile.phone || '');
    }
  }, [profile]);

  // Fetch orders and addresses
  useEffect(() => {
    if (!user || !isSupabaseConfigured()) return;

    const fetchData = async () => {
      setIsLoadingData(true);
      
      try {
        // Fetch orders
        const { data: ordersData } = await supabase
          .from('orders')
          .select('id, order_number, status, payment_status, total, created_at')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(10);

        if (ordersData) setOrders(ordersData);

        // Fetch addresses
        const { data: addressesData } = await supabase
          .from('user_addresses')
          .select('*')
          .eq('user_id', user.id)
          .order('is_default_shipping', { ascending: false });

        if (addressesData) setAddresses(addressesData);

      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setIsLoadingData(false);
      }
    };

    fetchData();
  }, [user]);

  // Handle profile update
  const handleSaveSettings = async () => {
    setIsSaving(true);
    await updateProfile({ name, phone });
    setIsSaving(false);
  };

  // Handle sign out
  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  // === ADDRESS CRUD HANDLERS ===

  const openAddressModal = (address?: Address) => {
    if (address) {
      setEditingAddress(address);
      setAddressForm({
        label: address.label || '',
        name: address.name,
        street: address.street,
        city: address.city,
        postal_code: address.postal_code,
        country: address.country || 'SK',
        phone: address.phone || '',
        is_default_shipping: address.is_default_shipping,
      });
    } else {
      setEditingAddress(null);
      setAddressForm({ label: '', name: '', street: '', city: '', postal_code: '', country: 'SK', phone: '', is_default_shipping: false });
    }
    setAddressModalOpen(true);
  };

  const handleSaveAddress = async () => {
    if (!user || !isSupabaseConfigured()) return;
    if (!addressForm.name || !addressForm.street || !addressForm.city || !addressForm.postal_code) return;

    setIsSavingAddress(true);
    try {
      // Ak nastavujeme predvolenú, zrušíme ostatné
      if (addressForm.is_default_shipping) {
        await supabase
          .from('user_addresses')
          .update({ is_default_shipping: false })
          .eq('user_id', user.id);
      }

      if (editingAddress) {
        // UPDATE
        const { data, error } = await supabase
          .from('user_addresses')
          .update({
            label: addressForm.label || null,
            name: addressForm.name,
            street: addressForm.street,
            city: addressForm.city,
            postal_code: addressForm.postal_code,
            country: addressForm.country,
            phone: addressForm.phone || null,
            is_default_shipping: addressForm.is_default_shipping,
          })
          .eq('id', editingAddress.id)
          .eq('user_id', user.id)
          .select()
          .single();

        if (!error && data) {
          setAddresses(prev => prev.map(a => a.id === editingAddress.id ? data : a));
          // Ak sme nastavili predvolenú, odznačíme ostatné lokálne
          if (addressForm.is_default_shipping) {
            setAddresses(prev => prev.map(a => ({
              ...a,
              is_default_shipping: a.id === editingAddress.id,
            })));
          }
        }
      } else {
        // INSERT
        const { data, error } = await supabase
          .from('user_addresses')
          .insert({
            user_id: user.id,
            label: addressForm.label || null,
            name: addressForm.name,
            street: addressForm.street,
            city: addressForm.city,
            postal_code: addressForm.postal_code,
            country: addressForm.country,
            phone: addressForm.phone || null,
            is_default_shipping: addressForm.is_default_shipping,
          })
          .select()
          .single();

        if (!error && data) {
          if (addressForm.is_default_shipping) {
            setAddresses(prev => [...prev.map(a => ({ ...a, is_default_shipping: false })), data]);
          } else {
            setAddresses(prev => [...prev, data]);
          }
        }
      }

      setAddressModalOpen(false);
    } catch (error) {
      console.error('Error saving address:', error);
    } finally {
      setIsSavingAddress(false);
    }
  };

  const handleDeleteAddress = async (addressId: string) => {
    if (!user || !isSupabaseConfigured()) return;

    setDeletingAddressId(addressId);
    try {
      const { error } = await supabase
        .from('user_addresses')
        .delete()
        .eq('id', addressId)
        .eq('user_id', user.id);

      if (!error) {
        setAddresses(prev => prev.filter(a => a.id !== addressId));
      }
    } catch (error) {
      console.error('Error deleting address:', error);
    } finally {
      setDeletingAddressId(null);
    }
  };

  if (isLoading) {
    return (
      <main className="min-h-screen bg-[#F9F9F7] pt-32 pb-24 flex items-center justify-center">
        <div className="animate-spin text-4xl">⏳</div>
      </main>
    );
  }

  // ===========================================
  // TABS CONTENT
  // ===========================================

  const OrdersTab = () => (
    <div className="space-y-4">
      {orders.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl">
          <Package size={48} className="mx-auto text-gray-300 mb-4" />
          <h3 className="text-xl font-semibold text-brand-dark mb-2">Žiadne objednávky</h3>
          <p className="text-gray-500 mb-6">Zatiaľ ste nevytvorili žiadnu objednávku.</p>
          <Link to="/shop">
            <Button className="bg-brand-dark text-white hover:bg-brand-gold hover:text-brand-dark">
              Prejsť do obchodu
              <ArrowRight size={18} className="ml-2" />
            </Button>
          </Link>
        </div>
      ) : (
        orders.map((order) => {
          const status = statusConfig[order.status];
          const StatusIcon = status.icon;
          
          return (
            <motion.div
              key={order.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <h4 className="font-bold text-brand-dark">#{order.order_number}</h4>
                    <span className={cn(
                      "px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1",
                      status.color === 'amber' && "bg-amber-100 text-amber-700",
                      status.color === 'green' && "bg-green-100 text-green-700",
                      status.color === 'blue' && "bg-blue-100 text-blue-700",
                      status.color === 'purple' && "bg-purple-100 text-purple-700",
                      status.color === 'red' && "bg-red-100 text-red-700",
                    )}>
                      <StatusIcon size={14} />
                      {status.label}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500">
                    {new Date(order.created_at).toLocaleDateString('sk-SK', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric'
                    })}
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-xl font-bold text-brand-gold">
                    {formatPrice(order.total)}
                  </span>
                  <Link to={`/objednavka/${order.order_number}`}>
                    <Button variant="outline" size="sm" className="border-gray-200">
                      Detail
                      <ChevronRight size={16} />
                    </Button>
                  </Link>
                </div>
              </div>
            </motion.div>
          );
        })
      )}
    </div>
  );

  const AddressesTab = () => (
    <div className="space-y-4">
      {addresses.length === 0 && !isLoadingData && (
        <div className="text-center py-16 bg-white rounded-2xl">
          <MapPin size={48} className="mx-auto text-gray-300 mb-4" />
          <h3 className="text-xl font-semibold text-brand-dark mb-2">Žiadne adresy</h3>
          <p className="text-gray-500 mb-6">Pridajte si doručovaciu adresu pre rýchlejší checkout.</p>
        </div>
      )}

      {addresses.map((address) => (
        <div
          key={address.id}
          className={cn(
            "bg-white rounded-2xl p-6 shadow-sm relative",
            address.is_default_shipping && "ring-2 ring-brand-gold"
          )}
        >
          {address.is_default_shipping && (
            <span className="absolute top-4 right-4 px-2 py-1 bg-brand-gold text-brand-dark text-xs font-medium rounded-full">
              Predvolená
            </span>
          )}
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
              <MapPin size={20} className="text-gray-500" />
            </div>
            <div className="flex-1">
              <h4 className="font-semibold text-brand-dark">{address.label || 'Adresa'}</h4>
              <p className="text-gray-500 text-sm mt-1">
                {address.name}<br />
                {address.street}<br />
                {address.postal_code} {address.city}
              </p>
              {address.phone && (
                <p className="text-gray-400 text-xs mt-1">{address.phone}</p>
              )}
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => openAddressModal(address)}
                className="p-2 text-gray-400 hover:text-brand-gold transition-colors"
                title="Upraviť"
              >
                <Edit2 size={18} />
              </button>
              <button
                onClick={() => handleDeleteAddress(address.id)}
                disabled={deletingAddressId === address.id}
                className={cn(
                  "p-2 transition-colors",
                  deletingAddressId === address.id
                    ? "text-gray-300 cursor-not-allowed"
                    : "text-gray-400 hover:text-red-500"
                )}
                title="Zmazať"
              >
                <Trash2 size={18} />
              </button>
            </div>
          </div>
        </div>
      ))}

      <button
        onClick={() => openAddressModal()}
        className="w-full bg-white rounded-2xl p-6 border-2 border-dashed border-gray-200 hover:border-brand-gold transition-colors flex items-center justify-center gap-3 text-gray-500 hover:text-brand-dark"
      >
        <Plus size={20} />
        Pridať novú adresu
      </button>

      {/* ADDRESS MODAL */}
      <AnimatePresence>
        {addressModalOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-50"
              onClick={() => setAddressModalOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="fixed inset-x-4 top-[10%] md:inset-auto md:left-1/2 md:top-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:w-full md:max-w-lg bg-white rounded-2xl shadow-2xl z-50 overflow-hidden"
            >
              <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between">
                <h3 className="text-lg font-bold text-brand-dark">
                  {editingAddress ? 'Upraviť adresu' : 'Nová adresa'}
                </h3>
                <button onClick={() => setAddressModalOpen(false)} className="p-1 text-gray-400 hover:text-black">
                  <X size={20} />
                </button>
              </div>

              <div className="p-6 space-y-4 max-h-[60vh] overflow-y-auto">
                {/* Label */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Označenie (voliteľné)</label>
                  <input
                    type="text"
                    value={addressForm.label}
                    onChange={(e) => setAddressForm(f => ({ ...f, label: e.target.value }))}
                    placeholder="napr. Domov, Práca"
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:border-brand-gold outline-none transition-all text-sm"
                  />
                </div>

                {/* Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Meno a priezvisko *</label>
                  <input
                    type="text"
                    value={addressForm.name}
                    onChange={(e) => setAddressForm(f => ({ ...f, name: e.target.value }))}
                    placeholder="Ján Novák"
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:border-brand-gold outline-none transition-all text-sm"
                    required
                  />
                </div>

                {/* Street */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Ulica a číslo *</label>
                  <input
                    type="text"
                    value={addressForm.street}
                    onChange={(e) => setAddressForm(f => ({ ...f, street: e.target.value }))}
                    placeholder="Hlavná 123/A"
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:border-brand-gold outline-none transition-all text-sm"
                    required
                  />
                </div>

                {/* City + Postal Code */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Mesto *</label>
                    <input
                      type="text"
                      value={addressForm.city}
                      onChange={(e) => setAddressForm(f => ({ ...f, city: e.target.value }))}
                      placeholder="Bratislava"
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:border-brand-gold outline-none transition-all text-sm"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">PSČ *</label>
                    <input
                      type="text"
                      value={addressForm.postal_code}
                      onChange={(e) => setAddressForm(f => ({ ...f, postal_code: e.target.value }))}
                      placeholder="811 01"
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:border-brand-gold outline-none transition-all text-sm"
                      required
                    />
                  </div>
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Telefón (voliteľné)</label>
                  <input
                    type="tel"
                    value={addressForm.phone}
                    onChange={(e) => setAddressForm(f => ({ ...f, phone: e.target.value }))}
                    placeholder="+421 900 123 456"
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:border-brand-gold outline-none transition-all text-sm"
                  />
                </div>

                {/* Default Shipping */}
                <label className="flex items-center gap-3 cursor-pointer py-2">
                  <input
                    type="checkbox"
                    checked={addressForm.is_default_shipping}
                    onChange={(e) => setAddressForm(f => ({ ...f, is_default_shipping: e.target.checked }))}
                    className="w-5 h-5 rounded border-gray-300 text-brand-gold focus:ring-brand-gold"
                  />
                  <span className="text-sm text-gray-700">Nastaviť ako predvolenú doručovaciu adresu</span>
                </label>
              </div>

              <div className="px-6 py-4 border-t border-gray-100 flex justify-end gap-3">
                <button
                  onClick={() => setAddressModalOpen(false)}
                  className="px-5 py-2.5 text-sm text-gray-600 hover:text-gray-800 transition-colors"
                >
                  Zrušiť
                </button>
                <button
                  onClick={handleSaveAddress}
                  disabled={isSavingAddress || !addressForm.name || !addressForm.street || !addressForm.city || !addressForm.postal_code}
                  className={cn(
                    "px-6 py-2.5 text-sm font-medium rounded-xl transition-all",
                    isSavingAddress || !addressForm.name || !addressForm.street || !addressForm.city || !addressForm.postal_code
                      ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                      : "bg-brand-dark text-white hover:bg-brand-gold hover:text-brand-dark"
                  )}
                >
                  {isSavingAddress ? 'Ukladám...' : (editingAddress ? 'Uložiť zmeny' : 'Pridať adresu')}
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );

  const SettingsTab = () => (
    <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm">
      <h3 className="text-xl font-bold text-brand-dark mb-6">Osobné údaje</h3>
      
      <div className="space-y-6">
        {/* Email (readonly) */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
          <div className="relative">
            <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="email"
              value={user?.email || ''}
              disabled
              className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl bg-gray-50 text-gray-500"
            />
          </div>
          <p className="text-xs text-gray-400 mt-1">Email nie je možné zmeniť</p>
        </div>

        {/* Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Meno a priezvisko</label>
          <div className="relative">
            <User size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:border-brand-gold outline-none transition-all"
              placeholder="Ján Novák"
            />
          </div>
        </div>

        {/* Phone */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Telefón</label>
          <div className="relative">
            <Phone size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:border-brand-gold outline-none transition-all"
              placeholder="+421 900 123 456"
            />
          </div>
        </div>

        <Button
          onClick={handleSaveSettings}
          disabled={isSaving}
          className="bg-brand-dark text-white px-8 py-3 rounded-xl hover:bg-brand-gold hover:text-brand-dark"
        >
          {isSaving ? 'Ukladám...' : 'Uložiť zmeny'}
        </Button>
      </div>

      {/* Danger Zone */}
      <div className="mt-12 pt-8 border-t border-gray-100">
        <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-4">
          Nebezpečná zóna
        </h4>
        <button
          onClick={handleSignOut}
          className="flex items-center gap-2 text-red-500 hover:text-red-600 transition-colors"
        >
          <LogOut size={18} />
          Odhlásiť sa
        </button>
      </div>
    </div>
  );

  // ===========================================
  // RENDER
  // ===========================================

  return (
    <main className="min-h-screen bg-[#F9F9F7] pt-32 pb-24">
      <div className="container mx-auto px-6">
        
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-brand-dark mb-2">Môj účet</h1>
          <p className="text-gray-500">
            Vitajte späť, {profile?.name || user?.email}
          </p>
        </div>

        <div className="grid lg:grid-cols-4 gap-8">
          
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <nav className="bg-white rounded-2xl p-4 shadow-sm sticky top-32">
              {[
                { id: 'orders' as Tab, label: 'Objednávky', icon: Package },
                { id: 'addresses' as Tab, label: 'Adresy', icon: MapPin },
                { id: 'settings' as Tab, label: 'Nastavenia', icon: Settings },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={cn(
                    "w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all",
                    activeTab === tab.id
                      ? "bg-brand-gold/10 text-brand-dark font-semibold"
                      : "text-gray-500 hover:bg-gray-50 hover:text-brand-dark"
                  )}
                >
                  <tab.icon size={20} />
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>

          {/* Content */}
          <div className="lg:col-span-3">
            {activeTab === 'orders' && <OrdersTab />}
            {activeTab === 'addresses' && <AddressesTab />}
            {activeTab === 'settings' && <SettingsTab />}
          </div>
        </div>
      </div>
    </main>
  );
};
