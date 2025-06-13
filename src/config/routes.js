import Dashboard from '@/components/pages/Dashboard';
import CurrentTrip from '@/components/pages/CurrentTrip';
import MyTrips from '@/components/pages/MyTrips';
import Explore from '@/components/pages/Explore';
import Settings from '@/components/pages/Settings';
import TripWizard from '@/components/pages/TripWizard';

export const routes = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    path: '/dashboard',
    icon: 'LayoutDashboard',
    component: Dashboard
  },
  {
    id: 'current-trip',
    label: 'Current Trip',
    path: '/current-trip',
    icon: 'MapPin',
    component: CurrentTrip
  },
  {
    id: 'my-trips',
    label: 'My Trips',
    path: '/my-trips',
    icon: 'Luggage',
    component: MyTrips
  },
  {
    id: 'explore',
    label: 'Explore',
    path: '/explore',
    icon: 'Compass',
    component: Explore
  },
  {
    id: 'settings',
    label: 'Settings',
    path: '/settings',
    icon: 'Settings',
    component: Settings
  },
  {
    id: 'trip-wizard',
    label: 'Trip Wizard',
    path: '/trip-wizard',
    icon: 'Wand2',
    component: TripWizard,
    hidden: true
  }
];