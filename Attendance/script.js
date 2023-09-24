let Students = [{}];
/*
    let Students = [
        {
            'RollNumber':1;
            'Name':'Name1'
        }
    ]
    // or fetch from other file 

*/		
fetch('students.json').then(res=>res.json()).then((res=>{Students = res}));
let rollDisplay = document.getElementById('roll-no');
let nextBtn = document.getElementById('next-btn');
let previusBtn = document.getElementById('previus-btn');
let absentBtn = document.getElementById('absent-btn');
let digits = document.getElementsByClassName('number');
let absentRolls = document.getElementById('absent-roll');
let classInfo = document.getElementById('class-info');
let namePlate = document.getElementById('name-plate');
let audioBtn = document.getElementById('speaker-div');
let copyBtn = document.getElementById('copy-btn');
let changeTheme = document.getElementById('change-theme');
let downloadBtn = document.getElementById('download-btn');
let voiceSelectOption = document.getElementById('select-voice');

let isAudio = true;
let outString = "A: ";
let arr = [];
let roollNumber = [0, 0, 1];
let roll = 0;
let speaker = new SpeechSynthesisUtterance();

if(!localStorage.siteObj){
    addToLocalStorage({
        isDark:true,
        isAudio: true,
        speechRate: 1,
        volume:1,
        voice: 0
    });
}

{
    isAudio = getToLocalStorage('isAudio');
    changeTheme.checked = getToLocalStorage('isDark');
    if(!isAudio){
        audioBtn.style.border = '2px solid darkgrey';
        audioBtn.innerHTML = '<svg width="30px" height="30px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M16 9L22 15M22 9L16 15M13 3L7 8H5C3.89543 8 3 8.89543 3 10V14C3 15.1046 3.89543 16 5 16H7L13 21V3Z" stroke="#000000" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>'
        audioBtn.firstChild.firstChild.style.stroke = 'darkgrey'
    }
    if(changeTheme.checked){
        let r = document.querySelector(':root');
        darkTheme(r);
    }
    document.getElementById('speech-rate').value = getToLocalStorage('speechRate');
    document.getElementById('volume-changer').value = getToLocalStorage('volume')*100;
    speaker.rate = getToLocalStorage('speechRate');
    speaker.volume = getToLocalStorage('volume');
    speaker.voice = speechSynthesis.getVoices()[getToLocalStorage('voice')];
}

document.body.addEventListener('keyup', (e)=>{
    if(e.key == 'ArrowRight') increaseRoll();
    else if(e.key == 'ArrowLeft') previus();
    else if(e.key == 'ArrowDown' || e.key == 'ArrowUp') addAbsent();
})
speechSynthesis.addEventListener("voiceschanged", () => {
    let temp = speechSynthesis.getVoices()
    let voiceIndex = getToLocalStorage('voice');
    speaker.voice = speechSynthesis.getVoices()[getToLocalStorage('voice')];
    voiceSelectOption.innerHTML = temp.map((e, index)=>{
        if(index == voiceIndex) 
            return `<option value="${e.name}" selected>${e.name}</option>`
        return `<option value="${e.name}">${e.name}</option>`
    }).join('');
})
voiceSelectOption.addEventListener('click', (e)=>{
    let classIndex = voiceSelectOption.selectedIndex;
    speaker.voice = speechSynthesis.getVoices()[classIndex];
    addToLocalStorage({voice:classIndex});
})
nextBtn.addEventListener('click', ()=>{increaseRoll()})
previusBtn.addEventListener('click', ()=>{previus()})
absentBtn.addEventListener('click', addAbsent);

function showSpeakerMenu(e){
    let temp = document.getElementById('context-menu');
    temp.style.display = 'block';
    temp.style.top = e.y+"px";
    temp.style.left = e.x+"px";
    setTimeout(()=>{document.body.addEventListener('click', function tempFunction(f){
        if(!temp.contains(f.target)){
            temp.style.display = 'none';
            this.removeEventListener("click", tempFunction)
        }
    })}, 100);
}

audioBtn.addEventListener('click', ()=>{
    if(!isAudio){
        audioBtn.style.border = '2px solid seagreen';
        audioBtn.innerHTML = '<svg width="30px" height="30px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M16 9C16.5 9.5 17 10.5 17 12C17 13.5 16.5 14.5 16 15M19 6C20.5 7.5 21 10 21 12C21 14 20.5 16.5 19 18M13 3L7 8H5C3.89543 8 3 8.89543 3 10V14C3 15.1046 3.89543 16 5 16H7L13 21V3Z" stroke="#000000" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>'

    }
    else{
        audioBtn.style.border = '2px solid darkgrey';
        audioBtn.innerHTML = '<svg width="30px" height="30px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M16 9L22 15M22 9L16 15M13 3L7 8H5C3.89543 8 3 8.89543 3 10V14C3 15.1046 3.89543 16 5 16H7L13 21V3Z" stroke="#000000" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>'
        audioBtn.firstChild.firstChild.style.stroke = 'darkgrey'
    }
    isAudio = !isAudio;
    addToLocalStorage({isAudio: isAudio});
})
copyBtn.addEventListener('click', ()=>{
    navigator.clipboard.writeText(absentRolls.value);
    copyBtn.innerHTML = '<svg width="25px" height="25px" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg" fill="none"><path stroke="#000000" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 5L8 15l-5-4"/></svg>'
    setTimeout(()=>{copyBtn.innerHTML = '<svg width="25px" height="25px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M21 8C21 6.34315 19.6569 5 18 5H10C8.34315 5 7 6.34315 7 8V20C7 21.6569 8.34315 23 10 23H18C19.6569 23 21 21.6569 21 20V8ZM19 8C19 7.44772 18.5523 7 18 7H10C9.44772 7 9 7.44772 9 8V20C9 20.5523 9.44772 21 10 21H18C18.5523 21 19 20.5523 19 20V8Z" fill="#0F0F0F"/><path d="M6 3H16C16.5523 3 17 2.55228 17 2C17 1.44772 16.5523 1 16 1H6C4.34315 1 3 2.34315 3 4V18C3 18.5523 3.44772 19 4 19C4.55228 19 5 18.5523 5 18V4C5 3.44772 5.44772 3 6 3Z" fill="#0F0F0F"/></svg>'}, 2000);
    
})
downloadBtn.addEventListener('click', ()=>{
    let element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(absentRolls.value));
    let time = new Date();
    element.setAttribute('download',
    'attandance_'+time.getDay()+'-'+time.getMonth()+'-'+time.getFullYear()+'_'+time.getHours()+':'+time.getMinutes()+'_sem3.txt');
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    downloadBtn.innerHTML = '<svg width="25px" height="25px" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg" fill="none"><path stroke="#000000" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 5L8 15l-5-4"/></svg>'
    setTimeout(()=>{downloadBtn.innerHTML = '<svg width="25px" height="25px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M16 11L12 15M12 15L8 11M12 15V3M21 15V17C21 18.1046 20.1046 19 19 19H5C3.89543 19 3 18.1046 3 17V15" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>'}, 2000);
})

document.getElementById('speech-rate').addEventListener('change', (e)=>{
    speaker.rate = e.target.value;
    addToLocalStorage({speechRate:speaker.rate});
})
document.getElementById('volume-changer').addEventListener('change', (e)=>{
    speaker.volume = e.target.value/100;
    addToLocalStorage({volume:speaker.volume});
})

changeTheme.addEventListener('click', ()=>{
    let r = document.querySelector(':root');
    if(changeTheme.checked)
    darkTheme(r);
    else
    lightTheme(r);
})


function isDuplicate(arr, e){
    for(i of arr)
    if(i === e) return true;
    return false;
}
function addAbsent(){
    if (!isDuplicate(arr, roll) && roll != 0 && roll%100 != 0){
        arr.push(roll);
        updateTextArea();
    }
    increaseRoll();
}
function increaseRoll(p=2, index=1){
    if(roll >= 565) return;
    if((roollNumber[0]+""+roollNumber[1]) >= 65){
        roll = roll+100-65;
        for (i of digits)
            i.innerHTML = 0;
        roollNumber = [0,0, roll/100];
        classInfo.innerHTML = roll/100;

        let tempClass= '';
        if(roollNumber[2]== 2) tempClass = 'B: '
        else if(roollNumber[2]== 3) tempClass = 'C: '
        else if(roollNumber[2]== 4) tempClass = 'D: '
        else if(roollNumber[2]== 5) tempClass = 'H: '
        outString+= "\n\n"+tempClass;
    }
    if(digits[p].style.display == 'block'){
        digits[p].style.display = 'none';
        digits[p+1].style.display = 'block';
        if(roollNumber[index] == 9){
            roollNumber[index] = 0;
            digits[p+1].innerHTML = roollNumber[index];
            increaseRoll(0, 0);
        }
        else digits[p+1].innerHTML = ++roollNumber[index];
    }
    else{
        digits[p+1].style.display = 'none';
        digits[p].style.display = 'block';
        if(roollNumber[index] == 9){
            roollNumber[index] = 0
            digits[p].innerHTML = roollNumber[index];
            increaseRoll(0, 0);
        }
        else digits[p].innerHTML = ++roollNumber[index];
    }
    roll = parseInt(roollNumber[2]+""+roollNumber[0]+""+roollNumber[1]);
    if(Students.filter(data=>roll == data.RollNumber).length == 1)
        var [{Name}] = Students.filter(data=>roll == data.RollNumber);
    namePlate.innerHTML = Name;
    if(isAudio && p!=0){
        if( roll%100 < 10) {speaker.text = roollNumber[2]+" 0 "+roollNumber[1]; }
        else { speaker.text = roll%100; }
        speechSynthesis.speak(speaker);   
    }
}
function previus(p=2, index=1){
    if((roollNumber[0]+""+roollNumber[1]) > 0){
        if(digits[p].style.display == 'block'){
            digits[p].style.display = 'none';
            digits[p+1].style.display = 'block';
            if(roollNumber[index] == 0 && roollNumber[0] != 0){
                roollNumber[index] = 9;
                digits[p+1].innerHTML = roollNumber[index];
                previus(0, 0);
            }
            else digits[p+1].innerHTML = --roollNumber[index];
        }
        else{
            digits[p+1].style.display = 'none';
            digits[p].style.display = 'block';
            if(roollNumber[index] == 0 && roollNumber[0] != 0){
                roollNumber[index] = 9
                digits[p].innerHTML = roollNumber[index];
                previus(0, 0);
            }
            else digits[p].innerHTML = --roollNumber[index];
        }
        roll = parseInt(roollNumber[2]+""+roollNumber[0]+""+roollNumber[1]);
        if(Students.filter(data=>roll == data.RollNumber).length ==1)
            var [{Name}] = Students.filter(data=>roll == data.RollNumber);
        namePlate.innerHTML = Name;  
    }
    if(roll < arr[arr.length-1]) arr.pop();
    let tempArray = outString.split(', ');
    if(tempArray[tempArray.length-1].charAt(1) == ':'){
        tempArray = tempArray[tempArray.length-1].split(' ');
        if(roll < tempArray[1]) outString = tempArray[0]+" ";
    }
    else{
        if(roll < tempArray[tempArray.length-1]) tempArray.pop();
        outString = tempArray.join(', ');
    }
    absentRolls.innerHTML = outString;
}
function updateTextArea(){
    if(outString[outString.length-2]== ':') outString += roll;
    else outString +=", "+roll;
    absentRolls.innerHTML = outString;
}
function darkTheme(r) {
    r.style.setProperty('--back-color', '#222')
    r.style.setProperty('--txt-color', 'grey')
    r.style.setProperty('--light-bg-color', '#333')
    r.style.setProperty('--hover-color', '#333')
    addToLocalStorage({isDark:true});
}
function lightTheme(r) {
    r.style.setProperty('--back-color', 'white')
    r.style.setProperty('--txt-color', '#333')
    r.style.setProperty('--light-bg-color', 'whitesmoke')
    r.style.setProperty('--hover-color', '#ddd')
    addToLocalStorage({isDark:false});
}
function classChange(){
    let temp = document.getElementById('class-choose');
    let classIndex = temp.selectedIndex+1;
    outString = temp.options[classIndex-1].value+": ";
    roollNumber[2] = classIndex;
    roll = classIndex*100;
    classInfo.innerHTML = classIndex;
}
function addToLocalStorage(argsObj){
    let obj = {};
    if(localStorage.siteObj)
        obj = JSON.parse(localStorage.siteObj);
    obj = {...obj, ...argsObj}
    localStorage.setItem('siteObj', JSON.stringify(obj));
}
function getToLocalStorage(key){
    let obj = {};
    if(localStorage.siteObj)
        obj = JSON.parse(localStorage.siteObj);
    return obj[key];
}
