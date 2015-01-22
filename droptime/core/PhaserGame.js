(function (window, undefined) {
  "use scrict";
  // get dimensions of the window considering retina displays
  var currentLevel = 1,
      w = window.innerWidth,
      h = window.innerHeight,
      game = new Phaser.Game((h > w) ? h : w, (h > w) ? w : h, Phaser.CANVAS, 'game');

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
    this.stageTimer = 60;
    this.introText = null;
    this.scoreText = null;
    this.timerText = null;
    this.liveItems = [];
  }
  PhaserGame.prototype = {
    init: function () {
      this.game.renderer.renderSession.roundPixels = true;
      this.game.world.setBounds(0, 0, 640, 360);
      this.physics.startSystem(Phaser.Physics.ARCADE);
      this.physics.arcade.gravity.y = 350;
    },
    preload: function () {
      var self = this,
          loader = new Phaser.Loader(this);
      loader.text('stage-' + this.currentLevel, 'assets/stage/' + this.currentLevel + '/config.json');
      loader.onLoadComplete.addOnce(function(){
        self.stageConfig = JSON.parse(self.cache.getText('stage-' + self.currentLevel));
        for (var i=0,l=self.stageConfig.points.length;i<l;i++) {
          var item = self.stageConfig.points[i];
          self.load.image('item'+i, item.img);
          item.img = 'item'+i;
          self.liveItems.push(item);
        }
      });
      loader.start()
      //  Remove the next 2 lines if you want to use a cdn like s3
      //this.load.baseURL = 'http://namespace.s3.amazonaws.com/bucket/dir/';
      //this.load.crossOrigin = 'anonymous';

      this.load.image('startScreen', 'assets/stage/' + this.currentLevel + '/background-640x360.jpg');
      this.load.image('paddle', 'assets/stage/' + this.currentLevel + '/paddle.png');
      this.load.image('ball', 'assets/stage/' + this.currentLevel + '/paddle.png');
    },
    create: function () {
      this.stage.backgroundColor = this.stageConfig.background;
      this.background = this.add.sprite(0, 0, 'startScreen');

      this.scoreText = this.add.text(30, 320, 'score: ' + this.userPoints, {
        font: "20px Arial",
        fill: this.stageConfig.font,
        align: "left"
      });
      this.timerText = this.add.text(520, 320, 'timer: ' + this.stageTimer, {
        font: "20px Arial",
        fill: this.stageConfig.font,
        align: "left"
      });
      this.introText = this.add.text(this.world.centerX, 150, this.stageConfig.title, {
        font: "40px Arial",
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
      this.input.onDown.add(this.gofull, this);
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
        } else if (this.paddle.x > this.width - 25) {
          this.paddle.x = this.width - 25;
        } else {
          this.paddle.x = this.input.x + 25;
        }
        //this.physics.arcade.collide(this.ball, this.paddle, ballHitPaddle, null, this);

      }
    },
    /**
     *
     * @method start
     */
    start: function () {
      if (!this.live) {
        this.live = true;

        this.paddle = this.add.sprite(this.world.centerX, this.game.height-30, 'paddle');
        this.paddle.anchor.setTo(1, 1);
        this.physics.enable(this.paddle, Phaser.Physics.ARCADE);
        this.paddle.body.collideWorldBounds = true;
        this.paddle.body.bounce.set(1);
        this.paddle.body.immovable = true;

        for (var i=0,l=this.liveItems.length;i<l;i++)
        {
          var item = this.liveItems[i],
              instance = this.add.sprite(rand(20,(this.game.width-20)), 0, item.img);

          instance.checkWorldBounds = true;
          this.physics.enable(instance, Phaser.Physics.ARCADE);
          instance.body.collideWorldBounds = true;
          instance.body.bounce.set(1);
          instance.body.gravity.y = 200;
          instance.events.onOutOfBounds.add(this.killBall, this);
          item.instance = instance;
          delete this.liveItems[i];
          this.liveItems[i] = item;
        }

      }

    },
    killBall: function () {
      this.ball.kill();
    },
      /**
       * Will fire on load and anytime any input is registered
       *
       * @method gofull
       */
      gofull: function () {
        if (!this.scale.isFullScreen) {
          this.scale.startFullScreen(false);
          info("full screen mode");
        }
      }
  };
  game.state.add('Game', PhaserGame, true);
})(window);
