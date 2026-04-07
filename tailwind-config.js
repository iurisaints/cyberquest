/* Configuração do tema Tailwind (CDN) — cores msg/key/ciph e fonte mono */
tailwind.config = {
  theme: {
    extend: {
      colors: {
        msg: { DEFAULT: '#2563eb', dim: '#1d4ed8' },
        key: { DEFAULT: '#dc2626', dim: '#b91c1c' },
        ciph: { DEFAULT: '#16a34a', dim: '#15803d' },
      },
      fontFamily: {
        mono: ['JetBrains Mono', 'ui-monospace', 'monospace'],
      },
    },
  },
};
