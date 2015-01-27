# global-game-jam-2015

## Clay together

![globalgamejam.org](http://globalgamejam.org/sites/default/files/styles/game_sidebar__wide/public/game/featured_image/splashpng_0.png?itok=IMu1chCw)

### Full info here:

http://globalgamejam.org/2015/games/clay-together

## The GGJ 2015 theme was "What do we do now?".

Clay together is a top down co-op puzzler.
Work together to solve puzzles, or go rouge to prevent your tema from completing hte puzzle for some fun.

## Playing Clay together

http://goo.gl/OGEUZL

or

http://ec2-54-66-193-144.ap-southeast-2.compute.amazonaws.com/play/

or

http://ec2-54-66-193-144.ap-southeast-2.compute.amazonaws.com:3000/play/

## Instructions

- To start playing you need to arrange with 3 others, a minimum of 4 players are needed to start playing.
- Share the game secret with all 4 players, enter the secret ont he main screen to start playing.
- Simple game messages let you know how many people are needed to start, and when the game has started.
- Each player controls 1 of the clayple (yes i mean clay people hehe) and as a team you must get the key to the door.
- All players must submit thier moves before they are all carried out at the same time, no one can see your move until it is done. Keeping to the theme that the team as a whole has to anticipate what the others will do to complete the puzzle.
- Build bridges, put out fires, and get that door unlocked!
- Most importantly, HAVE FUN

![in game image](http://globalgamejam.org/sites/default/files/styles/game_content__wide/public/games/screenshots/capture1_5.png?itok=jrOfDQe0)

# Techonolgy Used;

- Simple HTML
- JavaScript and jQuery
- Node.js server with Express.js framework and body-parser from npm.

## To run the game locally:

- Ensure no other local server is running (nginx or apache) on localhost port 3000.
- In the server folder run npm install
- Start the node.js server using the script: /server/server.js
- visit http://localhost:3000/play/ in any desktop browser.

# Droptime 

![hosted image](http://s6.postimg.org/xuuvi6ki9/droptime.png)

This game was not part of the submitted work for GGJ 2015 but if your keen to try it, go to;

http://ec2-54-66-193-144.ap-southeast-2.compute.amazonaws.com:3001/droptime/

Collect as many basketballs in your basket before the 1 minute timer runs out.

- Play using a mobile device only.
- First touch should enable FullScreen mode (with your permission).
- Some apple devices are not prompting for full screen permissions and therefore cannot run the game properly.
- Must be played landscape mode.
- Full Offline support: the Game will still load and work when wifi and mobile network are disabled.

## Techonolgy Used;

- phaser.io (http://phaser.io/)
- HTML5 .appcache (for offline support)
- HTML5 localstorage (with browser cookie fallback)

## To run the game locally:

### For best experience;

- Ensure no other local server is running (nginx or apache) on localhost port 3001.
- In the droptime folder run npm install
- Start the node.js server using the script server.js
- visit http://localhost:3001/droptime/ in any mobile phone browser, or desktop browser emulating a mobile broswer.
- go landscape and tap once to start in fullscreen.

### Alternative, no server method;

Open /droptime/client/index.html in any desktop browser capable of emulating a mobile browser.
