# Windows Installation Guide 🪟

## Good News for Windows Users! 🎉

This app now uses **sql.js** (SQLite compiled to WebAssembly) instead of `better-sqlite3`, which means:

✅ **No Visual Studio required**
✅ **No C++ build tools needed**
✅ **No native compilation**
✅ **Just `npm install` and run!**

## Quick Start

### 1. Install Node.js

If you don't have Node.js installed:

1. Download from https://nodejs.org/ (get the LTS version)
2. Run the installer
3. Accept all defaults
4. Restart your terminal/command prompt

Verify installation:
```bash
node --version
npm --version
```

You should see version numbers like `v18.x.x` or higher.

### 2. Install Dependencies

Open Command Prompt or PowerShell in the project folder and run:

```bash
npm install
```

This should complete without errors! No Visual Studio needed.

### 3. Run the App

```bash
npm run electron:dev
```

The app will:
- Start Vite dev server
- Launch Electron
- Open with sample data
- Be ready to use!

## Common Windows Issues

### Issue: "npm not recognized"
**Solution**: Node.js isn't in your PATH. Restart your terminal or reinstall Node.js.

### Issue: "Port 5173 already in use"
**Solution**: Another app is using that port. Close it or change the port in `vite.config.ts`.

### Issue: Permission errors
**Solution**: 
- Don't run as Administrator unless necessary
- Make sure antivirus isn't blocking npm
- Try a different folder (not in Program Files)

### Issue: "Cannot find module"
**Solution**:
```bash
# Delete and reinstall
rmdir /s node_modules
npm install
```

## Database Location

The database is stored in your **browser's localStorage**, not as a file. This means:

- ✅ No file permission issues
- ✅ Persists between sessions
- ✅ Easy to reset (just clear localStorage)

To reset the database:
1. Open DevTools (F12)
2. Go to: Application → Local Storage
3. Delete the `productivityDb` entry
4. Refresh the page

## Development Tips

### Windows Terminal Commands

```bash
# Install dependencies
npm install

# Run in development mode
npm run electron:dev

# Verify setup
npm run verify

# Just run Vite (no Electron)
npm run dev
```

### Using PowerShell

If you're using PowerShell and see execution policy errors:

```powershell
Set-ExecutionPolicy -Scope CurrentUser -ExecutionPolicy RemoteSigned
```

Then run `npm install` again.

### Antivirus Issues

Some antivirus software (especially Windows Defender) may slow down `npm install`:

1. Add the project folder to exclusions temporarily
2. Run `npm install`
3. Remove from exclusions after install

## File Paths

Windows uses backslashes (`\`) but the app handles this automatically. All paths in the code use forward slashes (`/`) which work on both Windows and Unix systems.

## Editor Recommendations

For Windows development, we recommend:

1. **Visual Studio Code** (free)
   - Download: https://code.visualstudio.com/
   - Has built-in terminal
   - Great TypeScript support

2. **Windows Terminal** (free from Microsoft Store)
   - Modern terminal app
   - Better than Command Prompt
   - Supports tabs and themes

## Next Steps

Once installed successfully:

1. Read the [QUICKSTART.md](QUICKSTART.md) guide
2. Explore the app with sample data
3. Check out [README.md](README.md) for full docs
4. Start customizing!

## Need Help?

If you're still having issues:

1. Check that Node.js v18+ is installed: `node --version`
2. Make sure you're in the project directory
3. Try deleting `node_modules` and running `npm install` again
4. Check the error message carefully - it often tells you what's wrong

---

**No C++ compilers, no Visual Studio, no headaches - just install and run!** 🚀
