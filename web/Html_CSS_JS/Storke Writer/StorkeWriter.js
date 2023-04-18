var CourseHanziArray = JSON.parse(sessionStorage.getItem('CourseHanziArray')); //抓取SelectCourse.html傳來的漢字資料
var AllHanzi = CourseHanziArray; //此課程生字
var Hanzi_index = 0;//課程生字的在陣列位置
var Hanzi_SvgSize=''; //CourseAllHanzi

//判斷裝置大小 更改值
// 定義螢幕大小的媒體查詢
const pcMediaQuery = window.matchMedia('(min-width: 1140px)');
const laptopMediaQuery = window.matchMedia('(min-width: 820px) and (max-width: 1140px)');
const tabletMediaQuery = window.matchMedia('(max-width: 820px)');
const screenWidth = window.screen.availWidth;
const screenHeight = window.screen.availHeight;
console.log(`Screen size: ${screenWidth} x ${screenHeight}`);

// 定義處理螢幕大小變化的函式
function handleScreenSizeChange(e) {
  if (pcMediaQuery.matches) {
    // 螢幕大小大於等於 1140px，做出對應的處理
    Hanzi_SvgSize='120';
    console.log('PC'+Hanzi_SvgSize); 
  } else if (laptopMediaQuery.matches) {
    // 螢幕大小介於 768px 和 1023px 之間，做出對應的處理
    Hanzi_SvgSize='80';
    console.log('Laptop'+Hanzi_SvgSize);

  } else if (tabletMediaQuery.matches) {
    // 螢幕大小小於等於 767px，做出對應的處理
    Hanzi_SvgSize='50';
    console.log('Tablet'+Hanzi_SvgSize);
  }
}

// 監聽螢幕大小變化，當螢幕大小變化時執行 handleScreenSizeChange 函式
pcMediaQuery.addListener(handleScreenSizeChange);
laptopMediaQuery.addListener(handleScreenSizeChange);
tabletMediaQuery.addListener(handleScreenSizeChange);

// 網頁載入時執行一次 handleScreenSizeChange 函式，以確保一開始的處理是正確的
handleScreenSizeChange();



//請勿動 筆順練習時需要以下數值來讀取繪畫筆畫位置 。
function printStrokePoints(data) {
  var pointStrs = data.drawnPath.points.map((point) => `{x: ${point.x}, y: ${point.y}}`);
  console.log(`[${pointStrs.join(', ')}]`);
}

window.onload = function () {
    
    CourseAllHanzi()//取得此課程的所有漢字
    updateCharacter();//更新 如有變動工具列數值等等
    getData();//漢字 部首 注音
    document.querySelector('#animation').addEventListener('click', function () {
      /* target.classList.remove('pen-icon');//移除鼠標樣式 */
      /* VarAnimationspeed = document.querySelector('[name="Animationspeed"]').value; //繪畫速度 */
      
      /* console.log(Animationspeed); */
      updateCharacter();
      getData();
      writer.animateCharacter();
      /* HiddenCanvas(); */
    });
    //按下測驗按鈕
    document.querySelector('#generally').addEventListener('click', function () {
    /* VarshowHintAfterMisses = document.querySelector('[name="HintAfterMisses"]').value; //錯誤提示
    VardrawingWidth = document.querySelector('[name="drawingWidth"]').value //筆畫粗細 */
    updateCharacter();
    /* HiddenCanvas(); */
    let i=1;
    var opts = {
      
      onMistake: function(strokeData) {
        consoleLog('目前第'+  (strokeData.strokeNum+i) +'筆畫錯誤。');
        consoleLog("你在這個筆劃上犯了 " + strokeData.mistakesOnStroke + " 個錯誤!");
        consoleLog("目前總共錯誤 " + strokeData.totalMistakes + " 次。");
        consoleLog("距離完成還有" + strokeData.strokesRemaining + "個筆畫。");
        consoleLog("");
      },
      onCorrectStroke: function(strokeData) {
        consoleLog('很好! 你畫的第' + (strokeData.strokeNum+i) + '筆畫是正確的!');
        consoleLog("你在這個筆劃上犯了 " + strokeData.mistakesOnStroke + " 個錯誤!");
        consoleLog("目前總共錯誤 " + strokeData.totalMistakes+ " 次。");
        consoleLog("距離完成還有" + strokeData.strokesRemaining + "個筆畫。");
        consoleLog("");
      },
      onComplete: function(summaryData) {
        consoleLog('Ya~你完成了! 你畫完' + summaryData.character +"這個字了");
        consoleLog("總共錯誤 " + summaryData.totalMistakes + " 次。");
        consoleLog("");
      }
    }
    writer.quiz();
  });
};










//取得此課程的所有漢字 此方法async/await 僅適用於現代瀏覽器 舊瀏覽器須注意 HanziWriter.loadCharacterData() 是非同步的函數
//以下數字180px皆須依device 調整
//平板150px
async function CourseAllHanzi() 
{
    var target = document.getElementById('tmp-svg'); //存放按下確定後的所有漢字 div
    let size =Hanzi_SvgSize+'px';
    /* console.log(size); */
    for (var i = 0; i < AllHanzi.length; i++) {
      var charData = await HanziWriter.loadCharacterData(AllHanzi[i]);
      
      var svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      svg.style.width = size;
      svg.style.height = size;
      svg.style.border = '1px solid black';
      target.appendChild(svg);
  
      var group = document.createElementNS('http://www.w3.org/2000/svg', 'g');
      // set the transform property on the g element so the character renders at 150x150
      var transformData = HanziWriter.getScalingTransform(Hanzi_SvgSize, Hanzi_SvgSize);
      group.setAttributeNS(null, 'transform', transformData.transform);
      svg.appendChild(group);0
  
      target.appendChild(document.createElement("br"));
      target.appendChild(document.createElement("br"));
  
      charData.strokes.forEach(function(strokePath) {
        var path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        path.setAttributeNS(null, 'd', strokePath);
        // style the character paths
        path.style.fill = '#555';
        group.appendChild(path);
      });
  
      
    }
  }
function updateCharacter() {
    /* 取得筆順區塊大小 */
    const divElement = document.getElementById('StrokeBlock');
    const divWidth = divElement.clientWidth;
    const divHeight = divElement.clientHeight;
    document.querySelector('#target').innerHTML = '';
    /* var character = document.querySelector('.js-char').value; */
  
    /* window.location.hash = character; */
    
    writer = HanziWriter.create('target', AllHanzi[Hanzi_index], {
      width: divWidth,
      height: divHeight,
      renderer: 'svg',
      onCorrectStroke: printStrokePoints,
      onMistake: printStrokePoints,
      radicalColor: '#166E16',//部首顏色
      showCharacter: false,
      strokeHighlightSpeed: 0.4, //提示筆畫速度
      highlightColor: '#ffa500', //提示顏色
      drawingWidth: 15, //繪製筆寬度 
    });
    isCharVisible = true;
    isOutlineVisible = true;
    window.writer = writer;
  }

//使用箭頭來調整練習的漢字
function Previoushanzi()//按下 上一個 的按鈕 <=
{
  //如果是在第一個漢字 按下 "上一個箭頭"漢字就會到最後一個漢字
  if(Hanzi_index == 0)
  {
    Hanzi_index= AllHanzi.length-1
    /* console.log("到最後一個漢字"); */
  }
  else if(Hanzi_index>0)
  {
    Hanzi_index-=1;
  }
  /* console.log("目前是:"+Hanzi_index+"Prev"); */
  
  updateCharacter();
  getData();
  /* HiddenAllHintstroke();
  HiddenCanvas(); */
}

function Nexthanzi()//按下 下一個 的按鈕 =>
{
  //如果是在最後一個漢字 按下 "下一個箭頭"漢字就會到第一個漢字
  if(Hanzi_index== AllHanzi.length-1){
    Hanzi_index=0
  }
  else if(Hanzi_index <AllHanzi.length)
  {
    Hanzi_index+=1;
  }
  /* console.log("目前是:"+Hanzi_index+"next"); */
  
  updateCharacter();
  getData();
  /* HiddenAllHintstroke();
  HiddenCanvas(); */
}

//語音播報 漢字資訊
window.addEventListener("DOMContentLoaded", (event) => {
  const speakButton = document.querySelector('#speak');
  if (speakButton) {
    speakButton.addEventListener('click',toggle);
  }
});
const msg = new SpeechSynthesisUtterance(); //come from WEB Speech API
let voices = [];
/* const voicesDropdown = document.querySelector('[name="voice"]'); */
const options = document.querySelectorAll('[type="range"], [id="t1-option"]');



// 利用 SpeechSynthesis.getVoices()方法，取得包含所有SpeechSynthesisVoice 物件的陣列，而這些物件表示當前設備上可用之語音
function populateVoices(){
  voices = this.getVoices();
  console.log(voices);
  msg.lang = "zh-TW"
}

//觸發播放
function toggle(startOver = true){
  speechSynthesis.cancel(); // stop speaking
  if(startOver){
  speechSynthesis.speak(msg); // restart speaking
  }
}
// 改變utterance的rate,pitch屬性的值
function setOption(){
  
  if(this.name == 'rate'){
    console.log(this.name,this.value);
    msg[this.name] = this.value;
    toggle();
    console.log(this.value);
    document.getElementById("t1-option").innerHTML = this.value;
  }
 
}



//取得漢字的資訊 部首 筆畫
function getData()
{
  var a = AllHanzi[Hanzi_index];
  var xhr = new XMLHttpRequest();
  let s = "https://www.moedict.tw/raw/" + a

  xhr.open("GET", s, true);
  xhr.onreadystatechange = function () {
      if (xhr.readyState === 4 && xhr.status === 200) {
          var data = JSON.parse(xhr.responseText);
          var w_data = [data["title"], data["radical"], data["stroke_count"], data["heteronyms"][0]["bopomofo"]];
          var s = w_data[0] + ", " + w_data[1] + "部, " + "共" + w_data[2] + "畫, " + w_data[3]
          msg.text = s;
          if(w_data[1] == '{[8f54]}')//足部
          {
            const unicodeRadical = "8FB5"; // 該字的 Unicode 部首編碼
            const radicalChar = String.fromCodePoint(parseInt(unicodeRadical, 16));
            w_data[1]=radicalChar;
            console.log(radicalChar); // 顯示
          }
          else if(w_data[1] == '{[8ef3]}')
          {
            const unicodeRadical = "5E7F"; // 該字的 Unicode 部首編碼
            const radicalChar = String.fromCodePoint(parseInt(unicodeRadical, 16));
            w_data[1]=radicalChar;
            console.log(radicalChar); // 顯示
          }
          else if(w_data[1] == '{[fbfd]}')
          {
            const unicodeRadical = "5B80"; // 該字的 Unicode 部首編碼
            const radicalChar = String.fromCodePoint(parseInt(unicodeRadical, 16));
            w_data[1]=radicalChar;
            console.log(radicalChar); // 顯示
          }
          /* document.querySelector('[name="text"]').innerHTML=s */
          /* console.log(w_data[3]); */

          text2 = "<table> <tr>";

          text2 += "<th bgcolor='#adb5bd' colspan='2'>" +"部首"+"</th>";
          text2 += "<th bgcolor='#adb5bd' colspan='2'>" +"注音"+"</th>";
          text2 += "<th bgcolor='#adb5bd' colspan='2'>" +"總筆畫"+"</th>";

          text2 += "</tr><tr>";
          text2 += "<th colspan='2'>" + w_data[1] + "</th>";
          text2 += "<th colspan='2'>" + "<rt>" +  w_data[3] + "</rt>" + "</th>";
          text2 += "<th colspan='2'>" + w_data[2] + "</th>";
          

          text2 += "</tr></table>";
          document.getElementById("char-dictionary").innerHTML = text2;
      }
  };
  xhr.send();
}
/* ok.addEventListener("click", getData); */
speechSynthesis.addEventListener('voiceschanged',populateVoices);
/* voicesDropdown.addEventListener('change', setVoice); */

options.forEach(option => option.addEventListener('change',setOption));
