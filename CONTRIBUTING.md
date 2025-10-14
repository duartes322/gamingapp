# Contributing to Productivity Quest

Thank you for your interest in contributing! This project was built as a learning resource for beginner programmers, so contributions at all skill levels are welcome.

## Getting Started

1. Fork the repository
2. Clone your fork: `git clone <your-fork-url>`
3. Install dependencies: `npm install`
4. Create a branch: `git checkout -b feature/your-feature-name`

## Development Workflow

1. Make your changes
2. Test thoroughly
3. Commit with clear messages: `git commit -m "Add: feature description"`
4. Push to your fork: `git push origin feature/your-feature-name`
5. Open a Pull Request

## Code Style

- Use TypeScript (no `any` types)
- Add comments for complex logic
- Follow the existing modular structure
- Use Tailwind CSS for styling
- Keep components focused and single-purpose

## Module Structure

When adding new features, follow this pattern:

```
src/modules/your-feature/
├── store.ts           # Zustand state management
├── types.ts           # TypeScript interfaces
├── calculations.ts    # Pure business logic functions
└── YourComponent.tsx  # React components
```

## Areas for Contribution

### Easy (Beginner-Friendly)
- Add new activity categories
- Improve UI styling and animations
- Add more level titles
- Enhance error messages
- Add tooltips and help text

### Medium
- Add data export (CSV/JSON)
- Create activity statistics page
- Add Pomodoro timer mode
- Implement dark mode toggle
- Add activity templates

### Advanced
- Cloud sync functionality
- Achievement system
- Advanced charts and analytics
- Performance optimizations
- Mobile responsive improvements

## Testing Your Changes

1. Run the app: `npm run electron:dev`
2. Test all affected features
3. Check for console errors
4. Verify database operations work correctly
5. Test edge cases

## Pull Request Guidelines

- Describe what your PR does
- Include screenshots for UI changes
- List any breaking changes
- Update README if adding features
- Keep PRs focused on one feature/fix

## Questions?

Feel free to open an issue for:
- Bug reports
- Feature requests
- Questions about the code
- Suggestions for improvements

## Code of Conduct

- Be respectful and constructive
- Help others learn
- Provide helpful feedback
- Celebrate successes

---

Happy coding! 🚀
