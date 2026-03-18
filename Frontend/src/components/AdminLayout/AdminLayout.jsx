import React, { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import AdminSidebar from '../AdminSidebar/AdminSidebar';
import '../../assets/admin-theme.css';

const AdminLayout = () => {
    useEffect(() => {
        // Adding class to body for global styles inside admin to not conflict if possible, but keeping it scoped is better
        document.body.classList.add('admin-body');
        return () => {
            document.body.classList.remove('admin-body');
        };
    }, []);

    return (
        <div className="admin-layout-wrapper">
            <AdminSidebar />
            <main className="admin-main-content">
                <Outlet />
            </main>
        </div>
    );
};

export default AdminLayout;
