// ============================================================
//  LeSAH · Vendor Service
//  All vendor DB + storage operations in one place.
// ============================================================

import { supabase } from './supabaseClient';

export const VENDOR_CATEGORIES = [
  { id: 'food',        label: 'Food & Drinks',    icon: '🍔' },
  { id: 'fashion',     label: 'Fashion',          icon: '👗' },
  { id: 'services',    label: 'Services',         icon: '🛠️' },
  { id: 'tech',        label: 'Tech & Repair',    icon: '💻' },
  { id: 'beauty',      label: 'Beauty & Hair',    icon: '💅' },
  { id: 'stationery',  label: 'Books & Stationery', icon: '📚' },
  { id: 'accommodation', label: 'Accommodation',  icon: '🏠' },
  { id: 'delivery',    label: 'Delivery',         icon: '🚚' },
  { id: 'other',       label: 'Other',            icon: '📦' },
];

// ---------- Vendor: read own profile ----------
export async function getMyVendorProfile() {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data, error } = await supabase
    .from('vendor_profiles')
    .select('*')
    .eq('id', user.id)
    .maybeSingle();

  if (error) throw error;
  return data;
}

// ---------- Vendor: create or update profile ----------
export async function saveVendorProfile(fields) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not logged in');

  const payload = {
    id: user.id,
    business_name: fields.business_name,
    category: fields.category,
    description: fields.description || null,
    phone: fields.phone || null,
    location: fields.location || null,
    student_id: fields.student_id || null,
    logo_url: fields.logo_url || null,
    status: 'pending',
    updated_at: new Date().toISOString(),
  };

  const { data, error } = await supabase
    .from('vendor_profiles')
    .upsert(payload)
    .select()
    .single();

  if (error) throw error;
  return data;
}

// ---------- Upload logo ----------
export async function uploadVendorLogo(file) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not logged in');

  const ext = (file.name.split('.').pop() || 'png').toLowerCase();
  const path = `${user.id}/logo-${Date.now()}.${ext}`;

  const { error: uploadError } = await supabase.storage
    .from('vendors')
    .upload(path, file, { upsert: true, cacheControl: '3600' });

  if (uploadError) throw uploadError;

  const { data: { publicUrl } } = supabase.storage.from('vendors').getPublicUrl(path);
  return publicUrl;
}

// ---------- Admin: list vendors by status ----------
export async function listVendors(status) {
  let query = supabase.from('vendor_profiles').select('*').order('created_at', { ascending: false });
  if (status) query = query.eq('status', status);
  const { data, error } = await query;
  if (error) throw error;
  return data || [];
}

// ---------- Admin: approve / reject ----------
export async function approveVendor(id, adminEmail) {
  const { error } = await supabase
    .from('vendor_profiles')
    .update({
      status: 'approved',
      approved_by: adminEmail,
      approved_at: new Date().toISOString(),
      rejection_reason: null,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id);
  if (error) throw error;
}

export async function rejectVendor(id, reason, adminEmail) {
  const { error } = await supabase
    .from('vendor_profiles')
    .update({
      status: 'rejected',
      rejection_reason: reason || null,
      approved_by: adminEmail,
      approved_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })
    .eq('id', id);
  if (error) throw error;
}

// ---------- Public: list approved vendors ----------
export async function listApprovedVendors() {
  const { data, error } = await supabase
    .from('vendor_profiles')
    .select('*')
    .eq('status', 'approved')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data || [];
}