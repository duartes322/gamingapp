# Quick Start Guide 🚀

Get your Productivity Quest app running in 3 simple steps!

## Step 1: Install Dependencies

Open your terminal in the project directory and run:

```bash
npm install
```

This will install all required packages. It may take a few minutes.

## Step 2: Start the App

Run the development version:

```bash
npm run electron:dev
```

The app will:
- Launch automatically
- Create a database with sample data
- Open with DevTools for debugging

## Step 3: Explore!

### Try These First:

1. **Check out the example data**
   - Pre-populated todos
   - 10 days of activity history
   - XP already earned (you should be Level 3-4!)
   - Active streak from sample data

2. **Test the timer**
   - Click "Start" on the timer
   - Let it run for 10-15 seconds
   - Click the "Save" button (disk icon)
   - Fill out the activity form
   - Watch your XP increase!

3. **Explore the calendar**
   - Scroll down to the calendar
   - See color-coded days from sample data
   - Click on a day to see activities

4. **Set your daily goal**
   - Click the settings icon on "Daily Goal" widget
   - Enter your desired minutes (e.g., 120 for 2 hours)
   - Click "Save"

## What's Next?

- Read the full [README.md](README.md) for detailed documentation
- Customize the app to your needs
- Start tracking your real productivity!

## Troubleshooting

**If the app doesn't start:**
1. Make sure Node.js is installed: `node --version`
2. Delete `node_modules` and run `npm install` again
3. Check for error messages in the terminal

**To reset the database:**
1. Close the app
2. Delete `productivity.db`
3. Restart the app - it will create fresh data

## Development Tips

- The app auto-reloads when you edit React code
- DevTools are open by default - check the Console tab for logs
- Database file is in the root directory: `productivity.db`

---

**Ready to level up? Happy coding! 🎮⚡**
