# Description 

Universal Music Player is extension that allows you to control web music players in the background.

Web Extension allow you to switch to the tab with the active player, toggle playing, switch to next and previous track if possble.

Also extension support hotkey commands:
- **command + shift + left** - next track
- **command + shift + right** - previous track
- **command + shift + up** - toggle playing
- **command + shift + I** - run native app

Native app supported only on OS X 10.13 and above.
Native app allows you to control player via media keys(next, prev, play/pause).

# Build 

## Web extension

```bash
# project root folder
cd firefox_extension
npm install
npx gulp build
```

## Native Mac OS app 

```bash
# project root folder
cd mac_os_companion_app
./build_main.sh
```

# Run extension 

1. To enable unsigned firefox extension enter ```about:debugging``` in browser address bar.
2. Select Load Temporally Add-on
3. Select manifest.json

The extension will be active until the next browser restart.