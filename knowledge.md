# MAC CMS v10 Template - OBlack Fusion Knowledge

## Project Overview

This is a modern, responsive template for MAC CMS v10 with a focus on performance and clean design. It's a front-end template project with HTML, CSS, and JavaScript files.

## Key Development Practices

- **CSS Architecture**: Uses BEM methodology for component naming
- **Utility-First**: Utility classes prefixed with `u-` (e.g., `u-text-center`)
- **Component Organization**: CSS organized in components/, layout/, pages/, utilities/
- **Validation**: Always run `npm run validate` after CSS changes to check inline styles and linting

## Development Workflow

1. Make changes to CSS/JS files
2. Run `npm run validate` to check for issues
3. Use `npm run postcss:build` for production builds with autoprefixer

## File Structure Notes

- `html/` contains template files organized by CMS sections (actor, art, vod, etc.)
- `css/default.css` is the main stylesheet
- `js/` contains modern JavaScript components for interactive elements
- Template follows MAC CMS v10 structure and conventions

## Important Commands

- `npm run guard:inline` - Validates inline styles in HTML
- `npm run lint:css` - Checks CSS for style issues
- `npm run validate` - Runs all validation checks (recommended after changes)
