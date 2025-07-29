# Bouzu UI

[![Node.js >= 20.17.0](https://img.shields.io/badge/Node.js-%3E=20.17.0-grey?labelColor=black)](https://nodejs.org) 
[![NPM >= 11.1.0](https://img.shields.io/badge/npm-%3E=11.1.0-grey?labelColor=black)](https://www.npmjs.com/)
[![Nuxt >= 3.15.4](https://img.shields.io/badge/Nuxt.js-%3E=3.15.4-grey?labelColor=black)](https://nuxt.com)

A comprehensive UI component library for Nuxt.js applications, providing reusable components, composables, and utilities.

## Features

- **Components**: Ready-to-use Vue components for common UI patterns
- **Composables**: Reusable Vue composables for state management and utilities
- **SCSS Variables & Mixins**: Consistent styling system with variables and mixins
- **TypeScript Support**: Full TypeScript support with type definitions
- **Nuxt 3 Compatible**: Built specifically for Nuxt 3 applications

## Installation

### From GitHub Packages

```bash
npm install @yuichi-bouzu-ishihara/ui
```

### From Local Development

For testing local changes:

1. Clone this repository
2. Navigate to the desired version tag
3. Run `npm run release:local`
4. Check that `/packs/bouzu-ui-{package.version}.tgz` is generated
5. In your target project, run: `npm i {path}/ui/packs/bouzu-ui-{package.version}.tgz`

## Quick Setup

### 1. Install the Package

```bash
npm install @yuichi-bouzu-ishihara/ui
```

### 2. Add to Nuxt Config

```typescript
// nuxt.config.ts
export default defineNuxtConfig({
  modules: [
    '@yuichi-bouzu-ishihara/ui'
  ]
})
```

### 3. Start Using Components

```vue
<template>
  <div>
    <BouzuButton>Click me</BouzuButton>
    <BouzuIcon name="arrowRight" />
  </div>
</template>
```

## Available Components

### Elements
- `BouzuButton` - Button component with various styles
- `BouzuIcon` - Icon component with custom icon support
- `BouzuAvatar` - Avatar component with image fallback
- `BouzuTypography` - Typography component for consistent text styling
- `BouzuSpinner` - Loading spinner component
- `BouzuLogo` - Logo component

### Forms
- `BouzuInput` - Input field component
- `BouzuSelect` - Select dropdown component
- `BouzuCheckbox` - Checkbox component
- `BouzuSwitch` - Toggle switch component
- `BouzuTextarea` - Textarea component

### Layout
- `BouzuContainer` - Container component for layout
- `BouzuRow` - Row component for grid layouts
- `BouzuColumn` - Column component for grid layouts
- `BouzuBox` - Box component for spacing and layout

### Overlays
- `BouzuModal` - Modal dialog component
- `BouzuDrawer` - Drawer/sidebar component
- `BouzuSheet` - Bottom sheet component
- `BouzuToast` - Toast notification component
- `BouzuTooltip` - Tooltip component

## Available Composables

- `useBouzuAuth()` - Authentication utilities
- `useBouzuColor()` - Color management
- `useBouzuBreakPoint()` - Responsive breakpoint utilities
- `useBouzuStorage()` - Local storage utilities
- `useBouzuScroll()` - Scroll event utilities
- `useBouzuViewport()` - Viewport utilities

## SCSS Variables & Mixins

The package includes a comprehensive SCSS system:

```scss
// Import the main styles
@import '@yuichi-bouzu-ishihara/ui/scss/style';

// Use variables
.my-component {
  color: $bouzu-primary-color;
  font-size: $bouzu-font-size-base;
}

// Use mixins
.responsive-element {
  @include bouzu-responsive(md) {
    font-size: 1.2rem;
  }
}
```

## Development

### Prerequisites

- Node.js >= 20.17.0
- npm >= 11.1.0
- Nuxt >= 3.15.4

### Local Development

```bash
# Install dependencies
npm install

# Generate type stubs
npm run dev:prepare

# Start development server
npm run dev

# Build the playground
npm run dev:build

# Run linting
npm run lint

# Run tests
npm run test
npm run test:watch

# Create local package
npm run release:local
```

### Testing in Other Projects

1. In this repository: `npm link`
2. In your target project: `npm link @yuichi-bouzu-ishihara/ui`

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

MIT License - see [LICENSE](LICENSE) for details.

## Support

For issues and questions:
- [GitHub Issues](https://github.com/yuichi-bouzu-ishihara/ui/issues)
- [GitHub Discussions](https://github.com/yuichi-bouzu-ishihara/ui/discussions)
