# steampath

![TEST](https://img.shields.io/endpoint?url=https://gist.githubusercontent.com/unLomTrois/04d82ee409900594c4dff542b597999d/raw/ steampath_coverage.json)

[![CI](https://github.com/unLomTrois/steampath/actions/workflows/ci.yml/badge.svg)](https://github.com/unLomTrois/steampath/actions/workflows/ci.yml)

An elegant and lightweight Node.js library to locate the Steam installation directory across different operating systems: **Windows**, **Linux**, and **macOS**.

## Features

-   **Cross-Platform Support**: Works seamlessly on Windows, Linux, and macOS.
-   **Automatic Detection**: Finds the Steam directory without any user configuration.
-   **Handles Multiple Install Scenarios**:
    -   Standard installations
    -   Flatpak and Snap installations on Linux
    -   System-wide and user-specific installations on macOS
-   **Asynchronous**: Utilizes modern async/await syntax for non-blocking operations.

## Installation

Install the package via npm:

```bash
npm install @unlomtrois/steampath
```

## Usage

Import the library and use the `locateSteamDir` function to get the Steam directory path:

```typescript
import { locateSteamDir } from "@unlomtrois/steampath";

(async () => {
    try {
        const steamDir = await locateSteamDir();
        console.log(`Steam is installed at: ${steamDir}`);
    } catch (error) {
        console.error(error.message);
    }
})();
```

### Platform-Specific Functions

If you need to target a specific operating system, you can use the platform-specific functions:

-   **Windows**: `locateSteamDirWindows()`
-   **Linux**: `locateSteamDirLinux()`
-   **macOS**: `locateSteamDirMacOS()`

```typescript
import { locateSteamDirWindows } from "@unlomtrois/steampath";

(async () => {
    try {
        const steamDir = await locateSteamDirWindows();
        console.log(`Steam is installed at: ${steamDir}`);
    } catch (error) {
        console.error(error.message);
    }
})();
```

## API

### `locateSteamDir(): Promise<string>`

Locates the Steam directory based on the current operating system.

-   **Returns**: A promise that resolves to the path of the Steam directory.
-   **Throws**: An error if the Steam directory is not found or the platform is unsupported.

### `locateSteamDirWindows(): Promise<string>`

Locates the Steam directory on a Windows system.

-   **Returns**: A promise that resolves to the path of the Steam directory.
-   **Throws**: An error if the Steam directory is not found in the registry.

### `locateSteamDirLinux(): Promise<string>`

Locates the Steam directory on a Linux system.

-   **Returns**: A promise that resolves to the path of the Steam directory.
-   **Throws**: An error if the Steam directory is not found.

### `locateSteamDirMacOS(): Promise<string>`

Locates the Steam directory on a macOS system.

-   **Returns**: A promise that resolves to the path of the Steam directory.
-   **Throws**: An error if the Steam directory is not found.

## Details

-   **Windows Implementation**:
    -   Queries the Windows Registry to find the Steam installation path.
    -   Supports both 32-bit and 64-bit registry hives.
-   **Linux Implementation**:
    -   Checks multiple common installation paths, including standard, Flatpak, and Snap directories.
    -   Uses parallel asynchronous checks for efficient detection.
-   **macOS Implementation**:
    -   Looks for the Steam directory in the user's `Library/Application Support` folder.
    -   Also checks the system-wide `Library/Application Support` directory.

## Acknowledgements

This library was inspired by steamlocate-rs. Some concepts have been adapted from this Rust library to build a Node.js compatible solution.

## Contributing

Contributions are welcome! Please open an issue or submit a pull request on GitHub.

## License

This project is licensed under the **MIT License**.

---

_Note: This library requires Node.js version **20** or higher to utilize the latest features and improvements in the `fs` module and asynchronous operations._
