# GEMINI.md

## Project Overview

This project is a theme named "ofusion" for the "maccms" content management system. The theme is designed to be modern and responsive, with a focus on providing a good user experience for video content. It includes features like a dark and light theme, a responsive layout, and a modern search bar.

The project uses a variety of technologies, including:

*   **HTML:** The structure of the theme is defined in HTML files located in the `html` directory. The HTML files use a templating engine to display dynamic content from the CMS.
*   **CSS:** The theme's styling is defined in CSS files located in the `css` directory. The CSS is written using modern techniques, including CSS variables for theming.
*   **JavaScript:** The theme uses JavaScript for interactive features like the theme switcher, the search bar, and the hero slider. The JavaScript files are located in the `js` directory.
*   **Node.js:** The project uses Node.js for development tasks like linting and CSS preprocessing. The project's dependencies and scripts are defined in the `package.json` file.

## Building and Running

The following commands can be used to build and run the project:

*   `npm install`: Installs the project's dependencies.
*   `npm run validate`: Runs the validation scripts, which include checking for inline styles and linting the CSS.
*   `npm run postcss:build`: Builds the CSS files using PostCSS and autoprefixer.

## Development Conventions

The project follows a number of development conventions, including:

*   **Separation of concerns:** The project enforces a strict separation of concerns between HTML, CSS, and JavaScript. Inline styles are not allowed in the HTML files.
*   **CSS linting:** The project uses Stylelint to lint the CSS files. The linting rules are defined in the `.stylelintrc.json` file.
*   **CSS preprocessing:** The project uses PostCSS and autoprefixer to preprocess the CSS files. This ensures that the CSS is compatible with a wide range of browsers.
*   **Git:** The project is managed using Git. The `.gitignore` file lists the files and directories that should be ignored by Git.
