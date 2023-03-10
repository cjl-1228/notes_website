var el2 = document.querySelector(".reload-submit-char");
el2.onclick = function(){
    //所有練習的漢字
    var character = document.querySelector('.js-char').value;
    HanziWriter.loadCharacterData(character).then(function(charData) 
    {
          var target = document.getElementById('tmp-svg');
          var svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
          svg.style.width = '100px';
          svg.style.height = '100px';
          target.appendChild(svg);
          var group = document.createElementNS('http://www.w3.org/2000/svg', 'g');
        
          // set the transform property on the g element so the character renders at 150x150
          var transformData = HanziWriter.getScalingTransform(100, 100);
          group.setAttributeNS(null, 'transform', transformData.transform);
          svg.appendChild(group);
          /* target.appendChild(document.createElement("br")); */
        
          charData.strokes.forEach(function(strokePath) {
            var path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
            path.setAttributeNS(null, 'd', strokePath);
            // style the character paths
            path.style.fill = '#555';
            group.appendChild(path);
          });
    });
}