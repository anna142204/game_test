export class BootScene extends Phaser.Scene {
    constructor() {
        super({ key: 'BootScene' });
    }

    preload() {
        //grid
        this.load.image('gridCellDark', 'assets/case.png');
        this.load.image('gridCellLight', 'assets/case2.png');

        //button
        this.load.image('buyButton', 'assets/buyButton.png');
        this.load.image('buttonThemeDark', 'assets/buttonThemeDark.png');
        this.load.image('buttonThemeLight', 'assets/buttonThemeLight.png');
        this.load.image('backButtonDark', 'assets/backButtonDark.png');
        this.load.image('backButtonLight', 'assets/backButtonLight.png');
        this.load.image('buttonLight', 'assets/buttonLight.png');
        this.load.image('buttonDark', 'assets/buttonDark.png');

        //unitTheme
        this.load.image('unitLight', 'assets/coin.png');
        this.load.image('unitDark', 'assets/chat.png');

        //unitSkin
        this.load.image('unitCat', 'assets/chat.png');
        this.load.image('unitHeart', 'assets/unitHeart.png');
        this.load.image('unitStar', 'assets/unitStar.png');
        this.load.image('unitFlower', 'assets/unitFlower.png');

        //shop
        this.load.image('shopBackgroundDark', 'assets/shopBackgroundDark.png');
        this.load.image('shopBackgroundLight', 'assets/shopBackgroundLight.png');
        this.load.image('shopButtonDark', 'assets/shopButtonDark.png');
        this.load.image('shopButtonLight', 'assets/shopButtonLight.png');

        //unitBase
        this.load.image('unit', 'assets/chat.png');
        this.load.image('coin', 'assets/coin.png');

        //font
        this.load.font('customFont', 'assets/SourGummy-VariableFont_wdth,wght.ttf');

    }

    create() {
        this.scene.start('Start');
    }
}