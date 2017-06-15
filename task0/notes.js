//To restore notes
if(localStorage.getItem('body'))
{
  document.getElementById('body').innerHTML=localStorage.getItem('body');
}
//function to add new notes
function addItem(e) {                                    
  e.preventDefault();
  var wrapEl=document.getElementById('wrapper');
  var newEl=document.createElement('div');
  newEl.className="block";
  newEl.setAttribute('data-state',"0");
  newEl.innerHTML="<div id=\"remove\"><a href=\"remove.html\" onclick=\"delNote(event)\">Remove<\/a><\/div><div id=\"red\"><a href=\"high.html\" onclick=\"red(event)\">High<\/a>";
  newEl.innerHTML+="<\/div><div id=\"green\"><a href=\"medium.html\" onclick=\"green(event)\">Medium<\/a>";
  newEl.innerHTML+="<\/div><div id=\"blue\"><a href=\"low.html\" onclick=\"blue(event)\">Low<\/a><\/div><div contenteditable=\"true\" id=\"notes\">Type your notes here!<\/div>";
  wrapEl.append(newEl);
}

//event listener to respond when user clicks add notes
var extra = document.getElementById('add');
extra.addEventListener('click', addItem, false);

//to remember the notes body is locally stored using localstorage
function remNotes(){
var notes=document.getElementById('body');
localStorage.setItem('body',notes.innerHTML);
}
window.addEventListener('unload',remNotes,false);

//function to remove notes
function delNote(e){
e.preventDefault();
target=e.target;
target.parentNode.parentNode.parentNode.removeChild(target.parentNode.parentNode);
}
//function to color notes
function red(e){
e.preventDefault();
target=e.target;
target.parentNode.parentNode.className="block r";
target.parentNode.parentNode.setAttribute('data-state','3');
}
function green(e){
e.preventDefault();
target=e.target;
target.parentNode.parentNode.className="block g";
target.parentNode.parentNode.setAttribute('data-state','2');
}
function blue(e){
e.preventDefault();
target=e.target;
target.parentNode.parentNode.className="block b";
target.parentNode.parentNode.setAttribute('data-state','1');
}

//to sort notes
var wrapArr=[];
var count;
var store="";
function sortItem(e)
{
  e.preventDefault();
  wrapArr=document.getElementById('wrapper').children;
  count=wrapArr.length;
  var temp;
  //Bubble Sort
  for(var i=1;i<count;i++)
  {
    for(var j=0;j<count-i;j++)
    {
      if(parseInt(wrapArr[j].getAttribute('data-state'))<parseInt(wrapArr[j+1].getAttribute('data-state')))
      {
        temp=wrapArr[j].outerHTML;
        wrapArr[j].outerHTML=wrapArr[j+1].outerHTML;
        wrapArr[j+1].outerHTML=temp;
      }
    }
  }
    //Updating the Wrapper Content from the sorted divs
  var wrapEl=document.getElementById('wrapper');
  for(var k=0; k<count; k++)
  {
    store+=wrapArr[k].outerHTML;
  }
  wrapEl.innerHTML=store;
  store="";
}
var sortEl = document.getElementById('sort');
sortEl.addEventListener('click', sortItem, false);