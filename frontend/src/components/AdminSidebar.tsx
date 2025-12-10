import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  Wallet, 
  Network, 
  Settings,
  LogOut
} from 'lucide-react';
import { useAuthStore } from '../store/authStore';

interface AdminSidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export const AdminSidebar: React.FC<AdminSidebarProps> = ({ isOpen = true, onClose }) => {
  const navigate = useNavigate();
  const { logout } = useAuthStore();

  const menuItems = [
    {
      path: '/dashboard',
      icon: LayoutDashboard,
      label: 'Tableau de bord'
    },
    {
      path: '/utilisateurs',
      icon: Users,
      label: 'Utilisateurs'
    },
    {
      path: '/caisses',
      icon: Wallet,
      label: 'Caisses'
    },
    {
      path: '/reseaux',
      icon: Network,
      label: 'Réseaux'
    },
    {
      path: '/comptes-services',
      icon: Settings,
      label: 'Comptes & Services'
    }
  ];

  return (
    <>
      {/* Overlay pour mobile */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 h-full bg-gradient-to-b from-blue-900 to-blue-800 text-white
          w-64 z-50 transform transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
          lg:translate-x-0 lg:static
        `}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="px-6 py-8 border-b border-blue-700">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center">
                <LayoutDashboard className="w-6 h-6 text-blue-900" />
              </div>
              <h1 className="text-xl font-bold">CHIFT ADMIN</h1>
            </div>
          </div>

          {/* Menu Items */}
          <nav className="flex-1 px-4 py-6">
            <ul className="space-y-2">
              {menuItems.map((item) => {
                const Icon = item.icon;
                return (
                  <li key={item.path}>
                    <NavLink
                      to={item.path}
                      onClick={onClose}
                      className={({ isActive }) =>
                        `flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200
                        ${
                          isActive
                            ? 'bg-blue-700 text-white shadow-lg'
                            : 'text-blue-100 hover:bg-blue-700/50 hover:text-white'
                        }`
                      }
                    >
                      <Icon className="w-5 h-5" />
                      <span className="font-medium">{item.label}</span>
                    </NavLink>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* Logout Button */}
          <div className="px-4 pb-6">
            <button
              onClick={() => {
                if (confirm('Êtes-vous sûr de vouloir vous déconnecter ?')) {
                  logout();
                  navigate('/login');
                }
              }}
              className="flex items-center gap-3 px-4 py-3 w-full rounded-lg text-blue-100 hover:bg-blue-700/50 hover:text-white transition-all duration-200"
            >
              <LogOut className="w-5 h-5" />
              <span className="font-medium">Se déconnecter</span>
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};
