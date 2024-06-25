//création des variables
let examplesData;
let tags;

setTimeout(function(){
  YASGUI.YASQE.defaults.value = `SELECT *
WHERE {
  ?subject ?verb ?complement .
}
LIMIT 100`;
  var options = {
    catalogueEndpoints: [
      { endpoint: "https://data.istex.fr/sparql/", title: "ISTEX" },
      { endpoint: "http://data.persee.fr/sparql/", title: "Persée" },
      { endpoint: "https://lod.abes.fr/sparql", title: "ABES" },
      { endpoint: "http://www.rechercheisidore.fr/sparql", title: "ISIDORE" },
      {
        endpoint: "http://sparql.archives-ouvertes.fr/sparql",
        title: "HAL Archives Ouvertes"
      },
      { endpoint: "http://lod.springer.com/sparql", title: "Springer" },
      {
        endpoint: "https://www.europeandataportal.eu/sparql",
        title: "Portail européen de données"
      },
      { endpoint: "https://data.idref.fr/sparql", title: "IdRef" }
    ]
  };
  YASGUI.defaults.catalogueEndpoints = options.catalogueEndpoints;
  YASGUI.defaults.yasqe.sparql.endpoint = "https://data.istex.fr/sparql/";
  var yasgui = YASGUI(document.getElementById("YASGUI"), options);
  
  fetch('/triplestore/sparql/examples.json').then(response => {
    response.json().then(function(elems){initExamples(elems, yasgui)});
  });
  
}, 1000);

function initExamples(examplesInJson, yasgui) {
  //initialisation des exemples et des tags
  examplesData = examplesInJson;
  tags = Array();
  examplesData.forEach(function(example, index){
    example.id = index;
    if(example.content !== undefined){
      const content = getUrlArgs(example.content);
      if(content.query !== undefined){
        example.query = content.query;
      }
      if(content.endpoint !== undefined){
        example.endpoint = content.endpoint;
      }
    }
  });
  
  var examplesPopup = document.getElementById("popupExamples");
  
  //chargement des tags
  var tagsListHtml = document.getElementById("tagsList");
  examplesData.forEach(function(ex){
    if(ex.tags !== undefined){
      ex.tags.forEach(function(tag){
        if(!tags.includes(tag)){
          tags.push(tag);
          var tagId = tags.length-1;
          
          var tagHtml = document.createElement('div');
          var tagCheckbox = document.createElement('input');
          tagCheckbox.classList.add('tagCheckbox');
          tagCheckbox.id = 'tag_' + tagId;
          tagCheckbox.setAttribute('name', 'tagCheckbox');
          tagCheckbox.setAttribute('type', 'checkbox');
          tagCheckbox.setAttribute('value', tag);
          tagHtml.appendChild(tagCheckbox);
          var tagLabel = document.createElement('label');
          tagLabel.appendChild(document.createTextNode(tag));
          tagLabel.setAttribute('for', 'tag_' + tagId);
          tagHtml.appendChild(tagLabel);
          tagsListHtml.appendChild(tagHtml);
          tagCheckbox.addEventListener('change', refreshList);
        }
      });
    }
  });
  
  //chargement des exemples depuis le fichier json en appliquant les filtres
  refreshList();
  
  var executeBt = document.getElementById('executeExample');
  executeBt.addEventListener('click', function(){
    var selected = examplesData[getSelectedExample()];
    if(selected === undefined) return;    
    var newTab = yasgui.addTab();
    newTab.rename(selected.title);
    var query = selected.query;
    //ajoute la description en commentaire au début de la requete
    if(selected.description !== undefined){
      query = '# ' + wordwrap(selected.description, 80, '# ') + '\n\n' + selected.query;
    }
    newTab.setQuery(query);
    var endpoint = selected.endpoint;
    if(endpoint !== undefined) {
      newTab.setEndpoint(endpoint);
    }else{
      newTab.setEndpoint(YASGUI.defaults.yasqe.sparql.endpoint);
    }
    hidePopup(examplesPopup);
    newTab.yasqe.query();
  });
  
  var closeBts =  document.querySelectorAll('.closePopup');
  closeBts.forEach(elem => {
    elem.addEventListener('click', function(){
      hidePopup(elem.closest('.popupContainer'));
    });
  })
  
  
  //affichage des exemples lors du click sur le bouton "executer des exemples"
  document.getElementById('showExamples').addEventListener('click', function(){ 
    showPopup(examplesPopup);
  });
  
  //affichage du diagramme lors du click sur le bouton "structure des données"
  const diagramPopup = document.getElementById('popupDiagram');
  document.getElementById('showDiagram').addEventListener('click', function(){ 
    showPopup(diagramPopup);
  });
  
  //affichage des dumps lors du click sur le bouton "voir les dumps"
  const dumpsPopup = document.getElementById('popupDumps');
  const dumpsIframe = document.getElementById('dumpsFrame');
  document.getElementById('showDumps').addEventListener('click', function(){
    showPopup(dumpsPopup);
    dumpsIframe.setAttribute('src', '//public-dumps.data.istex.fr/');
  });
  
  //affichage de la sélection de tags
  document.querySelectorAll('.dropdown-toggle').forEach((e) =>{
    e.addEventListener('click', function(){
      var stateOpen = e.parentNode.classList.contains('dropdown-open');
      closeDropdowns();
      if(!stateOpen){
        e.parentNode.classList.add('dropdown-open');
      }
    });
  });
  
  //recherche
  document.getElementById('searchExamples').addEventListener('keyup', function(){
    refreshList();
  });
  
  // détection du clavier
  document.addEventListener('keyup', function(event){
    //appui sur la touche échap
    if(event.code === "Escape"){
      //fermeture de la sélection des tags
      if(closeDropdowns()) { return; }
      //fermeture de la pop-up
      const openPopup = document.querySelector('.showPopup');
      if(openPopup !== undefined){
        hidePopup(openPopup);
        return;
      }
    }
  });
  
  //interactions de fermeture au clic n'importe où sur la page
  document.addEventListener('click', function(event){
    //fermetures des dropdowns
    if(event.target.closest('.dropdown-open') === null && closeDropdowns()) return null;
    
    //fermeture de la popup
    const popupContainer = event.target.closest('.popupContainer');
    if(popupContainer !== null) {
      if(event.target.closest('.popup') !== null) return;
      hidePopup(popupContainer);
      return;
    }
  }); 
}

function refreshList(){
  var examplesDiv = document.getElementById("examples");
  
  examplesDiv.innerHTML = "";
  
  var search = document.getElementById('searchExamples').value;
  var selectedTags = getSelectedTags();
  
  examplesData
  .filter(function(example){
    return shouldShowExample(example, search, selectedTags)
  })
  .forEach((example) => {
    //récupération et formatage des données
    
    const {id, title, description, tags} = example;
    
    if(title === "---"){
      var hr = document.createElement("hr");
      examplesDiv.appendChild(hr);
      return;
    }
    
    //création du html correspondant
    var li = document.createElement("li");
    li.classList.add("exampleItem");
    
    var radioBt = document.createElement('input');
    radioBt.setAttribute("type", "radio");
    radioBt.setAttribute("name", "exampleRadioButton");
    radioBt.setAttribute("value", id);
    li.appendChild(radioBt);
    
    var titleElement = document.createElement('h4');
    titleElement.classList.add('title')
    titleElement.appendChild(document.createTextNode(title));
    li.appendChild(titleElement);
    
    var descDiv = document.createElement('div');
    descDiv.classList.add('description');
    if(description !== undefined){
      descDiv.appendChild(document.createTextNode(description));
    }
    li.appendChild(descDiv);
    
    
    if(tags !== undefined){
      var tagsDiv = document.createElement('div');
      tagsDiv.classList.add('tags');
      tags.forEach(function(tag){
        var tagBadge = document.createElement('span');
        tagBadge.classList.add('tag');
        tagBadge.classList.add('badge');
        tagBadge.appendChild(document.createTextNode(tag));
        tagsDiv.appendChild(tagBadge);
      });
      li.appendChild(tagsDiv);
    }
    
    //événement de clic sur chaque exemple
    li.addEventListener('click', function(){
      li.childNodes[0].click();
      document.getElementById('executeExample').removeAttribute("disabled");
    });
    
    //ajout des exemples dans le DOM
    examplesDiv.appendChild(li);
  });
}

function shouldShowExample(elem, search, selectedTags){  
  
  //si pas de titre ou de requête
  if(elem.title === undefined || (elem.query === undefined && elem.title !== '---' )) { return false; }
  
  //pas de filtre
  if(selectedTags.length === 0 && search === "") { return true; }
  
  
  //fonction de vérification de recherche
  // soluttion trouvées à partir de https://stackoverflow.com/questions/990904/remove-accents-diacritics-in-a-string-in-javascript
  var contains = function(text, search){
    var textNormalized = text.normalize('NFD').replace(/[^\w\s]|_/g, "").replace(/\s+/g, "").toLowerCase();
    var searchNormalized = search.normalize('NFD').replace(/[^\w\s]|_/g, "").replace(/\s+/g, "").toLowerCase();
    
    return textNormalized.includes(searchNormalized);
  }
  
  const matchTitle = elem.title !== undefined && contains(elem.title, search);
  const matchDescription = elem.description !== undefined && contains(elem.description, search);
  const matchTitleOrDescription = matchTitle || matchDescription;
  
  //filtre uniquement sur titre et description
  if (selectedTags.length === 0 && matchTitleOrDescription) { return true; }
  
  //filtre si des tags sont selectionnés
  const isSelectedTag = t => selectedTags.includes(t);
  return elem.tags !== undefined && (search === '' || matchTitleOrDescription) && elem.tags.some(isSelectedTag);
}

function getSelectedExample(){
  var radios = document.getElementsByName('exampleRadioButton');
  for(var i = 0; i < radios.length; i++) {
    if(radios[i].checked) {
      return radios[i].value;
    }
  }
  
  return -1;
}

function getSelectedTags(){
  var checkboxes = document.getElementsByName('tagCheckbox');
  return Array.from(checkboxes).filter(checkbox => checkbox.checked).map(checkbox => checkbox.value);
}

function showPopup(popup){
  popup.classList.remove('hidePopup');
  popup.classList.add('showPopup');
  document.body.style.setProperty('padding-right', '15px');
  document.body.style.setProperty('overflow', 'hidden');
}

function hidePopup(popup){
  popup.classList.remove('showPopup');
  popup.classList.add('hidePopup');
  document.body.classList.remove('popupMode');
  setTimeout(() => {
    document.body.style.removeProperty('padding-right');
    document.body.style.removeProperty('overflow');
  }, 500);
}

function closeDropdowns(){
  var openedDropdowns = document.querySelectorAll('.dropdown-open');
  if(openedDropdowns.length > 0){
    openedDropdowns.forEach((dropdown) => {
      dropdown.classList.remove('dropdown-open');
    });
    return true;
  }
  return false;
}

function getUrlArgs(url){
  const reduced = url.substr(url.indexOf('#') + 1);
  const keysValues = reduced.split('&').map((elem) => elem.split('='));
  const cleaned = keysValues.map((keyValue) => keyValue.map(elem => decodeURIComponent(elem.replace(/\+/g, ' '))));
  return Object.fromEntries(cleaned);
}

function wordwrap(str, width, startLine){
  if(str === null) return '';
  if(width === null) { width = 50; }
  if(startLine === null) { startLine = ''; }
  
  const regexString = '.{1,' + width + '}([\\s\u200B]+|$)|[^\\s\u200B]+?([\\s\u200B]+|$)';
  const regExp = new RegExp(regexString, 'g');
  const lines = str.match(regExp) || [];
  return lines.join('\n' + startLine);
}