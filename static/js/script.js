let blackjackGame=
{
    'you':{'scoreSpan': '#human-result','div':'#player-box','score':0},
    'computer':{'scoreSpan': '#computer-result','div':'#computer-box','score':0},
    'cards': ['2','3','4','5','6','7','8','9','10','J','Q','K','A'],
    'cardMap':{'2': 2,'3':3,'4':4,'5':5,'6':6,'7':7,'8':8,'9':9,'10':10,'J':10,'Q':10,'K':10,'A':[1,11]},
    'win': 0,
    'loss': 0,
    'tie': 0,
    'stand':false,
    'turnsOver':false,
};
const YOU= blackjackGame['you']
const DEALER= blackjackGame['computer']
const hitsound= new Audio('static/sounds/26f8b9_sonic_ring_sound_effect.mp3');
const winsound= new Audio('static/sounds/mk64_mario07.wav');
const losesound= new Audio('static/sounds/roblox-death-sound_1.mp3');
document.querySelector('#hit-button').addEventListener('click',blackjackHit);
document.querySelector('#stand-button').addEventListener('click',blackjackStand);
document.querySelector('#deal-button').addEventListener('click',blackjackDeal);

function blackjackHit()
{
    if(blackjackGame['stand']===false)
    {
    let card = randCard();
    showCard(card, YOU);
    updateScore(card,YOU);
    console.log(YOU['score'])
    showScore(YOU);
    }
    
}
function randCard()
{
    let randomCard=Math.floor(Math.random()*13);
    return blackjackGame['cards'][randomCard];
}
function showCard(card, activePlayer)
{
    if(activePlayer['score'] <= 21)
    {
    let cardImg = document.createElement('img');
    cardImg.src= `static/images/${card}.png`;
    document.querySelector(activePlayer['div']).appendChild(cardImg);
    hitsound.play();
}
}

function blackjackDeal()
{
    if(blackjackGame['turnsOver'] === true)
    {
        blackjackGame['stand']=false;
        let humanimages = document.querySelector('#player-box').querySelectorAll('img');
        let computerimages = document.querySelector('#computer-box').querySelectorAll('img');
        for(i=0;i<humanimages.length;i++)
        {
            humanimages[i].remove();
        }
        for(i=0;i<computerimages.length;i++)
        {
            computerimages[i].remove();
        }
        YOU['score'] = 0;
        DEALER['score']=0;
        document.querySelector('#human-result').textContent=0;
        document.querySelector('#human-result').style.color='white';
        document.querySelector('#computer-result').textContent=0;
        document.querySelector('#Computer-result').style.color='white';
        document.querySelector('#blackjack-result').textContent = "Let's Play!";
        document.querySelector('#blackjack-result').style.color = 'white';
        blackjackGame['turnsOver']=true;
    }
}
function updateScore(card, activePlayer)
{
    //if adding 11 keeps me below 21 add 11 otherwise pick 1
    if(card ==='A')
    {
        if(activePlayer['score']+blackjackGame['cardMap'][card][1]<= 21)
        {
            activePlayer['score']+= blackjackGame['cardMap'][card][1];
        }
        else
        {
            activePlayer['score']+= blackjackGame['cardMap'][card][0];
        }
        
    }
    else
    {
    activePlayer['score'] += blackjackGame['cardMap'][card];
    }
}
function showScore(activePlayer)
{
    if(activePlayer['score'] > 21)
    {
        document.querySelector(activePlayer['scoreSpan']).textContent='BUST!';
        document.querySelector(activePlayer['scoreSpan']).style.color='red';
    }
    else
    {
        document.querySelector(activePlayer['scoreSpan']).textContent=activePlayer['score'];
    }
}
function sleep(ms)
{
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function blackjackStand()
{
    blackjackGame['stand'] = true;
    while (DEALER['score'] < 16 && blackjackGame['stand'] === true)
    {
    let card=randCard();
    showCard(card,DEALER);
    updateScore(card,DEALER)
    showScore(DEALER);
    await sleep(1000);
    }
    
    blackjackGame['turnsOver'] = true;
    let winner = decision();
    showResult(winner);
    
}
function decision()
{
    let winner;
    // player under 21
    if(YOU['score']<=21)
    {
        //score higher than dealer
        if (YOU['score']> DEALER['score'] || DEALER['score']>21)
        {
            blackjackGame['win']++;
            winner =YOU;
        }
        //score lower than dealer
        else if (YOU['score'] < DEALER['score'])
        {
            blackjackGame['loss']++;
            winner =DEALER;
        }
        //score are equal
        else if (YOU['score'] === DEALER['score'])
        {
            blackjackGame['tie']++;
        }
    }
    //You bust dealer under 21
    else if(YOU['score'] > 21 && DEALER['score']<=21)
    {
        blackjackGame['loss']++;
        winner = DEALER;
        
    }
    //you and dealer bust
    else if (YOU['score']>21 && DEALER['score']>21)
    {   
        blackjackGame['tie']++;
    }
    console.log('Winner is', winner);
    return winner;
}
function showResult(winner)
{
    if(blackjackGame['turnsOver']=== true)
    {
        let msg, msgColor;
        if (winner === YOU)
        {
            msg='You Win!';
            document.querySelector('#win-result').textContent = blackjackGame['win'];
            msgColor = 'green';
            winsound.play();
        }
        else if(winner === DEALER)
        {
            msg='You Lose!';
            document.querySelector('#lose-result').textContent = blackjackGame['loss'];
            msgColor = 'red';
            losesound.play();
        }
        else
        {

            msg='You Tied!';
            document.querySelector('#draw-result').textContent = blackjackGame['tie'];
            msgColor = 'white';
        }
        document.querySelector('#blackjack-result').textContent = msg;
        document.querySelector('#blackjack-result').style.color = msgColor;
       }
}
