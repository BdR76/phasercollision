//start
var game = new Phaser.Game(800, 600, Phaser.AUTO, 'phaser-example', { preload: preload, create: create, update: update, render: render });

var player;
var dum1;
var dum2;
var dum3;
var playerHitGroup;
var shapesGroup;
var msgText;
var cursors;

var HIT_SPR_DIAMETER = 24;

// -------------------------------------
// PHASER GAME FUNCTIONS
// -------------------------------------
function preload() {
	game.load.image('biplane', 'biplane.png');
	game.load.spritesheet('shapes', 'shapes.png', 64, 64);
}

function create() {
	// arcade physics
	game.physics.startSystem(Phaser.Physics.ARCADE);

	// blue background
	//game.stage.backgroundColor = 0xbada55;
	game.stage.backgroundColor = 0x40a0ff;

	//  Text
	msgText = game.add.text(480, 100,' ', { font: '16px Arial', fill: '#fff' });
	msgText.anchor.setTo(0.5, 0.5);
	msgText.text = 'collision!';
	msgText.visible = false;

	// the player
	player = sprite = game.add.sprite(game.world.centerX, game.world.centerY, 'biplane');
	player.anchor.setTo(0.5, 0.5);
	game.physics.enable(player, Phaser.Physics.ARCADE);// physics enabled else no collisions
player.angle = 45;
player.body.angle = 45;

	// the player collision sprites
	playerHitGroup = game.add.group();
	playerHitGroup.enableBody = true;
	playerHitGroup.physicsBodyType = Phaser.Physics.ARCADE;

	// setup the player hit sprites
	dum1 = game.add.sprite(0, 0, null, 0, playerHitGroup);
	dum1.body.setSize(32, 32);
	dum1.anchor.setTo(0.5, 0.5);
	dum2 = game.add.sprite(0, 0, null, 0, playerHitGroup);
	dum2.body.setSize(32, 32);
	dum2.anchor.setTo(0.5, 0.5);
	dum3 = game.add.sprite(0, 0, null, 0, playerHitGroup);
	dum3.body.setSize(32, 32);
	dum3.anchor.setTo(0.5, 0.5);

	// the shapes
	shapesGroup = game.add.group();
	shapesGroup.enableBody = true;
	shapesGroup.physicsBodyType = Phaser.Physics.ARCADE;


	for (var i = 0; i < 3; i++)
	{
		var shape = shapesGroup.create(400, 200 + (i*150), 'shapes');
		shape.anchor.setTo(0.5, 0.5);
		shape.frame = (i % 3); // i modulo 3, will cycle through values 0..2 
	};

	// add controls to play the game
	cursors = game.input.keyboard.createCursorKeys();
}

function update() {
	// player biplane follows mouse
	player.x = this.game.input.activePointer.x;
	player.y = this.game.input.activePointer.y;
	
	// player hit sprites
	updateHitSprites();

	// rotate cursors
	if ( (cursors.up.isDown)   || (cursors.left.isDown) )  {player.angle = player.angle - 2;};
	if ( (cursors.down.isDown) || (cursors.right.isDown) ) {player.angle = player.angle + 2;};

	//  Run collision
	msgText.visible = false;
	//game.physics.arcade.overlap(shapesGroup, player, playerHitsShape, null, this); // this works
	game.physics.arcade.overlap(shapesGroup, playerHitGroup, playerHitsShape, null, this); // this doesn't work?
}

function updateHitSprites() {
	dum1.x = player.x + (Math.cos(2 * Math.PI * player.angle / 360.0) * HIT_SPR_DIAMETER * 2);
	dum1.y = player.y + (Math.sin(2 * Math.PI * player.angle / 360.0) * HIT_SPR_DIAMETER * 2);
	
	dum2.x = player.x;
	dum2.y = player.y;
	
	dum3.x = player.x + (Math.cos(2 * Math.PI * (player.angle+180) / 360.0) * HIT_SPR_DIAMETER * 2);
	dum3.y = player.y + (Math.sin(2 * Math.PI * (player.angle+180) / 360.0) * HIT_SPR_DIAMETER * 2);
}

function render() {
	game.debug.bodyInfo(player, 32, 32);
	//game.debug.body(player);
	for (var i = 0; i < playerHitGroup.length; i++)
	{
		game.debug.body(playerHitGroup.children[i]);
	};
	for (var i = 0; i < shapesGroup.length; i++)
	{
		game.debug.body(shapesGroup.children[i]);
	};
}

function playerHitsShape (shape, player) {
	//  player hits a shape, display collision text next to shape
	msgText.y = 200 + (shape.frame * 150);
	msgText.visible = true;
	//shape.kill();
}
