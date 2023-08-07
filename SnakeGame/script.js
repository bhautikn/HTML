var previus = 1;
var timeRight = 0;
var timeDown = 0;
var timeTop = 0;
var timeLeft = 0;
var isPause = true;
var intervalTime = 18;
var foodTop = 0;
var foodLeft = 0;
var snackSize = 30;

document.getElementsByClassName('scoreTxt')[0].style.right = (screen.availWidth/2)+'px';
var scoreBord = document.getElementsByClassName('score-bord');
var snack = document.getElementsByClassName('snack');

for (var i = 0; i < snack.length; i++) {
	snack[i].style.height = snackSize+'px';
	snack[i].style.width = snackSize+'px';
}
var foodId = document.getElementById('food');
foodId.style.height = snackSize+'px';	
foodId.style.width = snackSize+'px';
	
createFood();
var arr = [[44, 15], [44, 13], [44, 11], [44, 9], [44, 7], [44, 5], [44, 3]];

// Up    0
// right 1
// down  2
// left  3

document.body.addEventListener("keydown", (event) => {
	if (event.key == 'ArrowRight' && previus != 3 && !isPause){ 
		clearAllInterval();
		previus = 1;
		moveSnack(previus);
	}
	else if (event.key == 'ArrowLeft' && previus != 1 && !isPause){
		clearAllInterval();
		previus = 3;
		moveSnack(previus);
	}
	else if (event.key == 'ArrowUp' && previus != 2 && !isPause){
		clearAllInterval();
		previus = 0;
		moveSnack(previus);
	}
	else if (event.key == 'ArrowDown' && previus != 0 && !isPause){
		clearAllInterval();
		previus = 2;
		moveSnack(previus);
	}
	else if(event.key == ' '){
		let btn_temp = document.getElementById('space-to-continue').style;
		if (isPause) {
			document.body.requestFullscreen();	
			btn_temp.display = 'none';
			isPause = false;
			moveSnack(previus);
		}
		else{ 
			btn_temp.display = 'block';
			isPause = true;
			clearAllInterval();
		}
	}
})
function moveSnack(direction) {
	clearAllInterval();
	if (direction == 0) {
		timeTop = setInterval(()=> {
			checkFeed();
			arr[0][0]-=snackSize/4;
			snack[0].style.top = arr[0][0]+'px';
			someRepeted();
		}, intervalTime);
	}
	else if(direction == 1){
		timeRight = setInterval(()=> {
			checkFeed();
			arr[0][1]+=snackSize/4;
			snack[0].style.left = arr[0][1]+'px';
			someRepeted();
		}, intervalTime);
	}
	else if(direction == 2){
		timeDown = setInterval(()=> {
			checkFeed();
			arr[0][0]+=snackSize/4;
			snack[0].style.top = arr[0][0]+'px';
			someRepeted();
		}, intervalTime);
	}
	else{
		timeLeft = setInterval(()=> {
			checkFeed();
			arr[0][1]-=snackSize/4;
			snack[0].style.left = arr[0][1]+'px';
			someRepeted();
		}, intervalTime);
	}
}
function clearAllInterval(){
	clearInterval(timeRight);
	clearInterval(timeDown);
	clearInterval(timeTop);
	clearInterval(timeLeft);
}
function createFood(){
	foodTop = Math.ceil(Math.random()*(screen.availHeight-200))+20;
	foodLeft = Math.ceil(Math.random()*(screen.availWidth-100))+20;
	foodId.style.top = foodTop+'px';
	foodId.style.left = foodLeft+'px';
}
point = 0;
function checkFeed(){
	if ((arr[0][0] >= foodTop-snackSize && arr[0][0] <= foodTop+snackSize) &&
	 (arr[0][1] >= foodLeft-snackSize && arr[0][1] <= foodLeft+snackSize))
	{
		changeScore(++point);
		createFood();
		changeSize();
	}
	checkBite();
}
function changeScore(score){
	if (scoreBord[0].style.display == 'block') {
		scoreBord[1].style.top = '20px';
		scoreBord[0].style.top = '10px';
		scoreBord[1].style.display = 'block';
		scoreBord[1].innerHTML = score;
		setTimeout(()=>{
			scoreBord[0].style.top = '-50px';
			scoreBord[1].style.top = '0px';
			scoreBord[0].style.display = 'none';
		}, 10)
	}
	else{
		scoreBord[0].style.top = '20px';
		scoreBord[1].style.top = '10px';
		scoreBord[0].style.display = 'block';
		scoreBord[0].innerHTML = score;
		setTimeout(()=>{
			scoreBord[1].style.top = '-50px';
			scoreBord[0].style.top = '0px';
			scoreBord[1].style.display = 'none';
		}, 10)
	}
}
function someRepeted() {
	for(i=arr.length-1;i>0;i--){
		arr[i][0] = arr[i-1][0];
		arr[i][1] = arr[i-1][1];
	}
	for(i=1;i<snack.length;i++){
		snack[i].style.left = arr[i][1]+'px';
		snack[i].style.top = arr[i][0]+'px';
	}
}
function changeSize() {
	arr.push([arr[arr.length-1][0], arr[arr.length-1][1]]);
	let div =  document.createElement("div");
	div.setAttribute('class', 'snack');
	div.style.height = snackSize+"px";
	div.style.width = snackSize+"px";
	document.body.appendChild(div);
}
function checkBite() {
	count = 0;
	if(arr[0][0] >= screen.availHeight || arr[0][1] >= screen.availWidth || arr[0][0] <= 0 || arr[0][1] <=0){
		clearAllInterval();
		endGame();
	}
}
function endGame(){
	var bestScore = localStorage.getItem("bestScore");
	if(bestScore == null) bestScore = 0;
	else bestScore = parseInt(bestScore);
	bestScore = bestScore>point?bestScore:point;

	endGameBord = document.getElementById('end-game-bord');
	endGameBord.style.display = 'block';
	document.getElementById('currunt-score').innerHTML = "Currunt Score: "+point;
	bestScoreContainer =  document.getElementById('best-score');
	bestScoreContainer.innerHTML = "Best Score: "+bestScore;
	if(point == bestScore) bestScoreContainer.innerHTML += "<span class='new'> new</span>";
	localStorage.setItem("bestScore", bestScore);
	document.getElementById('cross-hair').onclick = ()=>{ endGameBord.style.display = 'none'; };
	document.getElementById('ok-btn').onclick = ()=>{ endGameBord.style.display = 'none'; };
	document.getElementById('restart-btn').onclick = ()=>{ location.reload(); };
}