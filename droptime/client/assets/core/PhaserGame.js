window.onload = function() {
  (function (window, undefined) {
    "use scrict";
    // get dimensions of the window considering retina displays
    var currentLevel = 1,
        w = window.innerWidth,
        h = window.innerHeight,
        width = h > w ? h : w,
        height = h > w ? w : h,
        game = new Phaser.Game(
          window.innerWidth,
          window.innerHeight,
          Phaser.CANVAS,
          'game'
        );

    /**
     * Class definition
     *
     * @class PhaserGame
     */
    var PhaserGame = function (game) {
      this.live = false;
      this.currentLevel = currentLevel;
      this.paddle = null;
      this.stageConfig = null;
      this.userPoints = 0;
      this.stageTimer = 0;
      this.stageTimerMultiplier = 30;
      this.difficaulty = 0.5;
      this.stageTimerInterval;
      this.introText = null;
      this.scoreText = null;
      this.timerText = null;
      this.loadedItem = null;
      this.liveItems = [];
    }
    PhaserGame.prototype = {
      init: function () {
        this.game.renderer.renderSession.roundPixels = true;
        this.game.world.setBounds(0, 0, w, h);
        this.physics.startSystem(Phaser.Physics.ARCADE);
        this.physics.arcade.gravity.y = 350;
      },
      preload: function () {
        var self = this,
            loader = new Phaser.Loader(this);
        loader.text('stage-' + this.currentLevel, 'assets/stage/' + this.currentLevel + '/config.json');
        loader.onLoadComplete.addOnce(function(){
          self.stageConfig = JSON.parse(self.cache.getText('stage-' + self.currentLevel));
          self.load.image('item', self.stageConfig.item.img);
          self.loadedItem = self.stageConfig.item;
        });
        loader.start()
        //  Remove the next 2 lines if you want to use a cdn like s3
        //this.load.baseURL = 'http://namespace.s3.amazonaws.com/bucket/dir/';
        //this.load.crossOrigin = 'anonymous';

        this.load.image('startScreen', 'assets/stage/' + this.currentLevel + '/background-640x360.jpg');
        this.load.image('paddle', 'assets/stage/' + this.currentLevel + '/paddle.png');
      },
      create: function () {
        this.stage.backgroundColor = this.stageConfig.background;
        this.background = this.add.sprite(0, 0, 'startScreen');

        this.scoreText = this.add.text(30, this.game.height-30, 'Score: ' + this.userPoints, {
          font: "20px Arial",
          fill: this.stageConfig.font,
          align: "left"
        });
        this.timerText = this.add.text(520, this.game.height-30, 'Timer: ' + this.stageTimer, {
          font: "20px Arial",
          fill: this.stageConfig.font,
          align: "left"
        });
        //this.stageConfig.title
        this.introText = this.add.text(this.world.centerX, this.game.height/3, 'Click to Start', {
          font: "30px Arial",
          fill: this.stageConfig.font,
          align: "center"
        });
        this.introText.anchor.setTo(0.5, 0.5);

        this.physics.startSystem(Phaser.Physics.ARCADE);
        this.physics.arcade.checkCollision.down = false;

        this.stage.disableVisibilityChange = true;
        this.stage.scaleMode = Phaser.ScaleManager.EXACT_FIT;
        this.scale.fullScreenScaleMode = Phaser.ScaleManager.SHOW_ALL;
        this.stage.scaleMode.forceLandscape = true;
        this.scale.setScreenSize(true);
        this.input.onDown.add(this.start, this);
      },
      /**
       * Core update loop. Handles collision checks and player input.
       *
       * @method update
       */
      update: function () {
        if (this.live) {
          if (this.paddle.x < 25) {
            this.paddle.x = 25;
          } else if (this.paddle.x > this.game.width - 25) {
            this.paddle.x = this.game.width - 25;
          } else {
            this.paddle.x = this.input.x + 25;
          }
          if (this.liveItems.length <= 1) {
            this.dropItem('item');
          }
          //@TODO need a way to reduce the liveItems at instance.kill()
          for(var i=0;i<this.liveItems.length;i++){
            this.physics.arcade.collide(this.liveItems[i], this.paddle, this.caught, null, this);
          }
        }
      },
      /**
       *
       * @method start
       */
      start: function () {
        if(!this.game.scale.isFullScreen) {
          this.game.scale.startFullScreen();
          return;
        }
        var self = this;
        if (!self.live) {
          self.live = true;
          self.stageTimer = Math.ceil((self.stageTimerMultiplier*self.difficaulty).toFixed()/10)*10;
          self.introText.setText('GO!');
          self.stageTimerInterval = setInterval(function(){
            self.stageTimer--;
            self.timerText.setText('Timer: ' + self.stageTimer);
            self.introText.setText('');
            if (self.stageTimer <= 0) {
              self.stageOver();
              clearInterval(self.stageTimerInterval);
            }
          },1000);

          self.paddle = self.add.sprite(self.world.centerX, this.game.height-30, 'paddle');
          self.paddle.anchor.setTo(1, 1);
          self.physics.enable(self.paddle, Phaser.Physics.ARCADE);
          self.paddle.body.collideWorldBounds = true;
          //self.paddle.body.bounce.set(1);
          self.paddle.body.immovable = true;

          for (var j=0; j<(self.loadedItem.limit*self.difficaulty); j++) {
            setTimeout(function(){self.dropItem('item');}, rand(500,(1000*(self.stageTimer-1))+500));
          }
        }
      },
      dropItem: function (imgKey) {
        var instance = this.add.sprite(rand(20,(this.game.width-20)), 0, imgKey);
        instance.catchValue = this.loadedItem.value;
        this.physics.enable(instance, Phaser.Physics.ARCADE);
        instance.checkWorldBounds = true;
        instance.body.collideWorldBounds = true;
        instance.body.bounce.set(1);
        var slowest = 100*this.difficaulty;
        var fastest = 300*this.difficaulty;
        instance.body.gravity.y = rand(slowest,fastest  );
        instance.events.onOutOfBounds.add(this.missed, this);
        this.liveItems.push(instance);
      },
      missed: function (instance) {
        //delete this.liveItems[this.liveItems.indexOf(instance)];
        instance.kill();
      },
      stageOver: function () {
        this.live = false;
        this.paddle.kill();
        this.introText.setText('Game Over\nYou caught '+this.userPoints);
        this.paddle = null;
        this.userPoints = 0;
        this.difficaulty = ((this.difficaulty/1.25)*2).toFixed(1);
        this.liveItems = [];
      },
      caught: function (instance) {
        this.userPoints = parseInt(this.userPoints)+1; //parseInt(instance.catchValue);
        //delete this.liveItems[this.liveItems.indexOf(instance)];
        instance.kill();
        this.scoreText.setText('Score: ' + this.userPoints);
      }
    };
    game.state.add('Game', PhaserGame, true);
  })(window);
}
