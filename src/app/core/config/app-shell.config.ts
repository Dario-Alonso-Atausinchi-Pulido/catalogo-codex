export interface NavigationItem {
  label: string;
  path: string;
}

export interface AppShellConfig {
  brand: string;
  tagline: string;
  navigation: NavigationItem[];
  footerNote: string;
}

export const APP_SHELL_CONFIG: AppShellConfig = {
  brand: 'ZONA DE JUEGOS',
  tagline: 'Elige tu siguiente partida y entra directo a la cabina.',
  navigation: [
    {
      label: 'Catalogo',
      path: '/catalog'
    }
  ],
  footerNote: 'Cada juego se integra como una feature aislada, con codigo y assets propios.'
};
