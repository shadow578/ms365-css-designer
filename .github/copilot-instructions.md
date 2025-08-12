# M365 Custom CSS Designer

M365 Custom CSS Designer is a Next.js web application that allows you to visually design custom CSS for Microsoft's sign-in page. The application provides both a visual designer interface and a code editor (Monaco) for creating and testing CSS customizations.

**Project Purpose**: Microsoft provides documentation for custom CSS but no tools for designing it. This application makes CSS customization accessible to non-technical users while providing advanced editing capabilities for developers.

**Licensing**: All files are licensed under MIT License except `src/components/ms/` directory. Be aware of this distinction when working with Microsoft sign-in page components.

Always reference these instructions first and fallback to search or bash commands only when you encounter unexpected information that does not match the info here.

## Working Effectively

- Bootstrap, build, and test the repository:
  - `cp .env.ci .env` -- copy the CI environment file for local development
  - `npm ci` -- install dependencies (takes ~2 minutes). NEVER CANCEL. Set timeout to 180+ seconds.
  - `npm run check` -- runs linting and type checking (takes ~6 seconds)
  - `npm run test` -- runs Jest test suite (takes ~3 seconds)
  - `npm run build` -- creates production build (takes ~45 seconds). NEVER CANCEL. Set timeout to 120+ seconds.

- Run the development server:
  - ALWAYS run the bootstrapping steps first (copy .env file and npm ci)
  - `npm run dev` -- starts development server on http://localhost:3000 (ready in ~2 seconds)
  - Access the application at http://localhost:3000

- Run production preview:
  - `npm run preview` -- builds and starts production server (build takes ~7-45 seconds depending on cache)

## Validation

- Always manually validate any new code by testing the web application functionality
- ALWAYS run through at least one complete end-to-end scenario after making changes:
  1. Start the development server with `npm run dev`
  2. Open http://localhost:3000 in a browser
  3. Click "I understand" to dismiss the warning dialog
  4. Click "Add Selector" and choose a selector (e.g., "Sign-in Box")
  5. Verify the selector appears with "No Properties set"
  6. Test switching between "CSS Designer" and "CSS Editor" modes
  7. Test the language switcher functionality (English/German)
- You can build and run the application successfully. The Monaco editor may have CDN loading issues in restricted environments but core functionality works.
- Always run `npm run format:write` and `npm run lint:fix` before you are done or the CI (.github/workflows/ci.yaml) will fail.

## Common Tasks

The following are outputs from frequently run commands. Reference them instead of viewing, searching, or running bash commands to save time.

### Repo root
```
ls -al
.assets/
.env.ci
.env.example
.git/
.github/
.gitignore
.vscode/
LICENSE
README.md
additional.d.ts
eslint.config.js
icon.inkscape.svg
jest.config.js
messages/
next.config.ts
package-lock.json
package.json
prettier.config.js
public/
src/
tsconfig.json
```

### package.json scripts
```json
{
  "scripts": {
    "build": "next build",
    "check": "next lint && tsc --noEmit",
    "dev": "next dev",
    "format:check": "prettier --check \"**/*.{ts,tsx,js,jsx,mdx}\" --cache",
    "format:write": "prettier --write \"**/*.{ts,tsx,js,jsx,mdx}\" --cache",
    "lint": "next lint",
    "lint:fix": "next lint --fix",
    "preview": "next build && next start",
    "start": "next start",
    "typecheck": "tsc --noEmit",
    "test": "jest",
    "test:watch": "jest --watch"
  }
}
```

### src/ directory structure
```
src/
├── app/                    # Next.js App Router pages
│   ├── api/               # API routes (tRPC and proxy)
│   ├── converged-signin-page/ # Microsoft sign-in page simulation
│   ├── layout.tsx         # Root layout
│   └── page.tsx          # Home page
├── components/            # React components
│   ├── designer/         # CSS Designer component logic
│   ├── ms/              # Microsoft UI components
│   └── ui/              # Shared UI components
├── i18n/                # Internationalization config
├── server/              # tRPC server setup
├── trpc/               # tRPC client setup
└── util/               # Utility functions
```

### Environment setup
- Node.js: Supports v20.19.4+ (CI uses v22.18)
- Package manager: npm (specified in package.json as npm@11.5.2)
- Environment file: Copy `.env.ci` to `.env` for local development
- Required environment variables:
  - `ASSET_PROXY_SECRET="your_secret_here"`
  - `CORS_ORIGIN="https://example.com"`

### Key technologies
- Next.js 15.4.6 with App Router
- TypeScript with strict configuration
- Chakra UI for component library
- Monaco Editor for code editing (CDN-loaded)
- tRPC for type-safe API calls
- Jest for testing with jsdom environment
- next-intl for internationalization (English/German)
- ESLint with TypeScript support
- Prettier for code formatting

### Testing information
- Test files: Located in same directories as source files with `.test.ts` extension
- Current test suites: 4 test suites with 77 passing tests
- Test runner: Jest with Next.js integration
- Test environment: jsdom for browser simulation
- Coverage: Uses v8 coverage provider

### Build timing expectations
- `npm ci`: ~2 minutes (120 seconds) -- NEVER CANCEL. Set timeout to 180+ seconds.
- `npm run lint`: ~10 seconds
- `npm run format:check`: ~1 second
- `npm run typecheck`: ~7 seconds  
- `npm run test`: ~3 seconds
- `npm run build`: ~45 seconds (first build) or ~7 seconds (cached) -- NEVER CANCEL. Set timeout to 120+ seconds.
- `npm run dev`: ~2 seconds to start
- `npm run check`: ~6 seconds (combines lint + typecheck)

### CI/CD Information
- CI pipeline: `.github/workflows/ci.yaml`
- CI steps: lint → format → typecheck → test → build
- Node.js version in CI: 22.18 LTS
- All CI steps must pass for successful builds
- Always run `npm run format:write` and `npm run lint:fix` before committing

### CSS Designer Architecture (`src/components/designer/`)

The CSS Designer is an extensible component for editing CSS styles using a design wizard. Understanding its architecture is crucial for extending functionality.

#### Core Concepts
The designer uses a definition-based architecture with these key components:

| Component   | File                              | Description                                                                                                                  |
| ----------- | --------------------------------- | ---------------------------------------------------------------------------------------------------------------------------- |
| `selector`  | `./definitions/selectors.ts`      | Defines CSS selectors that can be edited. Each selector has a list of **properties** that can be edited.                   |
| `property`  | `./definitions/properties.ts`     | Defines CSS properties that can be edited. Each property has a **kind** that defines its behavior.                          |
| `kind`      | `./definitions/kinds.ts`          | Defines the data structure for property values. Provides the basis for both **generators** and **controls**.               |
| `generator` | `./definitions/generators.ts`     | Defines how CSS is generated for each property type.                                                                        |
| `control`   | `./components/controls/index.tsx` | Defines how properties are represented in the designer UI.                                                                  |

#### Adding New Components

**Adding a new CSS selector:**
1. Open `src/components/designer/definitions/selectors.ts`
2. Add definition to the `SELECTORS` record (key = CSS selector like `.foo`)
3. Define all editable properties in the `properties` array
4. Add translations to `messages/[language].json` files

**Adding a new CSS property:**
1. Open `src/components/designer/definitions/properties.ts`  
2. Add property definition to `PROPERTIES` object (key = CSS property name)
3. Specify the `kind` to define behavior and UI representation
4. Special case: Use `$` delimiter for pseudo-classes (e.g., `color$:hover`)
5. Add translations to `messages/[language].json` files

**Adding a new property kind:**
1. Open `src/components/designer/definitions/kinds.ts`
2. Add new kind and schema to `PROP_SCHEMA_BY_KIND` object
3. Create new type/interface in `./definitions/properties.ts`
4. Update `CSSPropertyOptionsForKind` and `CSSPropertyKinds` helper types
5. Add control component in `./components/controls/index.tsx`
6. Add CSS generator in `./definitions/generators.ts`
7. Add test case in `./generator.test.ts`

#### Testing Requirements
- Always add test cases for new generators in `./generator.test.ts`
- Test CSS generation logic for new property kinds
- Refer to existing tests for structure and patterns

### Common Development Scenarios
- Adding new CSS selectors: Follow CSS Designer architecture above
- Adding new CSS properties: Follow CSS Designer architecture above  
- Modifying the designer UI: Edit files in `src/components/designer/`
- Adding new translations: Edit `messages/en.json` and `messages/de.json`
- Updating Microsoft sign-in page simulation: Edit `src/components/ms/signin.tsx`
- API changes: Edit files in `src/app/api/` and `src/server/`

### Microsoft Sign-in Page Components (`src/components/ms/`)
- **Important**: These are adapted components from Microsoft's actual converged sign-in page
- Source: Fetched from office.com login flow on July 22, 2025
- Key files:
  - `signin.tsx`: Converted from HTML to JSX using transform.tools, with additional adjustments for React integration
  - `signin.css`: Original Microsoft CSS included as-is
  - `README.md`: Contains important context about source, security implications, and ethical considerations
- **Security note**: These components enable realistic Microsoft sign-in page simulation - refer to `src/components/ms/README.md` for ethical considerations

### Debugging
- VS Code launch configuration available in `.vscode/launch.json`
- Debug command: "Next.js: debug server-side" runs `npm run dev`
- Development server includes Next.js Dev Tools and error overlay
- Browser console shows React DevTools suggestion and Vercel analytics (blocked in restricted environments)