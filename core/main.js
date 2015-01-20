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
      // private props
      this.private = null;

    }
    PhaserGame.prototype = {
      init: function () {
        this.game.renderer.renderSession.roundPixels = true;
        this.game.world.setBounds(0, 0, 992, 480);
        this.physics.startSystem(Phaser.Physics.ARCADE);
        this.physics.arcade.gravity.y = 200;
      },
      preload: function () {
        //  We need this because the assets are on Amazon S3
        //  Remove the next 2 lines if running locally
        //this.load.baseURL = 'http://namespace.s3.amazonaws.com/bucket/dir/';
        //this.load.crossOrigin = 'anonymous';

        this.load.image('background', 'assets/phaser.png');
      },
      create: function () {
        this.stage.backgroundColor = '#4d4d4d';
        this.background = this.add.sprite(0, 0, 'background');
        this.scale.fullScreenScaleMode = Phaser.ScaleManager.SHOW_ALL;
        this.input.onDown.add(this.gofull, this);
      },
      /**
       * Core update loop. Handles collision checks and player input.
       *
       * @method update
       */
      update: function () {

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
