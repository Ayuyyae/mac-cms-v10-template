# MAC CMS v10 Template - OBlack Fusion

A modern, responsive template for MAC CMS v10 with a focus on performance and clean design.

## Features

- Responsive design that works on all devices
- Modern UI components and styling
- Optimized for MAC CMS v10
- BEM methodology for CSS organization
- Utility-first CSS approach for rapid development
- Autoprefixer support for cross-browser compatibility

## Project Structure

```
.
├── css/
│   ├── components/     # Reusable UI components
│   ├── layout/         # Layout specific styles
│   ├── pages/          # Page specific styles
│   ├── utilities/      # Utility classes
│   └── default.css     # Base styles
├── html/               # Template files organized by section
├── js/                 # JavaScript files for interactive elements
├── images/             # Image assets
└── ads/                # Advertisement scripts
```

## Installation

1. Download the template files
2. Upload to your MAC CMS v10 installation
3. Activate the template in your CMS admin panel

## Development

### Prerequisites

- Node.js
- npm

### Setup

1. Clone the repository
2. Run `npm install` to install dependencies

### Available Scripts

- `npm run guard:inline` - Validates inline styles
- `npm run lint:css` - Lints CSS files
- `npm run postcss:build` - Processes CSS with PostCSS and Autoprefixer
- `npm run validate` - Runs all validation checks

### CSS Architecture

This template follows the BEM (Block Element Modifier) methodology for component naming and a utility-first approach for rapid development:

- Component classes follow the pattern: `block__element--modifier`
- Utility classes are prefixed with `u-` (e.g., `u-text-center`)

## Customization

You can customize the template by modifying the CSS files in the `css/` directory. The template is organized to make it easy to change colors, typography, and layout without affecting the core functionality.

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a pull request

## Author

- **oblack** - Initial work

## Version

1.0.0

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details if available.