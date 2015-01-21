(function (window, $, undefined) {
  "use scrict";
  $(document).on('ready', function() {
    var game = new Phaser.Game(640, 360, Phaser.CANVAS, 'game');

    /**
     * Class definition
     *
     * @class PhaserGame
     */
    var PhaserGame = function (game) {
      this.live = false;
      this.paddle = null;
      this.ball = null;
    }
    PhaserGame.prototype = {
      init: function () {
        this.game.renderer.renderSession.roundPixels = true;
        this.game.world.setBounds(0, 0, 640, 360);
        this.physics.startSystem(Phaser.Physics.ARCADE);
        this.physics.arcade.gravity.y = 350;
      },
      preload: function () {
        //  Remove the next 2 lines if you want to use a cdn like s3
        //this.load.baseURL = 'http://namespace.s3.amazonaws.com/bucket/dir/';
        //this.load.crossOrigin = 'anonymous';

        this.load.image('background', 'assets/background.png');
        this.load.image('paddle', 'assets/paddle.png');
        this.load.image('ball', 'assets/ball.png');
      },
      create: function () {
        this.physics.startSystem(Phaser.Physics.ARCADE);
        //  dont check bototm collisions
        this.physics.arcade.checkCollision.down = false;

        this.stage.backgroundColor = '#4d4d4d';
        this.background = this.add.sprite(0, 0, 'background');
        this.scale.fullScreenScaleMode = Phaser.ScaleManager.SHOW_ALL;
        this.input.onDown.add(this.gofull, this);

        this.paddle = this.add.sprite(this.world.centerX, 320, 'paddle');
        this.paddle.anchor.setTo(1, 1);
        this.physics.enable(this.paddle, Phaser.Physics.ARCADE);
        this.paddle.body.collideWorldBounds = true;
        this.paddle.body.bounce.set(1);
        this.paddle.body.immovable = true;

        this.ball = this.add.sprite(this.world.centerX, this.paddle.y - 16, 'ball');
        this.ball.anchor.set(0.5);
        this.ball.checkWorldBounds = true;
        this.physics.enable(this.ball, Phaser.Physics.ARCADE);
        this.ball.body.collideWorldBounds = true;
        this.ball.body.bounce.set(1);
        this.ball.events.onOutOfBounds.add(this.killBall, this);

        this.game.input.onDown.add(this.start, this);
      },
      /**
       * Core update loop. Handles collision checks and player input.
       *
       * @method update
       */
      update: function () {
        this.paddle.x = this.input.x;
        if (!this.live) {
          this.ball.x = this.input.x-17;
          this.ball.y = this.paddle.y-24;
        }
      },
      /**
       *
       * @method start
       */
      start: function () {
        if (!this.live){
          this.live = true;
          this.ball.body.velocity.y = -300;
          this.ball.body.velocity.x = -75;
        }
      },
      /**
       *
       * @method killBall
       */
      killBall: function () {
        this.live = false;
        this.ball.reset(this.paddle.body.x + 16, this.paddle.y - 16);
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
  });
})(window, jQuery);
