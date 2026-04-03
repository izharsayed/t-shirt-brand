const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';

async function apiFetch(path: string, options?: RequestInit) {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: { 'Content-Type': 'application/json', ...options?.headers },
    ...options,
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: res.statusText }));
    throw new Error(err.error || 'API error');
  }
  return res.json();
}

export const getProducts = (params?: Record<string, string>) => {
  const qs = params ? '?' + new URLSearchParams(params).toString() : '';
  return apiFetch(`/products${qs}`);
};

export const getProduct = (id: string) => apiFetch(`/products/${id}`);

export const getCart = (sessionId: string) => apiFetch(`/cart?session_id=${sessionId}`);

export const addToCart = (sessionId: string, productId: number, size: string, quantity = 1) =>
  apiFetch('/cart', {
    method: 'POST',
    body: JSON.stringify({ session_id: sessionId, product_id: productId, size, quantity }),
  });

export const updateCartItem = (id: number, quantity: number) =>
  apiFetch(`/cart/${id}`, { method: 'PATCH', body: JSON.stringify({ quantity }) });

export const removeCartItem = (id: number) =>
  apiFetch(`/cart/${id}`, { method: 'DELETE' });

export const createOrder = (data: Record<string, unknown>) =>
  apiFetch('/orders', { method: 'POST', body: JSON.stringify(data) });

export const getOrder = (id: string) => apiFetch(`/orders/${id}`);

export const login = (email: string, password: string) =>
  apiFetch('/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) });

export const register = (name: string, email: string, password: string) =>
  apiFetch('/auth/register', { method: 'POST', body: JSON.stringify({ name, email, password }) });

const getAuthHeaders = (): HeadersInit => {
  if (typeof window === 'undefined') return {};
  const token = localStorage.getItem('qadr_token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const getAdminStats = () => apiFetch('/admin/stats', { headers: getAuthHeaders() });
export const getAdminOrders = () => apiFetch('/admin/orders', { headers: getAuthHeaders() });
export const getAdminUsers = () => apiFetch('/admin/users', { headers: getAuthHeaders() });
export const updateOrderStatusAdmin = (id: number, status: string) => 
  apiFetch(`/admin/orders/${id}/status`, { method: 'PATCH', body: JSON.stringify({ status }), headers: getAuthHeaders() });

