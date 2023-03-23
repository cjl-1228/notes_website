var writer;
var isCharVisible;
var isOutlineVisible;
//獲取繪畫筆順速度的值

var VarAnimationspeed = document.querySelector('[name="Animationspeed"]').value;
var VarshowHintAfterMisses = document.querySelector('[name = HintAfterMisses]').value;
var VardrawingWidth = document.querySelector('[name = drawingWidth]').value;

console.log(VarAnimationspeed);
function updateScroll()
{
  var element = document.getElementById("scroller")
  element.scrollTop = element.scrollHeight;
}

function printStrokePoints(data) {
  var pointStrs = data.drawnPath.points.map((point) => `{x: ${point.x}, y: ${point.y}}`);
  console.log(`[${pointStrs.join(', ')}]`);
}

function updateCharacter() {
  document.querySelector('#target').innerHTML = '';
  var character = document.querySelector('.js-char').value;

  window.location.hash = character;
  writer = HanziWriter.create('target', character, {
    width: 400,
    height: 400,
    renderer: 'svg',
    radicalColor: '#166E16',
    onCorrectStroke: printStrokePoints,
    onMistake: printStrokePoints,
    showCharacter: false,
    strokeAnimationSpeed: VarAnimationspeed, //繪製筆畫速度
    strokeHighlightSpeed: 0.4, //提示筆畫速度
    highlightColor: '#ffa500', //提示顏色
    showHintAfterMisses: VarshowHintAfterMisses, //錯誤幾次才提示
    drawingWidth: VardrawingWidth, //繪製筆寬度 
  });
  isCharVisible = true;
  isOutlineVisible = true;
  window.writer = writer;
}

window.onload = function () {
  var char = decodeURIComponent(window.location.hash.slice(1));
  if (char) {
    document.querySelector('.js-char').value = char;
  }
  
  updateCharacter();
  

  document.querySelector('.js-char-form').addEventListener('submit', function (evt) {
    evt.preventDefault();
    updateCharacter();
  });

  //案下 show/hide
  document.querySelector('.js-toggle').addEventListener('click', function () {
    isCharVisible ? writer.hideCharacter() : writer.showCharacter();
    isCharVisible = !isCharVisible;
  });
  //按下Outline on/off
  document.querySelector('.js-toggle-hint').addEventListener('click', function () {
    isOutlineVisible ? writer.hideOutline() : writer.showOutline();
    isOutlineVisible = !isOutlineVisible;
  });

  //按下animate動畫播放
  document.querySelector('.js-animate').addEventListener('click', function () {
    VarAnimationspeed = document.querySelector('[name="Animationspeed"]').value; //繪畫速度
    
    /* console.log(Animationspeed); */
    updateCharacter();
    writer.animateCharacter();
  });
  //按下測驗按鈕
  document.querySelector('.js-quiz').addEventListener('click', function () {
    VarshowHintAfterMisses = document.querySelector('[name="HintAfterMisses"]').value; //錯誤提示
    VardrawingWidth = document.querySelector('[name="drawingWidth"]').value //筆畫粗細
    updateCharacter();
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
    writer.quiz(opts);
  });

  //全筆畫提示順序
  function renderFanningStrokes(target, strokes) {
    /* var node=document.createElement("div"); */
    var docs_target_div = document.getElementById("docs-target-HintAllstroke");
    var svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.style.width = '50px';
    svg.style.height = '50px';
    svg.style.border = '1px solid #EEE'
    svg.style.marginRight = '1px'
    target.appendChild(svg);//如果有需要再放置 因為我沒有要放入div target中
    var group = document.createElementNS('http://www.w3.org/2000/svg', 'g');
  
    // set the transform property on the g element so the character renders at 75x75
    var transformData = HanziWriter.getScalingTransform(50, 50);
    group.setAttributeNS(null, 'transform', transformData.transform);
    svg.appendChild(group);
    /* node.appendChild(svg); */
    strokes.forEach(function(strokePath) {
      var path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      path.setAttributeNS(null, 'd', strokePath);
      // style the character paths
      path.style.fill = '#555';
      group.appendChild(path);
    });
    
      docs_target_div.appendChild(svg);
      docs_target_div.appendChild(document.createElement("br"));
    /* document.getElementById("docs-target-11").appendChild(node); */
  }
  

  //全筆順提示按鈕
  var el = document.querySelector(".hint-allstroke");
  el.onclick = function(){
    var testInput = document.getElementById("input-char");
    HanziWriter.loadCharacterData(testInput.value).then(function(charData) {
      console.log(testInput.value);
          var target_hint = document.getElementById('target');
          /* console.log(target_hint+"11"); */
          if(document.getElementById("docs-target-HintAllstroke").innerHTML != '')
          {
            document.getElementById("docs-target-HintAllstroke").innerHTML = '';
          }
          else{
            for (var i = 0; i < charData.strokes.length; i++) {
              var strokesPortion = charData.strokes.slice(0, i + 1);
              renderFanningStrokes(target_hint, strokesPortion);
              /* console.log(strokesPortion+i+"222222"); */
            }
          }
        });

  }
  //目前按下update 全筆順提示要消失
  function AllHintstroke(){
    document.getElementById("docs-target-HintAllstroke").innerHTML = '';
  }
  ok.addEventListener("click", AllHintstroke);



  var el2 = document.querySelector(".reload-submit-char");
  el2.onclick = function(){
    //顯示所有練習的漢字(按下update)
    var character = document.querySelector('.js-char').value;
    HanziWriter.loadCharacterData(character).then(function(charData) {
          var target = document.getElementById('tmp-svg');//存放按下確定後的所有漢字 div
          var svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
          svg.style.width = '100px';
          svg.style.height = '100px';
          svg.style.border='1px solid black';
          /* svg.style.background = 'url("data:image/svg+xml;utf8,' + 
          '<svg xmlns=\'http://www.w3.org/2000/svg\' width=\'100\' height=\'100\' viewBox=\'0 0 512 512\'>'+
          '<line x1=\'0\' y1=\'0\' x2=\'100\' y2=\'100\' stroke=\'#222\' />' +
          '<line x1=\'100\' y1=\'0\' x2=\'0\' y2=\'100\' stroke=\'#222\' />' +
          '<line x1=\'50\' y1=\'0\' x2=\'50\' y2=\'100\' stroke=\'#222\' />' +
          '<line x1=\'0\' y1=\'50\' x2=\'100\' y2=\'50\' stroke=\'#222\' />' +
          '</svg>")'; */
          target.appendChild(svg);
          var group = document.createElementNS('http://www.w3.org/2000/svg', 'g');
        
          // set the transform property on the g element so the character renders at 150x150
          var transformData = HanziWriter.getScalingTransform(100, 100);
          group.setAttributeNS(null, 'transform', transformData.transform);
          svg.appendChild(group);
          
          target.appendChild(document.createElement("br"));
          target.appendChild(document.createElement("br"));
        
          charData.strokes.forEach(function(strokePath) {
            var path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
            path.setAttributeNS(null, 'd', strokePath);
            // style the character paths
            path.style.fill = '#555';
            group.appendChild(path);
          });
        });
  }
    
  


};



//語音播報 漢字資訊
const msg = new SpeechSynthesisUtterance(); //come from WEB Speech API
let voices = [];
/* const voicesDropdown = document.querySelector('[name="voice"]'); */
const options = document.querySelectorAll('[type="range"], [id="t1-option"]');
const speakButton = document.querySelector('#speak');


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



//取得漢字的資訊
function getData()
{
  var a = document.querySelector('.js-char').value;
  var xhr = new XMLHttpRequest();
  let s = "https://www.moedict.tw/raw/" + a

  xhr.open("GET", s, true);
  xhr.onreadystatechange = function () {
      if (xhr.readyState === 4 && xhr.status === 200) {
          var data = JSON.parse(xhr.responseText);
          var w_data = [data["title"], data["radical"], data["stroke_count"], data["heteronyms"][0]["bopomofo"]];
          var s = w_data[0] + ", " + w_data[1] + "部, " + "共" + w_data[2] + "畫, " + w_data[3]
          msg.text = s;
          /* document.querySelector('[name="text"]').innerHTML=s */

          text2 = "<table> <tr>";

          text2 += "<th bgcolor='#adb5bd'>" +"部首"+"</th>";
          text2 += "<th >" + w_data[1] + "</th>";

          text2 += "<th bgcolor='#adb5bd'>" +"總筆畫"+"</th>";
          text2 += "<th>" + w_data[2] + "</th>";

          text2 += "</tr></table>";
          document.getElementById("char-dictionary").innerHTML = text2;
      }
  };
  xhr.send();
}
ok.addEventListener("click", getData);
speechSynthesis.addEventListener('voiceschanged',populateVoices);
/* voicesDropdown.addEventListener('change', setVoice); */

options.forEach(option => option.addEventListener('change',setOption));
speakButton.addEventListener('click',toggle);


