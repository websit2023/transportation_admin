// component
import SvgColor from '../../../components/svg-color';

// ----------------------------------------------------------------------

const icon = (name) => <SvgColor src={`/assets/icons/navbar/${name}.svg`} sx={{ width: 1, height: 1 }} />;

const navConfig = [
  {
    title: 'dashboard',
    path: '/dashboard/app',
    icon: icon('ic_analytics'),
  },
  {
    title: 'user',
    path: '/dashboard/user',
    icon: icon('ic_user'),
  },
  {
    title: 'route',
    path: '/dashboard/route',
    icon: icon('ic_route'),
  },
  {
    title: 'vehicle',
    path: '/dashboard/vehicle',
    icon: icon('ic_vehicle'),
  },
  {
    title: 'schedule',
    path: '/dashboard/schedule',
    icon: icon('ic_schedule'),
  }
];

export default navConfig;
