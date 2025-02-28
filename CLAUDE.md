# TV Bingo Vue App Guidelines

## Project Commands
- `npm run dev`: Start development server
- `npm run build`: Type-check and build for production 
- `npm run preview`: Preview production build
- `vue-tsc --noEmit`: Run TypeScript type checking

## Code Style Guidelines
- **Components**: Use Vue 3 Composition API with `<script setup lang="ts">` 
- **Types**: Define interfaces in separate files under `src/types/`
- **Naming**:
  - Components: PascalCase (CreateShow.vue)
  - Variables/functions: camelCase
  - Types/interfaces: PascalCase
- **Imports**: Group in order of Vue, external libraries, local components, types
- **Services**: Business logic in dedicated service files under `src/services/`
- **Styling**: Use scoped CSS in components
- **Form handling**: Use `v-model` for form inputs with proper validation
- **Optional properties**: Use TypeScript optional chaining when accessing

## Application Structure
Components should be focused, reusable, and properly typed with TypeScript. Follow Vue best practices and maintain consistent styling throughout the application.