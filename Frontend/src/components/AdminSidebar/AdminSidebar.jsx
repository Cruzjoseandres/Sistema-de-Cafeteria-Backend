import React from 'react';
import { NavLink } from 'react-router-dom';
import useAuthentication from '../../../hooks/useAuthentication';
import { getUserInfo } from '../../../utils/TokenUtilities';

const AdminSidebar = () => {
    const { doLogout } = useAuthentication();
    const userInfo = getUserInfo();
    const userName = userInfo?.persona ? `${userInfo.persona.nombre} ${userInfo.persona.apellido}` : userInfo?.username || "Admin User";
    const initial = userName.charAt(0).toUpperCase();

    return (
        <aside className="admin-sidebar">
            <div className="brand">
                <div className="brand-icon">
                    <span className="material-symbols-outlined" style={{ fontSize: '1.5rem' }}>coffee_maker</span>
                </div>
                <div>
                    <span className="brand-text">Cafeteria Admin</span>
                    <span className="brand-sub">Platform</span>
                </div>
            </div>

            <nav className="admin-nav">
                <NavLink to="/admin" end className={({ isActive }) => isActive ? "admin-nav-item active" : "admin-nav-item"}>
                    <span className="material-symbols-outlined">dashboard</span>
                    Panel de Control
                </NavLink>
                <NavLink to="/admin/productos" className={({ isActive }) => isActive ? "admin-nav-item active" : "admin-nav-item"}>
                    <span className="material-symbols-outlined">inventory_2</span>
                    Inventario
                </NavLink>
                <NavLink to="/admin/categorias" className={({ isActive }) => isActive ? "admin-nav-item active" : "admin-nav-item"}>
                    <span className="material-symbols-outlined">category</span>
                    Categorías
                </NavLink>
                <NavLink to="/admin/usuarios" className={({ isActive }) => isActive ? "admin-nav-item active" : "admin-nav-item"}>
                    <span className="material-symbols-outlined">badge</span>
                    Personal
                </NavLink>
                <NavLink to="/admin/reportes" className={({ isActive }) => isActive ? "admin-nav-item active" : "admin-nav-item"}>
                    <span className="material-symbols-outlined">bar_chart</span>
                    Reportes
                </NavLink>
                <NavLink to="/admin/mesas" className={({ isActive }) => isActive ? "admin-nav-item active" : "admin-nav-item"}>
                    <span className="material-symbols-outlined">table_restaurant</span>
                    Mesas
                </NavLink>
            </nav>

            <div className="admin-sidebar-footer" onClick={doLogout} style={{ cursor: 'pointer' }} title="Cerrar sesión">
                <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: 'var(--admin-panel-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', color: 'var(--admin-accent)', marginRight: '1rem' }}>
                    {initial}
                </div>
                <div className="user-info d-flex align-items-center justify-content-between w-100">
                    <span className="user-name text-truncate" style={{ maxWidth: '120px' }}>{userName}</span>
                    <span role="img" aria-label="logout" style={{ opacity: 0.6 }}>🚪</span>
                </div>
            </div>
        </aside>
    );
};

export default AdminSidebar;
