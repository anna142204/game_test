export class LayoutManager {
    constructor(scene) {
        this.scene = scene;
        this.width = scene.scale.width;
        this.height = scene.scale.height;
        this.isMobile = this.width <= 980;
        this.scaleFactor = this.isMobile ? 2.1 : 0.8;
        this.centerX = Math.round(this.width / 2);
        this.centerY = Math.round(this.height / 2);
        this.offsetY = Math.round(this.height * 0.05);
    }

    get titleY() {
        return Math.round(this.isMobile ? this.height * 0.25 + this.offsetY : this.height * 0.12 + this.offsetY);
    }

    get gridY() {
        return Math.round(this.centerY - this.height * 0.2 + this.offsetY);
    }

    get resourcesY() {
        return Math.round(this.isMobile ? this.titleY * 1.3  : this.titleY * 1.6);
    }

    get resourcesX() {
        return Math.round(this.isMobile ? this.centerX * 0.5  : this.centerX * 0.85);
    }

    get buttonY() {
        return Math.round(this.centerY + 100 * this.scaleFactor);
    } 

    get buyButtonY() {
        return Math.round(this.centerY*1.7);
    }
    get backButtonY() {
        return Math.round(this.isMobile ? this.titleY*0.5 : this.titleY*0.5);
    }
    get backButtonX() {
        return Math.round(this.isMobile ? this.centerX*0.3: this.centerX*0.65);
    }
    get shopButtonX() {
        return Math.round(this.isMobile ? this.centerX+350 : this.centerX+200);
    }

    get buttonSpacing() {
        return Math.round(100 * this.scaleFactor);
    }

    get shopPopupX() {
        return Math.round(this.isMobile ? this.centerX -50: this.shopButtonX +this.shopPopupWidth*0.5);
    }

    get shopPopupY() {
        return Math.round(this.titleY*0.5);
    }

    get shopPopupWidth() {
        return Math.round(this.isMobile ? 800 : 300);
    }

    get shopPopupHeight() {
        return Math.round(this.isMobile ? 190 : 70);
    }
}
