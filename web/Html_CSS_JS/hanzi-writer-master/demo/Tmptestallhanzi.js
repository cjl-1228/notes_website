var writer;
var isCharVisible;
var isOutlineVisible;

//獲取繪畫筆順速度的值
var VarAnimationspeed = document.querySelector('[name="Animationspeed"]').value;
var VarshowHintAfterMisses = document.querySelector('[name = HintAfterMisses]').value;
var VardrawingWidth = document.querySelector('[name = drawingWidth]').value;
var AllHanzi = ['舟','灑','載','愁','讓','嘆','忌','妒','語','訣']; //此課程生字
var Hanzi_index = 0;//課程生字的在陣列位置

/* console.log(VarAnimationspeed); */
function updateScroll()
{
  var element = document.getElementById("scroller")
  element.scrollTop = element.scrollHeight;
}

function printStrokePoints(data) {
  var pointStrs = data.drawnPath.points.map((point) => `{x: ${point.x}, y: ${point.y}}`);
  console.log(`[${pointStrs.join(', ')}]`);
}

//使用箭頭來調整練習的漢字
//console.log("目前是:"+Hanzi_index); 
//按下 上一個 的按鈕 <=
function Previoushanzi(){
  
  if(Hanzi_index == 0)
  {
    Hanzi_index=9;
  }
  else if(Hanzi_index>0)
  {
    Hanzi_index-=1;
  }
  /* console.log("目前是:"+Hanzi_index+"Prev"); */
  
  updateCharacter();
  getData();
  HiddenAllHintstroke();
}
//按下 下一個 的按鈕 =>
function Nexthanzi()
{
  if(Hanzi_index==9){
    Hanzi_index=0;
  }
  else if(Hanzi_index <9)
  {
    Hanzi_index+=1;
  }
  console.log("目前是:"+Hanzi_index+"next");
  
  updateCharacter();
  getData();
  HiddenAllHintstroke();
}


function updateCharacter() {
  document.querySelector('#target').innerHTML = '';
  var character = document.querySelector('.js-char').value;

  window.location.hash = character;
  writer = HanziWriter.create('target', AllHanzi[Hanzi_index], {
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

//移除全筆畫提示
function HiddenAllHintstroke(){
  document.getElementById("docs-target-HintAllstroke").innerHTML = '';
}

function ClearTmpSvg()
{
  document.getElementById("tmp-svg").innerHTML = '';
}


window.onload = function () {
  
  var char = decodeURIComponent(window.location.hash.slice(1));
  if (char) {
    document.querySelector('.js-char').value = char;
  }
  CourseAllHanzi2(); //此課程漢字
  HiddenCanvas(); //隱藏畫布 除非按下進階練習
  updateCharacter();//更新 如有變動工具列數值等等
  getData();
  //按下確定
  document.querySelector('.js-char-form').addEventListener('submit', function (evt) {
    evt.preventDefault();
    updateCharacter();
  });


  //案下 show/hide
  document.querySelector('.js-toggle').addEventListener('click', function () {
    isCharVisible ? writer.hideCharacter() : writer.showCharacter();
    isCharVisible = !isCharVisible;
    HiddenCanvas();
  });
  //按下Outline on/off
  document.querySelector('.js-toggle-hint').addEventListener('click', function () {
    isOutlineVisible ? writer.hideOutline() : writer.showOutline();
    isOutlineVisible = !isOutlineVisible;
    HiddenCanvas();
  });

  //按下animate動畫播放
  document.querySelector('.js-animate').addEventListener('click', function () {
    VarAnimationspeed = document.querySelector('[name="Animationspeed"]').value; //繪畫速度
    
    /* console.log(Animationspeed); */
    updateCharacter();
    writer.animateCharacter();
    HiddenCanvas();
  });
  //按下測驗按鈕
  document.querySelector('.js-quiz').addEventListener('click', function () {
    VarshowHintAfterMisses = document.querySelector('[name="HintAfterMisses"]').value; //錯誤提示
    VardrawingWidth = document.querySelector('[name="drawingWidth"]').value //筆畫粗細
    updateCharacter();
    HiddenCanvas();
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
    /* target.appendChild(svg); *///如果有需要再放置 因為我沒有要放入div target中
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
  

  //按下筆順提示按鈕
  var el = document.querySelector(".hint-allstroke");
  el.onclick = function(){
    AllHintStroke();
  }
  //全筆順提示
  function AllHintStroke()
  {
    /* var testInput = document.getElementById("input-char"); */
    HanziWriter.loadCharacterData(AllHanzi[Hanzi_index]).then(function(charData) {
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
  function HiddenAllHintstroke(){
    if(document.getElementById("docs-target-HintAllstroke").innerHTML != '')
    {
      console.log("清除");
      document.getElementById("docs-target-HintAllstroke").innerHTML = '';
    }
    
  }
  ok.addEventListener("click", HiddenAllHintstroke);



  /* var el2 = document.querySelector(".reload-submit-char");
  el2.onclick = function(){
    //將所練習的漢字 存放置div(按下update)
    var character = document.querySelector('.js-char').value;
    HanziWriter.loadCharacterData(character).then(function(charData) {
          var target = document.getElementById('tmp-svg');//存放按下確定後的所有漢字 div
          var svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
          svg.style.width = '100px';
          svg.style.height = '100px';
          svg.style.border='1px solid black';
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
  } */
    
  

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
//取得此課程的所有漢字
var  statAllHanzi = ['舟','灑','載','愁','讓','嘆','忌','妒','語','訣'];
function CourseAllHanzi(){
    /* var character = document.querySelector('.js-char').value; */
    
     //此課程生字
    var target = document.getElementById('tmp-svg');//存放按下確定後的所有漢字 div
    
    for (var i = 0; i < statAllHanzi.length; i++) {
        
        HanziWriter.loadCharacterData(statAllHanzi[i]).then(function(charData) {
            var svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
            svg.style.width = '100px';
            svg.style.height = '100px';
            svg.style.border='1px solid black';
            target.appendChild(svg);

            var group = document.createElementNS('http://www.w3.org/2000/svg', 'g');
          
            // set the transform property on the g element so the character renders at 150x150
            var transformData = HanziWriter.getScalingTransform(100, 100);
            group.setAttributeNS(null, 'transform', transformData.transform);
            svg.appendChild(group);
            
            target.appendChild(document.createElement("br"));
            /* target.appendChild(document.createElement("br")); */
          
            charData.strokes.forEach(function(strokePath) {
              var path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
              path.setAttributeNS(null, 'd', strokePath);
              // style the character paths
              path.style.fill = '#555';
              group.appendChild(path);
            });
            target.appendChild(svg);
            
          }); 
    } 
}
//此方法async/await 僅適用於現代瀏覽器 舊瀏覽器須注意
//HanziWriter.loadCharacterData() 是非同步的函數
//取得此課程的所有漢字
async function CourseAllHanzi2() {
  var target = document.getElementById('tmp-svg');
  
  for (var i = 0; i < statAllHanzi.length; i++) {
    var charData = await HanziWriter.loadCharacterData(statAllHanzi[i]);
    
    var svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.style.width = '100px';
    svg.style.height = '100px';
    svg.style.border = '1px solid black';
    target.appendChild(svg);

    var group = document.createElementNS('http://www.w3.org/2000/svg', 'g');

    var transformData = HanziWriter.getScalingTransform(100, 100);
    group.setAttributeNS(null, 'transform', transformData.transform);
    svg.appendChild(group);

    target.appendChild(document.createElement("br"));

    charData.strokes.forEach(function(strokePath) {
      var path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      path.setAttributeNS(null, 'd', strokePath);
      path.style.fill = '#555';
      group.appendChild(path);
    });

    target.appendChild(svg);
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



//隱藏繪畫區
function HiddenCanvas()
{
  //隱藏繪畫區塊
  document.getElementById("div-canvas").style.display="none";
}

//按下進階測驗
document.querySelector('.js-hardquiz').addEventListener('click', function () {
  document.getElementById("div-canvas").style.display="";//顯示繪畫區塊
    //canvas
    // Canvas DOM 元素 
    const canvas = document.getElementById('canvas')
    const ctx = canvas.getContext('2d')
    var clear = document.getElementById("clear-canvas");
    var select_color = document.querySelector('[name=color]:checked')

    ctx.strokeStyle = select_color.value;
    
    //起始點座標
    let x1= 0
    let y1= 0

    // 終點座標
    let x2= 0
    let y2= 0

    // 宣告一個 hasTouchEvent 變數，來檢查是否有 touch 的事件存在
    const hasTouchEvent = 'ontouchstart' in window ? true : false

    // 透過上方的 hasTouchEvent 來決定要監聽的是 mouse 還是 touch 的事件
    const downEvent = hasTouchEvent ? 'ontouchstart' : 'mousedown'
    const moveEvent = hasTouchEvent ? 'ontouchmove' : 'mousemove'
    const upEvent = hasTouchEvent ? 'touchend' : 'mouseup'

    // 宣告 isMouseActive 為滑鼠點擊的狀態，因為我們需要滑鼠在 mousedown 的狀態時，才會監聽 mousemove 的狀態
    let isMouseActive = false

    canvas.addEventListener(downEvent, function(e){
      isMouseActive = true
    })

    canvas.addEventListener(downEvent, function(e){
      isMouseActive = true  
      x1 = e.offsetX
      y1 = e.offsetY
      
      ctx.lineWidth = 5
      ctx.lineCap = 'round'
      ctx.lineJoin = 'round'
    })

    canvas.addEventListener(moveEvent, function(e){
          if(!isMouseActive){
            return
          }
          // 取得終點座標
          x2 = e.offsetX
          y2 = e.offsetY
          
          // 開始繪圖
          ctx.beginPath()
          ctx.moveTo(x1, y1)
          ctx.lineTo(x2, y2)
          ctx.stroke()
          
          // 更新起始點座標
          x1 = x2
          y1 = y2
    })

    canvas.addEventListener(upEvent, function(e){
      isMouseActive = false
    })
    //清除畫布按鈕
clear.onclick= function(){
  console.log("111");
  canvas.width = canvas.width;
  canvas.height = canvas.height;
}
});


//下載所繪製的圖片
function download(selector) {
  const canvas = document.querySelector(selector);
  const ctx = canvas.getContext('2d');
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  

  for (let i = 0; i < imageData.data.length; i += 4) {
    if (imageData.data[i + 3] === 0) {
      imageData.data[i] = 255;
      imageData.data[i + 1] = 255;
      imageData.data[i + 2] = 255;
      imageData.data[i + 3] = 255;
    }
  }
  // 绘制白色背景和所有绘制内容
  ctx.putImageData(imageData, 0, 0);
  // 将画布转换为数据 URL 并创建图像元素
  const dataURL = canvas.toDataURL('image/png');
  const img = new Image();
  img.src =  dataURL;
  
  // 创建链接并下载
  const link = document.createElement('a');
  link.download = '文件名称';
  link.href =  dataURL;
  link.click();
  clear.onclick();
}

const lis = document.querySelectorAll('li');
lis.forEach(li => {
  li.addEventListener('click', () => {
    const ctx = canvas.getContext('2d')
    var select_color = document.querySelector('[name=color]:checked')

    ctx.strokeStyle = select_color.value;
  });
});


//class 功能
function hasClass(el, className) {
  if (el.classList)
      return el.classList.contains(className);
  else
      return !!el.className.match(new RegExp('(\\s|^)' + className + '(\\s|$)'));
}
    
function addClass(el, className) {
  if (el.classList)
      el.classList.add(className);
  else if (!hasClass(el, className)) {
      el.className += " " + className;
  }
}

function removeClass(el, className) {
  if (el.classList)
      el.classList.remove(className);
  else if (hasClass(el, className)) {
      var reg = new RegExp('(\\s|^)' + className + '(\\s|$)');
      el.className=el.className.replace(reg, ' ');
  }
}

//按下按鈕 更改顏色 讓被點選按鈕更醒目。 
var lastButton = null;
function pressBtnColor(id) {
  var button = document.getElementById(id);
  /* console.log(button); */
  if (lastButton != null) {
    console.log('1');
    lastButton.classList.remove("btn-primary");
    lastButton.classList.add("btn-outline-primary");
  }
  if (!button.classList.contains("btn-primary")) { //沒有btn-primary 就執行這
    console.log('2');
    button.classList.remove("btn-outline-primary");
    button.classList.add("btn-primary");
    lastButton = button;
  } else {//有btn-primary
    console.log('3');
    button.classList.remove("btn-primary");
    button.classList.add("btn-outline-primary");
    lastButton = null;
  }

  
}