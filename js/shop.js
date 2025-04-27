import { LAYOUT, THEMES } from "./constants.js";
import { GameState } from "./GameState.js";
import { LayoutManager } from "../js/layoutManager.js";

export function createShop(scene, theme, scaleFactor) {
    const layout = new LayoutManager(scene);
    const shopButtonX = layout.shopButtonX;
    const titleY = layout.titleY;

    const shopButtonImage = GameState.currentTheme === THEMES.dark ? 'shopButtonDark' : 'shopButtonLight';
    const buttonSize = layout.isMobile ? 180 : 70; // Taille différente pour mobile et desktop

    const shopButton = scene.add.image(shopButtonX, titleY*0.5, shopButtonImage)
        .setInteractive()
        .setDepth(9)
        .setDisplaySize(Math.round(buttonSize), Math.round(buttonSize))
        .on('pointerdown', () => {
            if (GameState.shopOpen) {
                closeShopPopup();
            } else {
                showShopPopup(scene, theme, scaleFactor);
            }
        });

    GameState.shopButton = shopButton;
}

function showShopPopup(scene, theme, scaleFactor) {
    if (GameState.shopOpen) return;
    GameState.shopOpen = true;

    const layout = new LayoutManager(scene);
    const centerX = layout.shopPopupX;
    const barY = layout.shopPopupY;
    const buttonSpacing = layout.buttonSpacing;

    const shopGroup = scene.add.group();

    const shopBackgroundImage = GameState.currentTheme === THEMES.dark ? 'shopBackgroundDark' : 'shopBackgroundLight';
    const backgroundBar = scene.add.image(centerX, barY, shopBackgroundImage)
        .setDepth(8)
        .setOrigin(0.5)
        .setInteractive()
        .setDisplaySize(layout.shopPopupWidth, layout.shopPopupHeight);
    shopGroup.add(backgroundBar);

    const SHOP_ITEMS = [
        { name: '❤️', price: 100, skin: 'unitHeart' },
        { name: '⭐️', price: 200, skin: 'unitStar' },
        { name: '🌸', price: 300, skin: 'unitFlower' },
        { name: '🔄', price: 0, skin: 'unit' }
    ];

    SHOP_ITEMS.forEach((item, index) => {
        const xPosition = centerX - (80*scaleFactor * (layout.isMobile ? 1.7 - index : 1.3 - index));
    
        const alreadyOwned = GameState.ownedSkins.includes(item.skin); 
    
        const priceOrObtained = alreadyOwned ? "Obtenu" : `${item.price}$`;
    
        const priceText = scene.add.text(xPosition, barY + Math.round(30 * scaleFactor), priceOrObtained, {
            font: `${Math.round(16 * scaleFactor)}px customFont`,
            fill: theme.text
        }).setOrigin(0.5).setDepth(9);
        shopGroup.add(priceText);
    
        const skinSize = layout.isMobile ? Math.round(GameState.unitSize * 1.1) : Math.round(GameState.unitSize * 0.4);
        const skinIcon = scene.add.image(xPosition, barY - Math.round(10 * scaleFactor), item.skin)
            .setScale(0.6)
            .setDepth(9)
            .setInteractive()
            .setDisplaySize(skinSize, skinSize)
            .on('pointerdown', () => {
                if (!alreadyOwned) { 
                    purchaseItem(scene, item);
                } else {
                    activateSkin(item.skin); 
                    closeShopPopup();
                }
            });
        shopGroup.add(skinIcon);
    });

    GameState.shopGroup = shopGroup;
}

function closeShopPopup() {
    if (GameState.shopGroup) {
        if (GameState.shopGroup.clear) {
            GameState.shopGroup.clear(true, true);
        }
        GameState.shopGroup = null;
    }
    GameState.shopOpen = false;
}

function purchaseItem(scene, item) {
    if (GameState.coins >= item.price) {
        GameState.coins -= item.price;
        GameState.coinsText.setText(`${GameState.coins}$`);
        GameState.ownedSkins.push(item.skin);
        GameState.save(); 
        activateSkin(item.skin);
        closeShopPopup();
    } else {
        const layout = new LayoutManager(scene);
        const centerX = layout.centerX;
        const barY = layout.shopPopupY - Math.round(20 * layout.scaleFactor);

        const errorMsg = scene.add.text(centerX, barY + 40, "Pas assez de pièces!", {
            font: `${Math.round(16 * layout.scaleFactor)}px customFont`,
            fill: "#ff0000"
        }).setOrigin(0.5).setDepth(25);

        GameState.shopGroup.add(errorMsg);

        scene.time.delayedCall(1500, () => {
            errorMsg.destroy();
        });
    }
}

function activateSkin(skin) {
    console.log(`🎨 Skin activé : ${skin}`);
    GameState.unitSkin = skin;

    GameState.grid.forEach(row => {
        row.forEach(unit => {
            if (unit) {
                unit.setTexture(skin)
                    .setDisplaySize(Math.round(GameState.unitSize * GameState.scaleFactor), Math.round(GameState.unitSize * GameState.scaleFactor));
            }
        });
    });
}
