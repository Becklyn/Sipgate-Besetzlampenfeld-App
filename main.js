"use strict";

const electron = require('electron');
const fs = require("fs");
const Menu = electron.Menu;

const app = electron.app;
const BrowserWindow = electron.BrowserWindow;


function createWindow ()
{
    let mainWindow = new BrowserWindow({
        title: "Becklyn Studios Telefonanlage",
        width: 800,
        height: 600
    });
    mainWindow.loadURL("https://secure.live.sipgate.de/experiment/blf");
    let webContents = mainWindow.webContents;

    mainWindow.on('closed', () => mainWindow = null);

    webContents
        .on(
            "did-finish-load",
            () => {
                mainWindow.setTitle("Becklyn Telefonanlage");
                webContents.executeJavaScript(
                    fs.readFileSync(__dirname + "/src/page-adapter.js", {encoding: "utf-8"})
                );
            }
        );

    // Create the Application's main menu
    var template = [{
        label: "Becklyn Studios Telefonanlage",
        submenu: [
            { label: "Quit", accelerator: "Command+Q", click: function() { app.quit(); }}
        ]}, {
        label: "Edit",
        submenu: [
            { label: "Undo", accelerator: "CmdOrCtrl+Z", selector: "undo:" },
            { label: "Redo", accelerator: "Shift+CmdOrCtrl+Z", selector: "redo:" },
            { type: "separator" },
            { label: "Cut", accelerator: "CmdOrCtrl+X", selector: "cut:" },
            { label: "Copy", accelerator: "CmdOrCtrl+C", selector: "copy:" },
            { label: "Paste", accelerator: "CmdOrCtrl+V", selector: "paste:" },
            { label: "Select All", accelerator: "CmdOrCtrl+A", selector: "selectAll:" }
        ]}
    ];

    Menu.setApplicationMenu(Menu.buildFromTemplate(template));
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);

// Quit when all windows are closed.
app.on('window-all-closed', () => app.quit());
