class DismissableCards{
    constructor(){
        this.startX = 0;
        this.currentX = this.startX;
        this.tragetX = 0;
        this.targetCard = null;
        this.targetCardBCR = null;
        this.annimationHandle = null;

        this.update = this.update.bind(this);

        this.cards = Array.from(document.querySelectorAll(".card"));

        this.addEventListeners();
    }
    addEventListeners(){
        document.addEventListener("mousedown", (evt)=>this.onStart(evt));
        document.addEventListener("mousemove", (evt)=>this.onMove(evt));
        document.addEventListener("mouseup", (evt)=>this.onEnd(evt));

        document.addEventListener("touchstart", (evt)=>this.onStart(evt));
        document.addEventListener("touchmove", (evt)=>this.onMove(evt));
        document.addEventListener("touchend", (evt)=>this.onEnd());
    }
    onStart(evt){
        
        if(!evt.target.classList.contains("card")) return;
        if(this.targetCard) return;
        this.annimationHandle = requestAnimationFrame(this.update);
        this.targetCard = evt.target;
        this.targetCardBCR = this.targetCard.getBoundingClientRect();
        this.startX = evt.pageX || evt.touches[0].pageX;
        this.currentX = this.startX;
        this.targetCard.style.willChange = "transform";
    }
    onMove(evt){
        if(!this.targetCard) return;
        this.currentX = evt.pageX || evt.touches[0].pageX;
    }
    onEnd(){
        if(!this.targetCard) return;
        const displacementX = this.currentX - this.startX;
        if(Math.abs(displacementX) < this.targetCardBCR.width * 0.25){
            this.tragetX = 0;
            this.slideTargetCard();   
            return;
        }
        this.tragetX = displacementX > 0 ? this.targetCardBCR.width : - this.targetCardBCR.width;
        const cartItem = this.targetCard.parentNode;
        cartItem.parentNode.removeChild(cartItem);
        const targetIndex = this.cards.indexOf(this.targetCard);
        this.cards.splice(targetIndex, 1);
        this.slideTargetCard();
        this.sildeUpOtherCards(targetIndex);
        
    }
    slideTargetCard(){
            this.targetCard.style.transform = `translateX(${this.tragetX}px)`;
            this.targetCard.style.willChange = "initial";
            this.targetCard.style.transform = "none";
            this.targetCard = null;
            cancelAnimationFrame(this.annimationHandle);
    }
    sildeUpOtherCards(targetIndex){
        if(this.targetCard == this.cards) return;

        const onTransitionEnd = evt => {
            const card = evt.target;
            card.removeEventListener('transitionend', onTransitionEnd);
            card.style.transition = '';
            card.style.transform = '';
        };

        // Removing card in the DOM pushes up cards bellow the target
        // that why we need to push them down then slide them up
        for(let i = targetIndex; i<this.cards.length; i ++){
            const card = this.cards[i].parentNode;
            card.style.transform = `translateY(${this.targetCardBCR.height +16}px)`;
            card.addEventListener('transitionend', onTransitionEnd);
        }
        
        // slide up cards 
       requestAnimationFrame(()=>{

        for(let i = targetIndex; i<this.cards.length; i ++){
            let card = this.cards[i].parentNode;
            requestAnimationFrame(()=>{
                card.style.transition = `transform .15s cubic-bezier(0,0,0.31,1) ${i*50}ms`;
            card.style.transform = `none`;
            card.addEventListener('transitionend', onTransitionEnd);
            });   
        }

       });
    }
    update(){
        this.annimationHandle = requestAnimationFrame(this.update);
        if(this.targetCard == null) return;

        const displacementX = this.currentX - this.startX;
        this.targetCard.style.transform = `translateX(${displacementX}px)`;
    }
}
(function () {
    new DismissableCards();
})();