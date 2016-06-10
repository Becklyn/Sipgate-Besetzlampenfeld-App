Build during development
========================

```bash
npm start
```


Build for distribution
======================

Install `electron-packager`:
```bash
npm install -g electron-packager
```

And then run:
```bash
electron-packager . "Your app name" --platform=darwin --arch=x64
```
