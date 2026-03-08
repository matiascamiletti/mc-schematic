# @mckit/schematics

`@mckit/schematics` es una colección de Angular Schematics diseñada para acelerar y facilitar el desarrollo de proyectos en Angular mediante la generación de código boilerplate, la configuración de funcionalidades y la implementación de patrones recurrentes.

## 🚀 Empezando (Getting Started)

### Instalación

Primero, asegúrate de tener instalado el Angular CLI. Si deseas usar los schematics globalmente para pruebas, también necesitarás `@angular-devkit/schematics-cli`.

```bash
npm install -g @angular-devkit/schematics-cli
```

Para instalar `@mckit/schematics` en tu proyecto:

```bash
npm install @mckit/schematics --save-dev
```

## 🛠 Schematics Disponibles (Generadores)

A continuación se detalla la lista de comandos disponibles provistos por este paquete. Puedes ejecutarlos usando el Angular CLI (`ng generate` o `ng g`).

### 1. `init`
Configura un proyecto nuevo con los ajustes base de MCKit.
```bash
ng generate @mckit/schematics:init
```

### 2. `add-login-page`
Configura y genera una página de inicio de sesión (Login/Sign-in) estándar para la aplicación.
```bash
ng generate @mckit/schematics:add-login-page
```

### 3. `install-layout-fuse`
Instala y configura la plantilla/layout de Fuse en la aplicación.
```bash
ng generate @mckit/schematics:install-layout-fuse
```

### 4. `addTable`
Genera un nuevo componente de tabla (Table) basado en un esquema o configuración predefinida.
```bash
ng generate @mckit/schematics:addTable
```

### 5. `set-tenant-backend`
Configura una arquitectura backend multi-tenant (multi-inquilino) para el proyecto.
```bash
ng generate @mckit/schematics:set-tenant-backend
```

### 6. `mc-schematic`
Un schematic en blanco utilizado como punto de partida.
```bash
ng generate @mckit/schematics:mc-schematic
```

## 💻 Desarrollo y Testing (Development & Testing)

Si deseas contribuir o probar los schematics de manera local.

### Pruebas Locales (Local Testing)
Puedes usar la herramienta de línea de comandos `schematics`, que actúa igual que el comando `generate` del Angular CLI, pero orientada al testing y soporte de modo debug.

Revisa la documentación con:
```bash
schematics --help
```

### Pruebas Unitarias (Unit Testing)
El proyecto usa Jasmine como entorno de pruebas. Para ejecutar las pruebas unitarias:
```bash
npm run test
```
Este comando compilará los archivos TypeScript y ejecutará los tests (`*_spec.ts`).

### Compilación (Build)
Para compilar los schematics manualmente (TypeScript a JavaScript):
```bash
npm run build
```

## 📦 Publicación (Publishing)

Para publicar una nueva versión de los schematics a NPM:

```bash
npm run build
npm publish
```

¡Asegúrate de incrementar la versión (`version`) en el archivo `package.json` antes de publicar!
