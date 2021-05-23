## Set-up

- Install NodeJS from https://nodejs.org/. Must be version 14 or greater.
- On windows, install git with https://gitforwindows.org/.
- In your terminal, type
```
git clone https://github.com/nupanick/nupa-bot.git
```
- This will download the code to a subdirectory named `nupa-bot`. Switch to this directory, then run these commands once:
```
npm install
npm start
```
- Type Ctrl-c to quit the program.
- A file called "config.json" should be generated. **Do not commit this file!**

## Unit Tests

```
npm test
```

## Run in offline mode (local terminal)

```
npm start
```

## Run in discord mode

```
npm run discord
```