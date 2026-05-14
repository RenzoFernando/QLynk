# QLynk

QLynk es una aplicación web para crear, escanear y organizar códigos QR y enlaces desde una interfaz simple, visual y extensible. El objetivo del proyecto es evolucionar hacia una herramienta de QR vivos y enlaces cortos editables usando Firebase.

## Estado del proyecto

Fase 1: identidad y despliegue.

En esta fase se define la identidad inicial del proyecto, se prepara el despliegue en GitHub Pages y se deja documentada la integración futura con Firebase.

## Funcionalidades actuales

- Generación de QR para enlaces, texto, Wi-Fi, vCard, email, SMS, WhatsApp y ubicación.
- Personalización visual básica del QR.
- Escaneo con cámara.
- Escaneo desde imagen.
- Biblioteca local con exportación e importación JSON.
- Temas visuales.
- Modo privado para evitar guardar elementos en el historial.

## Funcionalidades planeadas

- Enlaces cortos usando Firebase.
- QR vivos con destino editable.
- Biblioteca inteligente con búsqueda, filtros, favoritos y etiquetas.
- Personalización avanzada con logo central.
- Mejoras visuales de interfaz y experiencia de usuario.
- Configuración futura de Firebase mediante variables de entorno.

## Stack técnico

- React
- TypeScript
- Vite
- qrcode.react
- html5-qrcode
- GitHub Pages
- Firebase / Firestore en fases futuras

## Requisitos

- Node.js 18 o superior recomendado.
- npm.

## Instalación local

```bash
npm install
npm run dev
```

## Scripts disponibles

```bash
npm run dev
npm run build
npm run lint
npm run preview
```

## Build

```bash
npm run build
npm run preview
```

## Despliegue en GitHub Pages

El proyecto está preparado para desplegarse con GitHub Pages usando GitHub Actions.

La configuración actual asume que el repositorio se llama:

```txt
qlynk
```

Por eso `vite.config.ts` usa:

```ts
base: '/qlynk/'
```

Si el repositorio conserva otro nombre, ese valor debe coincidir con el nombre real del repositorio.

Para activar el despliegue:

1. Sube el proyecto a GitHub.
2. Entra a Settings > Pages.
3. En Build and deployment, selecciona GitHub Actions.
4. Haz push a la rama `main`.
5. GitHub Actions construirá el proyecto y publicará la carpeta `dist`.

## Firebase

Firebase no está conectado en esta fase.

Más adelante se usará para:

- Guardar enlaces cortos.
- Resolver slugs.
- Permitir QR vivos.
- Guardar destinos editables.
- Contar clics básicos.
- Activar o desactivar enlaces.

## Roadmap

### Fase 1 — Identidad y despliegue

- Cambiar nombre a QLynk.
- Cambiar subtítulo.
- Preparar GitHub Pages.
- Crear workflow de GitHub Actions.
- Actualizar README.
- Mover GitHub al footer.
- Reducir el footer.
- Renombrar navegación inicial.

### Fase 2 — Rediseño de interfaz

- Mejorar layout general.
- Crear preview estable.
- Reorganizar la experiencia de creación.
- Diseñar componentes reutilizables.

### Fase 3 — QR Pro

- Mejorar formularios de contenido.
- Agregar logo central.
- Mejorar personalización visual.
- Mejorar validaciones.

### Fase 4 — Short Links y QR vivos

- Conectar Firebase.
- Crear enlaces cortos.
- Permitir edición de destino.
- Crear QR vivos.

## Autor

© Renzo Fernando. Todos los derechos reservados.
