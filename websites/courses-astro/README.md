# Courses Website

Course materials, syllabi, reading lists, and assignments for Nick Vincent's courses at Simon Fraser University.

## Development

```bash
# Install dependencies
bun install

# Start dev server
bun run dev

# Build for production
bun run build

# Preview production build
bun run preview
```

## Deployment

This site deploys to GitHub Pages via the included GitHub Actions workflow.

**URL:** https://nickmvincent.github.io/courses/

## Content

Content is loaded from `../../content/courses/` and includes:

- **Courses** - Main course records
- **Syllabi** - Detailed course syllabi
- **Assignments** - Homework, projects, and exams
- **Reading Lists** - Curated readings by week/topic

## Adding Content

Add markdown files to the appropriate subdirectory in `content/courses/`:

```
content/courses/
├── *.md                 # Course records
├── syllabi/             # Course syllabi
├── assignments/         # Assignments
├── reading_lists/       # Reading lists
├── lectures/            # Lecture notes
└── resources/           # General resources
```

Each file needs YAML frontmatter matching the schema defined in `extenote/schemas/courses.yaml`.
