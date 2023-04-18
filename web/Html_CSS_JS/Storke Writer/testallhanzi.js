var writer;
var isCharVisible;
var isOutlineVisible;

//獲取繪畫筆順速度的值
var VarAnimationspeed = document.querySelector('[name="Animationspeed"]').value;
var VarshowHintAfterMisses = document.querySelector('[name = HintAfterMisses]').value;
var VardrawingWidth = document.querySelector('[name = drawingWidth]').value;
var CourseHanziArray = JSON.parse(sessionStorage.getItem('CourseHanziArray')); //如果直接開啟這網站會抓不到此網站資訊
var AllHanzi = CourseHanziArray; //此課程生字
var Hanzi_index = 0;//課程生字的在陣列位置





if(!CourseHanziArray)
{
  alert("沒有抓到課程資料，請從SelectCourse.html登入。");
  AllHanzi=['測','試'];
}

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
  HiddenAllHintstroke();
  HiddenCanvas();
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
  HiddenAllHintstroke();
  HiddenCanvas();
}



function HiddenCanvas()//左右箭頭 判斷繪畫區T F
{
  //隱藏繪畫Canvas區塊
  document.getElementById("div-canvas").style.display="none";
  showCanvas = true;//左右箭頭按下之後，在按下進階測驗才會顯示。
}


function updateCharacter() {
  document.querySelector('#target').innerHTML = '';
  /* var character = document.querySelector('.js-char').value; */

  /* window.location.hash = character; */
  writer = HanziWriter.create('target', AllHanzi[Hanzi_index], {
    width: 400,
    height: 400,
    renderer: 'svg',
    radicalColor: '#166E16',//部首顏色
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



window.onload = function () {
  
  
  var char = decodeURIComponent(window.location.hash.slice(1));
  if (char) {
    /* document.querySelector('.js-char').value = char; */
  }
  CourseAllHanzi(); //此課程漢字
  HiddenCanvas(); //隱藏畫布 除非按下進階練習
  updateCharacter();//更新 如有變動工具列數值等等
  getData();
  //按下確定
  /* document.querySelector('.js-char-form').addEventListener('submit', function (evt) {
    evt.preventDefault();
    updateCharacter();
  }); */


  //案下 show/hide
  document.querySelector('.js-toggle').addEventListener('click', function () {
    target.classList.remove('pen-icon');//移除鼠標樣式
    isCharVisible ? writer.hideCharacter() : writer.showCharacter();
    isCharVisible = !isCharVisible;
    HiddenCanvas();
  });
  //按下Outline on/off
  document.querySelector('.js-toggle-hint').addEventListener('click', function () {
    target.classList.remove('pen-icon');//移除鼠標樣式
    isOutlineVisible ? writer.hideOutline() : writer.showOutline();
    isOutlineVisible = !isOutlineVisible;
    HiddenCanvas();
  });

  //按下animate動畫播放
  document.querySelector('.js-animate').addEventListener('click', function () {
    target.classList.remove('pen-icon');//移除鼠標樣式
    VarAnimationspeed = document.querySelector('[name="Animationspeed"]').value; //繪畫速度
    
    /* console.log(Animationspeed); */
    updateCharacter();
    writer.animateCharacter();
    HiddenCanvas();
  });
  var target = document.getElementById('target');
  //按下測驗按鈕
  document.querySelector('.js-quiz').addEventListener('click', function () {
    target.classList.add('pen-icon');//鼠標樣式改變
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
    svg.style.width = '60px';
    svg.style.height = '60px';
    svg.style.border = '1px solid #EEE'
    svg.style.marginRight = '1px'
    /* target.appendChild(svg); *///如果有需要再放置 因為我沒有要放入div target中
    var group = document.createElementNS('http://www.w3.org/2000/svg', 'g');
  
    // set the transform property on the g element so the character renders at 75x75
    var transformData = HanziWriter.getScalingTransform(60, 60);
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


//取得此課程的所有漢字 此方法async/await 僅適用於現代瀏覽器 舊瀏覽器須注意 HanziWriter.loadCharacterData() 是非同步的函數
async function CourseAllHanzi() {
  var target = document.getElementById('tmp-svg'); //存放按下確定後的所有漢字 div
  
  for (var i = 0; i < AllHanzi.length; i++) {
    var charData = await HanziWriter.loadCharacterData(AllHanzi[i]);
    
    var svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.style.width = '100px';
    svg.style.height = '100px';
    svg.style.border = '1px solid black';
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
speakButton.addEventListener('click',toggle);





let showCanvas = true;//控制進階練習顯示區塊
//按下進階測驗
document.querySelector('.js-hardquiz').addEventListener('click', function () {
  target.classList.remove('pen-icon');//移除鼠標樣式

  if (showCanvas) {
    document.getElementById("div-canvas").style.display="";//顯示

  } else {
    document.getElementById("div-canvas").style.display="none";//關閉
  }
  showCanvas = !showCanvas;
  CanvasHanziBg(AllHanzi[Hanzi_index]);
    //canvas
    // Canvas DOM 元素

    const canvas = document.getElementById('canvas')
    const ctx = canvas.getContext('2d')
    

    ctx.strokeStyle = 'black'
    
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
    
    const btns = document.querySelectorAll('.btn-check');
    ctx.lineWidth = 10; //預設筆畫大小
    //根據選擇的筆順大小 來調整
    btns.forEach(btn => {
      btn.addEventListener('click', () => {
        if (btn.id === 'btnradio1') {
          ctx.lineWidth = 10;
        } else if (btn.id === 'btnradio2') {
          ctx.lineWidth = 15;
        } else if (btn.id === 'btnradio3') {
          ctx.lineWidth = 20;
        }
      });
    });



    var isMouseActive = false;
    canvas.addEventListener("mousedown", function(e) {
      isMouseActive = true;
      x1 = e.offsetX;
      y1 = e.offsetY;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
    });


    
    canvas.addEventListener("mousemove", function (e) {
      var eraser = document.getElementById("eraser");//橡皮擦按鈕
      if (eraser.checked && e.buttons === 1) { // 判斷左鍵是否按下
        
        isMouseActive = false;
        console.log("擦");
        var w = 20;
        var h = 20;
        var x = e.pageX - canvas.offsetLeft - w / 2;
        var y = e.pageY - canvas.offsetTop - h / 2;
        ctx.clearRect(x, y, w, h);
      } else {
        
        if (!isMouseActive) {
          return;
        }
        x2 = e.offsetX;
        y2 = e.offsetY;
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke()
        // 更新起始點座標
        x1 = x2
        y1 = y2
      }
    });
    



canvas.addEventListener(upEvent, function(e){
  isMouseActive = false
})

    clear.onclick= function(){
      ClearCanvas();
      ctx.lineWidth = 10;//不加這行會導致 筆畫沒抓到值
    }
});


//清除畫布按鈕
var clear = document.getElementById("clear-canvas");
function ClearCanvas(){
  canvas.width = canvas.width;
  canvas.height = canvas.height;
}
//鼠標改成橡皮擦
const eraserCheckbox = document.getElementById('eraser');
eraserCheckbox.addEventListener('change',function(){
  if (this.checked) {
    canvas.classList.add('eraser');
  } else {
    canvas.classList.remove('eraser');
  }
});


//進階測驗的漢字形狀畫布背景 非常重要
function CanvasHanziBg(char){
  HanziWriter.loadCharacterData(char).then(function(charData) {
    // create a new canvas element
    var canvas = document.createElement('canvas');
    canvas.width = 380;
    canvas.height = 380;
  
    // get the 2d context of the canvas
    var ctx = canvas.getContext('2d');
  
    var svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.style.width = '380px';
    svg.style.height = '380px';
    var group = document.createElementNS('http://www.w3.org/2000/svg', 'g');
  
    // set the transform property on the g element so the character renders at 150x150
    var transformData = HanziWriter.getScalingTransform(380, 380);
    group.setAttributeNS(null, 'transform', transformData.transform);
    svg.appendChild(group);
  
    charData.strokes.forEach(function(strokePath) {
      var path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      path.setAttributeNS(null, 'd', strokePath);
      // style the character paths
      path.style.fill = '#e4e4e4';//path中間填滿
      /* path.style.stroke = '#555'; *///path 邊框
      
      group.appendChild(path);
    });
  
    // draw the SVG onto the canvas
    var svgData = new XMLSerializer().serializeToString(svg);
    var img = new Image();
    img.src = 'data:image/svg+xml;base64,' + btoa(svgData);
    img.onload = function() {
      ctx.drawImage(img, 0, 0);
      // set the canvas as the background of the target canvas element
      var target = document.getElementById('canvas');
      target.style.backgroundImage = 'url(' + canvas.toDataURL() + ')';
    };
    
  });
}






//下載所繪製的圖片
function download(selector) {
  HiddenCanvas();
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
  const dataURL = canvas.toDataURL('img/123.svg');
  const img = new Image();
  img.src =  dataURL;
  
  // 创建链接并下载
  const link = document.createElement('a');
  link.download = '學號_'+AllHanzi[Hanzi_index];
  link.href =  dataURL;
  link.click();
  clear.onclick();
  /* CanvasHanziBg(AllHanzi[Hanzi_index]);
  ctx.putImageData(0, 0, 0); */
}

const buttons = document.querySelectorAll('button');
buttons.forEach(button => {
  button.addEventListener('click', () => {
    const ctx = canvas.getContext('2d')
    const color = button.dataset.color;

    ctx.strokeStyle = color;
  });
});


//按下的按鈕是藍色背景 讓被點選按鈕更醒目。 
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


