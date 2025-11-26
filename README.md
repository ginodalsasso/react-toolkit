# React Toolkit CLI

A command-line interface tool for managing reusable React components and utilities in your projects. Built with TypeScript, this CLI simplifies the process of adding, removing, and listing pre-built components and utilities from a centralized registry.

---

## Features

- **Component Management** - Add pre-configured React components to your project
- **Utility Functions** - Install helper functions and utilities
- **Smart Dependencies** - Automatically adds required dependencies to package.json
- **Configuration System** - Customizable paths and styling preferences
- **Registry Browser** - List and explore available components and utils
- **Diff comparison** - Compare your local code with the version from the registry.
- **Clean Removal** - Remove components and their associated files
- **Type-Safe** - Built with TypeScript for better developer experience

---

## Installation

### Local Development
```bash
# Clone the repository
git clone <repository-url>

# Navigate to the CLI directory
cd cli

# Install dependencies
npm install

# Build the CLI
npm run build
```

### Development Mode
```bash
# Run in development mode
npm run dev
```

---

## Usage

### Initialize Configuration

Before using the CLI, initialize your project configuration:
```bash
npm run dev -- init
```

**Configuration prompts:**
- **Components path**: Where to install components (default: `src/components`)
- **Utils path**: Where to install utilities (default: `src/utils`)
- **TypeScript**: Whether to use TypeScript (default: `true`)
- **Styling**: Choose between CSS Modules, CSS, or Tailwind CSS

Configuration is saved in `.my-cli.json` in your project root.

---

### List Available Items

View all available components and utilities:
```bash
# List everything
npm run dev -- list

# List only components
npm run dev -- list --components

# List only utilities
npm run dev -- list --utils
```

---

### Add Components or Utilities

Add items to your project:
```bash
# Add with interactive prompt
npm run dev -- add

# Add by name
npm run dev -- add button
npm run dev -- add dateToString
```

**The CLI will:**
1. Copy the files to your configured path
2. Add dependencies to your `package.json`
3. Prompt for confirmation before installation

> ⚠️ **Don't forget to run `npm install` after adding dependencies!**

---

### Remove Items

Remove installed components or utilities:
```bash
# Remove with interactive prompt
npm run dev -- remove

# Remove by name
npm run dev -- remove button
```

> **Note**: Dependencies are not automatically removed. Run `npm uninstall <package>` manually if needed.

---

## Project Structure
```
react-toolkit/
├── cli/
│   ├── src/
│   │   ├── commands/              # CLI commands
│   │   │   ├── add.ts            # Add command
│   │   │   ├── init.ts           # Init command
│   │   │   ├── list.ts           # List command
│   │   │   └── remove.ts         # Remove command
│   │   ├── types/                # TypeScript definitions
│   │   │   └── index.ts
│   │   ├── utils/                # Utility functions
│   │   │   ├── config.ts         # Configuration management
│   │   │   ├── dependencies.ts   # Package.json handling
│   │   │   ├── fileManager.ts    # File operations
│   │   │   ├── prompt.ts         # User prompts
│   │   │   ├── registry.ts       # Registry operations
│   │   │   └── validators.ts     # Input validation
│   │   └── index.ts              # CLI entry point
│   ├── package.json
│   ├── tsconfig.json
│   └── tsup.config.ts
├── registry/
│   ├── components/
│   │   └── Button/
│   │       ├── Button.tsx
│   │       ├── Button.module.css
│   │       └── meta.json
│   ├── utils/
│   │   └── dateToString/
│   │       ├── dateToString.ts
│   │       └── meta.json
│   └── registry.json             # Central registry
└── package.json
```

---

## Adding New Items to the Registry

### 1. Create the Component/Utility Files

Create a new folder in `registry/components/` or `registry/utils/`:
```
registry/components/YourComponent/
├── YourComponent.tsx
├── YourComponent.module.css
└── meta.json
```

### 2. Create meta.json
```json
{
  "name": "YourComponent",
  "type": "component",
  "description": "Brief description",
  "files": [
    "YourComponent.tsx",
    "YourComponent.module.css"
  ],
  "dependencies": ["react"],
  "devDependencies": ["@types/react"],
  "registryDependencies": [],
  "tags": ["ui", "custom"],
  "examples": [
    {
      "name": "Basic",
      "code": "<YourComponent />"
    }
  ]
}
```

### 3. Update registry.json

Add your item to `registry/registry.json`:
```json
{
  "components": {
    "yourcomponent": {
      "name": "YourComponent",
      "type": "component",
      "description": "Brief description",
      "files": ["YourComponent.tsx", "YourComponent.module.css"],
      "dependencies": ["react"],
      "devDependencies": ["@types/react"],
      "registryDependencies": [],
      "tags": ["ui", "custom"],
      "examples": [
        {
          "name": "Basic",
          "code": "<YourComponent />"
        }
      ]
    }
  }
}
```

---

## ⚙️ Configuration File (.my-cli.json)

Example configuration:
```json
{
  "componentsPath": "src/components",
  "utilsPath": "src/utils",
  "typescript": true,
  "styling": "css-modules"
}
```

**Options:**
- `componentsPath` - Path where components will be installed
- `utilsPath` - Path where utilities will be installed
- `typescript` - Enable TypeScript support
- `styling` - Styling solution: `css-modules`, `css`, or `tailwind-css`

---

## 🛠️ Technologies Used

| Technology | Purpose |
|------------|---------|
| **TypeScript** | Type-safe development |
| **Commander** | CLI framework |
| **Inquirer** | Interactive prompts |
| **Chalk** | Terminal styling |
| **Ora** | Loading spinners |
| **fs-extra** | Enhanced file system operations |
| **tsup** | TypeScript bundler |

---

## Security Features

- Path traversal protection
- Input validation and sanitization
- Confirmation prompts for destructive operations
- Safe file operations with existence checks

---

## 💻 Development

### Build
```bash
npm run build
```

### Run Locally
```bash
npm run dev -- <command>
```

### File Structure Conventions

- Commands go in `src/commands/`
- Utilities go in `src/utils/`
- Types go in `src/types/`
- Registry items go in `registry/components/` or `registry/utils/`


## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.