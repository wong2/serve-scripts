## server-scripts

run server scripts in browser

![](http://doora.qiniudn.com/harVr.png)

### Install

`[sudo] npm install serve-scripts -g`

### Usage

you should provide a config file and run:

`serve-scripts config.json`

example config file:

```
{
  "title": "My Server Scripts",
  "auth": {
    "username": "xxxx",
    "password": "yyyy"
  }, // default to false, which is no auth (dangerous!)
  "commands": [
    {
      "name": "list all files",
      "command": "ls -al"
    }
  ]
}
```
